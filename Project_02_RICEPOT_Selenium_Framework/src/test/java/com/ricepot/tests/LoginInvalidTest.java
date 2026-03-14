package com.ricepot.tests;

import com.ricepot.base.BaseTest;
import com.ricepot.config.ConfigReader;
import com.ricepot.pages.LoginPage;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class LoginInvalidTest extends BaseTest {

    private LoginPage loginPage;

    @BeforeMethod
    public void initPage() {
        try {
            getDriver().get(ConfigReader.getProperty("base.url"));
            loginPage = new LoginPage(getDriver());
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize LoginPage: " + e.getMessage());
        }
    }

    @Test(priority = 1)
    public void verifyLoginWithEmptyCredentials() {
        try {
            loginPage.doLogin("", "");
            Assert.assertTrue(loginPage.isErrorMessageDisplayed(),
                    "Error message not displayed for empty credentials");
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("verifyLoginWithEmptyCredentials failed: " + e.getMessage());
        }
    }

    @Test(priority = 2)
    public void verifyLoginWithEmptyUsername() {
        try {
            loginPage.doLogin("", "InvalidPass123!");
            Assert.assertTrue(loginPage.isErrorMessageDisplayed(),
                    "Error message not displayed for empty username");
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("verifyLoginWithEmptyUsername failed: " + e.getMessage());
        }
    }

    @Test(priority = 3)
    public void verifyLoginWithEmptyPassword() {
        try {
            loginPage.doLogin("invaliduser@test.com", "");
            Assert.assertTrue(loginPage.isErrorMessageDisplayed(),
                    "Error message not displayed for empty password");
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("verifyLoginWithEmptyPassword failed: " + e.getMessage());
        }
    }

    @Test(priority = 4)
    public void verifyLoginWithInvalidUsername() {
        try {
            loginPage.doLogin("nonexistent_user@invalid.com", "SomePassword123!");
            Assert.assertTrue(loginPage.isErrorMessageDisplayed(),
                    "Error message not displayed for invalid username");
            String errorText = loginPage.getErrorMessage();
            Assert.assertFalse(errorText.isEmpty(),
                    "Error message text is empty for invalid username");
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("verifyLoginWithInvalidUsername failed: " + e.getMessage());
        }
    }

    @Test(priority = 5)
    public void verifyLoginWithInvalidPassword() {
        try {
            loginPage.doLogin("testuser@salesforce.com", "WrongPassword!@#456");
            Assert.assertTrue(loginPage.isErrorMessageDisplayed(),
                    "Error message not displayed for invalid password");
            String errorText = loginPage.getErrorMessage();
            Assert.assertFalse(errorText.isEmpty(),
                    "Error message text is empty for invalid password");
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("verifyLoginWithInvalidPassword failed: " + e.getMessage());
        }
    }

    @Test(priority = 6)
    public void verifyLoginWithBothInvalidCredentials() {
        try {
            loginPage.doLogin("fake_user@nowhere.com", "FakePass!@#789");
            Assert.assertTrue(loginPage.isErrorMessageDisplayed(),
                    "Error message not displayed for both invalid credentials");
            String currentUrl = loginPage.getCurrentUrl();
            Assert.assertTrue(currentUrl.contains("login.salesforce.com"),
                    "User navigated away from login page with invalid credentials");
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("verifyLoginWithBothInvalidCredentials failed: " + e.getMessage());
        }
    }

    @Test(priority = 7)
    public void verifyLoginWithSqlInjection() {
        try {
            loginPage.doLogin("' OR '1'='1' --", "' OR '1'='1' --");
            Assert.assertTrue(loginPage.isErrorMessageDisplayed(),
                    "Error message not displayed for SQL injection attempt");
            String currentUrl = loginPage.getCurrentUrl();
            Assert.assertTrue(currentUrl.contains("login.salesforce.com"),
                    "SQL injection bypassed login — security vulnerability detected");
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("verifyLoginWithSqlInjection failed: " + e.getMessage());
        }
    }

    @Test(priority = 8)
    public void verifyLoginWithXssAttempt() {
        try {
            loginPage.doLogin("<script>alert('xss')</script>", "<script>alert('xss')</script>");
            Assert.assertTrue(loginPage.isErrorMessageDisplayed(),
                    "Error message not displayed for XSS attempt");
            String currentUrl = loginPage.getCurrentUrl();
            Assert.assertTrue(currentUrl.contains("login.salesforce.com"),
                    "XSS attack bypassed login — security vulnerability detected");
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("verifyLoginWithXssAttempt failed: " + e.getMessage());
        }
    }

    @Test(priority = 9)
    public void verifyErrorMessagePersistsOnLoginPage() {
        try {
            loginPage.doLogin("invalid@test.com", "invalid123");
            Assert.assertTrue(loginPage.isErrorMessageDisplayed(),
                    "Error message not displayed after invalid login");
            Assert.assertTrue(loginPage.isLoginButtonDisplayed(),
                    "Login button not visible after failed login — user stuck on error state");
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("verifyErrorMessagePersistsOnLoginPage failed: " + e.getMessage());
        }
    }
}
