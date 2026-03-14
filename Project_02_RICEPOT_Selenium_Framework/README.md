# Salesforce Login Automation Framework

This is a robust, enterprise-level Selenium automation framework built to test the Salesforce login page (`login.salesforce.com`). 

## Framework Architecture & Technologies

- **Language:** Java
- **Build Tool:** Maven
- **Test Framework:** TestNG
- **Web Automation:** Selenium WebDriver
- **Design Pattern:** Page Object Model (POM) with PageFactory
- **Locator Strategy:** 100% XPath

## Project Structure

```text
Project_02_RICEPOT_Selenium_Framework
├── src/
│   ├── main/
│   │   ├── java/com/ricepot/
│   │   │   ├── config/ConfigReader.java      # Reads properties from config.properties
│   │   │   └── pages/LoginPage.java          # Page Object containing WebElements and actions
│   │   └── resources/
│   │       └── config.properties             # Environment variables (URLs, timeouts, credentials)
│   ├── test/
│   │   └── java/com/ricepot/
│   │       ├── base/BaseTest.java            # Setup and Teardown (WebDriver initialization)
│   │       └── tests/
│   │           ├── LoginValidTest.java       # Positive test cases
│   │           └── LoginInvalidTest.java     # Negative test cases
├── pom.xml                                       # Maven dependencies (Selenium, TestNG, WebDriverManager)
├── testng.xml                                    # TestNG suite execution configuration
└── README.md                                     # This file
```

## Setup Instructions

1. **Pre-requisites:**
   - Java Development Kit (JDK) 11 or higher installed.
   - Maven installed and configured in your system path.

2. **Configuration:**
   Before running tests, update the `config.properties` file located at `src/main/resources/config.properties`:
   
   ```properties
   base.url=https://login.salesforce.com/?locale=in
   browser=chrome
   implicit.wait=10
   explicit.wait=15
   
   # Add your valid test credentials here
   valid.username=YOUR_SALESFORCE_USERNAME
   valid.password=YOUR_SALESFORCE_PASSWORD
   ```

## Running the Tests

You can execute the automated test suite using Maven from the command line:

```bash
# Clean previous builds and compile the code
mvn clean compile

# Run the TestNG suite (executes both valid and invalid test scripts)
mvn clean test
```

## Adding New Tests

1. **Update Page Objects (if necessary):** If you are testing a new page or interacting with new elements, add them to `LoginPage.java` or create a new Page Object class in `src/main/java/com/ricepot/pages/`. Use `@FindBy` with `how = How.XPATH`.
2. **Create Test Class:** Add your new test cases in `src/test/java/com/ricepot/tests/`. Ensure your test class extends `BaseTest`.
3. **Use TestNG Annotations:** Apply relevant annotations like `@Test`, `@BeforeMethod`, and setting priorities.
4. **Update `testng.xml`:** Add your new test classes to the `<classes>` block inside `testng.xml` so they are included in the test execution sequence.

## Best Practices Followed

- **No `Thread.sleep()`:** All synchronization is handled dynamically via Selenium's `WebDriverWait` for elements to be visible, clickable, etc.
- **Centralized Configuration:** All variable data (URL, Wait Times, Browser Choice) is pulled from `config.properties`.
- **Exception Handling:** Explicit robust `try-catch` blocks are used to catch test failures and report them cleanly to TestNG instead of crashing the thread abruptly.
- **Code Separation:** Strict separation between test logic (Assertions/Verifications) and page behavior (Clicking, Typing, Element Locating).
