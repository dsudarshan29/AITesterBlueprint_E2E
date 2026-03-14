package com.ricepot.tests;

import com.ricepot.base.BaseTest;
import com.ricepot.config.ConfigReader;
import com.ricepot.pages.LoginPage;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class LoginValidTest extends BaseTest {

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
    public void verifyLoginPageTitle() {
        try {
            String title = loginPage.getPageTitle();
            Assert.assertTrue(title.contains("Login") || title.contains("Salesforce"),
                    "Page title does not contain expected text. Actual: " + title);
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("verifyLoginPageTitle failed: " + e.getMessage());
        }
    }

    @Test(priority = 2)
    public void verifyLoginPageElements() {
        try {
            Assert.assertTrue(loginPage.isUsernameFieldDisplayed(), "Username field is not displayed");
            Assert.assertTrue(loginPage.isPasswordFieldDisplayed(), "Password field is not displayed");
            Assert.assertTrue(loginPage.isLoginButtonDisplayed(), "Login button is not displayed");
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("verifyLoginPageElements failed: " + e.getMessage());
        }
    }

    @Test(priority = 3)
    public void verifyLoginPageUrl() {
        try {
            String currentUrl = loginPage.getCurrentUrl();
            Assert.assertTrue(currentUrl.contains("login.salesforce.com"),
                    "URL does not contain expected domain. Actual: " + currentUrl);
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("verifyLoginPageUrl failed: " + e.getMessage());
        }
    }

    @Test(priority = 4)
    public void verifyRememberMeCheckboxToggle() {
        try {
            boolean initialState = loginPage.isRememberMeSelected();
            loginPage.toggleRememberMe();
            boolean toggledState = loginPage.isRememberMeSelected();
            Assert.assertNotEquals(initialState, toggledState,
                    "Remember Me checkbox state did not change after toggle");
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("verifyRememberMeCheckboxToggle failed: " + e.getMessage());
        }
    }

    @Test(priority = 5)
    public void verifyValidLogin() {
        try {
            String username = ConfigReader.getProperty("valid.username");
            String password = ConfigReader.getProperty("valid.password");
            loginPage.doLogin(username, password);
            String currentUrl = loginPage.getCurrentUrl();
            Assert.assertFalse(currentUrl.contains("login.salesforce.com"),
                    "Login failed — still on login page. URL: " + currentUrl);
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("verifyValidLogin failed: " + e.getMessage());
        }
    }
}
