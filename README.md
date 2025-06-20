
# 🛡️ Express Server: DoS Protection with Rate Limiting & CAPTCHA (Cloudflare Turnstile)

This Express.js backend demonstrates protection against **Denial of Service (DoS)** attacks using:

- ✅ **Rate limiting** with `express-rate-limit`
- ✅ **CAPTCHA verification** via [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
- ✅ Simple OTP-based password reset flow

---

## 🚀 Features

- `/generate-otp`:
  - Rate-limited to 3 requests per 5 minutes per IP.
  - Generates a 6-digit OTP and stores it in memory.
  
- `/reset-password`:
  - Protected by:
    - CAPTCHA verification (Turnstile)
    - Rate limiting (5 attempts per 15 minutes)
    - OTP validation
  - Simulates a secure password reset flow.

---

## 🧱 Tech Stack

- [Express.js](https://expressjs.com/)
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
- [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)
- [axios](https://www.npmjs.com/package/axios)
- [form-data](https://www.npmjs.com/package/form-data)
- [dotenv](https://www.npmjs.com/package/dotenv)

---


