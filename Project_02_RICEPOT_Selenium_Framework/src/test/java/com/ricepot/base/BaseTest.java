package com.ricepot.base;

import com.ricepot.config.ConfigReader;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;

import java.time.Duration;

public class BaseTest {

    protected static ThreadLocal<WebDriver> driverThreadLocal = new ThreadLocal<>();

    @BeforeTest
    public void setUp() {
        try {
            String browser = ConfigReader.getProperty("browser").toLowerCase();
            WebDriver driver;

            switch (browser) {
                case "chrome" -> {
                    WebDriverManager.chromedriver().setup();
                    ChromeOptions chromeOptions = new ChromeOptions();
                    chromeOptions.addArguments("--start-maximized");
                    chromeOptions.addArguments("--disable-notifications");
                    chromeOptions.addArguments("--remote-allow-origins=*");
                    driver = new ChromeDriver(chromeOptions);
                }
                case "firefox" -> {
                    WebDriverManager.firefoxdriver().setup();
                    FirefoxOptions firefoxOptions = new FirefoxOptions();
                    driver = new FirefoxDriver(firefoxOptions);
                    driver.manage().window().maximize();
                }
                case "edge" -> {
                    WebDriverManager.edgedriver().setup();
                    EdgeOptions edgeOptions = new EdgeOptions();
                    edgeOptions.addArguments("--start-maximized");
                    driver = new EdgeDriver(edgeOptions);
                }
                default -> throw new RuntimeException("Unsupported browser: " + browser);
            }

            driver.manage().timeouts().implicitlyWait(
                    Duration.ofSeconds(ConfigReader.getIntProperty("implicit.wait"))
            );
            driver.manage().deleteAllCookies();
            driverThreadLocal.set(driver);
            getDriver().get(ConfigReader.getProperty("base.url"));
        } catch (Exception e) {
            throw new RuntimeException("Browser setup failed: " + e.getMessage());
        }
    }

    @AfterTest
    public void tearDown() {
        try {
            if (getDriver() != null) {
                getDriver().quit();
                driverThreadLocal.remove();
            }
        } catch (Exception e) {
            throw new RuntimeException("Browser teardown failed: " + e.getMessage());
        }
    }

    protected WebDriver getDriver() {
        return driverThreadLocal.get();
    }
}
