# Authentication configuration

- Provider(s): Email/Password and Google (Firebase console, Authentication, Sign-in method)
- Self-registration: allowed
- Password rules: minimum 8 characters enforced on the signup form; Firebase default minimum is 6
- Email verification: not required for the MVP (decision to revisit)
- Authorized domains: localhost, powerguard-077.firebaseapp.com, powerguard-077.web.app
- Web config: frontend/firebase-config.js (public identifiers, not secrets)
- Frontend files: frontend/HTML/index.html and frontend/JS/index.js
- Backend identity (planned): the API will verify the Firebase ID token and take the uid from the verified token, never from the request body

## Verification performed
Date: 04/11/2026   Tested by: Chinonso

| Check | Result |
|---|---|
| Register a new user with email and password | Passed |
| Log in with the same credentials | Passed |
| Wrong password is rejected | Not tested yet |
| Duplicate email is rejected | Not tested yet |
| Password shorter than 8 characters is rejected | Not tested yet |
| Google sign-in | Not tested yet |
| Forgot-password email | Not tested yet |

## Known gaps
- No redirect after login or signup yet (temporary alerts). Navigation will be added with the dashboard and business setup pages.
- Backend token verification is not built yet.

## How to re-run
Serve the frontend with Live Server and open frontend/HTML/index.html. Create a test account with a throwaway password and delete it afterwards in Firebase console, Authentication, Users.