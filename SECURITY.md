# 🔒 Security Policy

## Supported Versions

I am committed to keeping **Moodscape** a safe and secure environment for emotional reflection. Currently, only the latest version deployed to the live site is actively supported with security updates.

| Version | Supported |
| --- | --- |
| 1.0.x | :white_check_mark: |
| < 1.0 | :x: |

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please **do not open a public issue.** I value your help in keeping user data private.

Please report vulnerabilities through the following steps:

1. **Email:** Reach out to me at **[bakshiditsa@gmail.com]**.
2. **Details:** Include a description of the vulnerability, the steps to reproduce it, and any potential impact.
3. **Response:** You can expect an acknowledgment of your report within **48 hours**.
4. **Fix:** Once the vulnerability is confirmed, I will push a fix to the live site at [moodscape-457e7.web.app](https://www.google.com/search?q=https://moodscape-457e7.web.app) as soon as possible.

## 🛡️ Security Implementation in Moodscape

To protect your personal journals and mood history, the following security measures are implemented:

* **Authentication:** Powered by **Firebase Auth**, ensuring industry-standard password encryption and session management.
* **Database Isolation:** **Firestore Security Rules** are configured to ensure that a user can only read, write, or delete data that contains their specific `userId`.
* **Frontend Sanitization:** React's built-in protection against Cross-Site Scripting (XSS) is utilized throughout the app.
* **Environment Safety:** No sensitive administrative keys are exposed in the client-side code; all Firebase keys provided are restricted to web-only access via the Firebase Console.

---
