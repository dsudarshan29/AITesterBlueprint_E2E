# Login Page Test Cases

Generated based on `Login_Page.png` and `Login_Page_Error.png` using the `test_cases_creation.md` prompt.

| TID | Category | Description | Pre-conditions | Steps | Expected | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC01 | Functional | Successful login with valid credentials | User has a valid account | 1. Enter valid email ID. <br> 2. Enter valid password. <br> 3. Click Sign in. | User is logged in successfully. | High |
| TC02 | Negative | Login with invalid email | None | 1. Enter invalid email ID. <br> 2. Enter valid password. <br> 3. Click Sign in. | Error message: "Your email, password, IP address or location did not match" is displayed. | High |
| TC03 | Negative | Login with invalid password | None | 1. Enter valid email ID. <br> 2. Enter invalid password. <br> 3. Click Sign in. | Error message: "Your email, password, IP address or location did not match" is displayed. | High |
| TC04 | Functional | Password visibility toggle | None | 1. Enter text in password field. <br> 2. Click the eye icon. | Password should toggle between masked and unmasked. | Medium |
| TC05 | Functional | Forgot Password link | None | 1. Click "Forgot Password?". | Navigation to password recovery page. | High |
| TC06 | Functional | Remember me checkbox | None | 1. Check "Remember me". <br> 2. Login. | User session should be remembered for subsequent visits. | Medium |
| TC07 | Functional | Sign in with Google | None | 1. Click "Sign in with Google". | Redirect to Google OAuth page. | Medium |
| TC08 | Functional | Sign in using SSO | None | 1. Click "Sign in using SSO". | Navigation to SSO login page. | Medium |
| TC09 | Functional | Sign in with Passkey | None | 1. Click "Sign in with Passkey". | Prompt for passkey authentication. | Medium |
| TC10 | Functional | Start a FREE TRIAL link | None | 1. Click "Start a FREE TRIAL". | Navigation to trial registration page. | Medium |
| TC11 | Functional | Privacy Policy link | None | 1. Click "Privacy policy". | Navigation to Privacy Policy page. | Low |
| TC12 | Functional | Terms link | None | 1. Click "Terms". | Navigation to Terms of Service page. | Low |
