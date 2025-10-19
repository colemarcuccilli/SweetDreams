# Sweet Dreams Email Templates for Supabase

---

## Confirm Signup

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #000000;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <!-- Logo Header -->
          <tr>
            <td align="center" style="padding: 40px 40px 20px 40px;">
              <img src="https://sweet-dreams-phi.vercel.app/sweet-dreams-logo.jpg" alt="Sweet Dreams" style="width: 150px; height: auto;">
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <h1 style="font-family: Arial, sans-serif; font-size: 32px; font-weight: bold; text-transform: uppercase; color: #000000; text-align: center; margin: 20px 0;">Welcome to Sweet Dreams</h1>
              <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333333; line-height: 1.6; text-align: center; margin: 20px 0;">Thank you for signing up! Please confirm your email address to get started.</p>
              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #000000; color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; text-transform: uppercase; text-decoration: none; padding: 16px 48px; border-radius: 4px; letter-spacing: 0.1em;">Confirm Email</a>
                  </td>
                </tr>
              </table>
              <p style="font-family: Arial, sans-serif; font-size: 14px; color: #666666; line-height: 1.6; text-align: center; margin: 20px 0;">If you didn't create this account, you can safely ignore this email.</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f5f5f5; padding: 20px 40px; text-align: center;">
              <p style="font-family: Arial, sans-serif; font-size: 12px; color: #999999; margin: 0;">&copy; 2025 Sweet Dreams Music LLC. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## Invite User

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #000000;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <!-- Logo Header -->
          <tr>
            <td align="center" style="padding: 40px 40px 20px 40px;">
              <img src="https://sweet-dreams-phi.vercel.app/sweet-dreams-logo.jpg" alt="Sweet Dreams" style="width: 150px; height: auto;">
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <h1 style="font-family: Arial, sans-serif; font-size: 32px; font-weight: bold; text-transform: uppercase; color: #000000; text-align: center; margin: 20px 0;">You've Been Invited</h1>
              <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333333; line-height: 1.6; text-align: center; margin: 20px 0;">You've been invited to join Sweet Dreams. Click below to accept your invitation and create your account.</p>
              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #000000; color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; text-transform: uppercase; text-decoration: none; padding: 16px 48px; border-radius: 4px; letter-spacing: 0.1em;">Accept Invitation</a>
                  </td>
                </tr>
              </table>
              <p style="font-family: Arial, sans-serif; font-size: 14px; color: #666666; line-height: 1.6; text-align: center; margin: 20px 0;">This invitation was sent to you by a Sweet Dreams team member.</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f5f5f5; padding: 20px 40px; text-align: center;">
              <p style="font-family: Arial, sans-serif; font-size: 12px; color: #999999; margin: 0;">&copy; 2025 Sweet Dreams Music LLC. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## Magic Link

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #000000;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <!-- Logo Header -->
          <tr>
            <td align="center" style="padding: 40px 40px 20px 40px;">
              <img src="https://sweet-dreams-phi.vercel.app/sweet-dreams-logo.jpg" alt="Sweet Dreams" style="width: 150px; height: auto;">
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <h1 style="font-family: Arial, sans-serif; font-size: 32px; font-weight: bold; text-transform: uppercase; color: #000000; text-align: center; margin: 20px 0;">Log In to Sweet Dreams</h1>
              <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333333; line-height: 1.6; text-align: center; margin: 20px 0;">Click the button below to securely log in to your account.</p>
              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #000000; color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; text-transform: uppercase; text-decoration: none; padding: 16px 48px; border-radius: 4px; letter-spacing: 0.1em;">Log In</a>
                  </td>
                </tr>
              </table>
              <p style="font-family: Arial, sans-serif; font-size: 14px; color: #666666; line-height: 1.6; text-align: center; margin: 20px 0;">If you didn't request this login link, you can safely ignore this email.</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f5f5f5; padding: 20px 40px; text-align: center;">
              <p style="font-family: Arial, sans-serif; font-size: 12px; color: #999999; margin: 0;">&copy; 2025 Sweet Dreams Music LLC. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## Change Email Address

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #000000;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <!-- Logo Header -->
          <tr>
            <td align="center" style="padding: 40px 40px 20px 40px;">
              <img src="https://sweet-dreams-phi.vercel.app/sweet-dreams-logo.jpg" alt="Sweet Dreams" style="width: 150px; height: auto;">
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <h1 style="font-family: Arial, sans-serif; font-size: 32px; font-weight: bold; text-transform: uppercase; color: #000000; text-align: center; margin: 20px 0;">Confirm Email Change</h1>
              <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333333; line-height: 1.6; text-align: center; margin: 20px 0;">You've requested to change your email address from <strong>{{ .Email }}</strong> to <strong>{{ .NewEmail }}</strong>.</p>
              <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333333; line-height: 1.6; text-align: center; margin: 20px 0;">Click below to confirm this change.</p>
              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #000000; color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; text-transform: uppercase; text-decoration: none; padding: 16px 48px; border-radius: 4px; letter-spacing: 0.1em;">Confirm Change</a>
                  </td>
                </tr>
              </table>
              <p style="font-family: Arial, sans-serif; font-size: 14px; color: #666666; line-height: 1.6; text-align: center; margin: 20px 0;">If you didn't make this request, please contact us immediately.</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f5f5f5; padding: 20px 40px; text-align: center;">
              <p style="font-family: Arial, sans-serif; font-size: 12px; color: #999999; margin: 0;">&copy; 2025 Sweet Dreams Music LLC. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## Reset Password

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #000000;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <!-- Logo Header -->
          <tr>
            <td align="center" style="padding: 40px 40px 20px 40px;">
              <img src="https://sweet-dreams-phi.vercel.app/sweet-dreams-logo.jpg" alt="Sweet Dreams" style="width: 150px; height: auto;">
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <h1 style="font-family: Arial, sans-serif; font-size: 32px; font-weight: bold; text-transform: uppercase; color: #000000; text-align: center; margin: 20px 0;">Reset Your Password</h1>
              <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333333; line-height: 1.6; text-align: center; margin: 20px 0;">We received a request to reset your password. Click the button below to create a new password.</p>
              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #000000; color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; text-transform: uppercase; text-decoration: none; padding: 16px 48px; border-radius: 4px; letter-spacing: 0.1em;">Reset Password</a>
                  </td>
                </tr>
              </table>
              <p style="font-family: Arial, sans-serif; font-size: 14px; color: #666666; line-height: 1.6; text-align: center; margin: 20px 0;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f5f5f5; padding: 20px 40px; text-align: center;">
              <p style="font-family: Arial, sans-serif; font-size: 12px; color: #999999; margin: 0;">&copy; 2025 Sweet Dreams Music LLC. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## Reauthentication

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #000000;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <!-- Logo Header -->
          <tr>
            <td align="center" style="padding: 40px 40px 20px 40px;">
              <img src="https://sweet-dreams-phi.vercel.app/sweet-dreams-logo.jpg" alt="Sweet Dreams" style="width: 150px; height: auto;">
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <h1 style="font-family: Arial, sans-serif; font-size: 32px; font-weight: bold; text-transform: uppercase; color: #000000; text-align: center; margin: 20px 0;">Verification Code</h1>
              <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333333; line-height: 1.6; text-align: center; margin: 20px 0;">Use the code below to verify your identity:</p>
              <!-- Code Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background-color: #f5f5f5; border: 2px solid #000000; padding: 20px 40px; border-radius: 4px;">
                      <p style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; color: #000000; margin: 0; letter-spacing: 0.2em;">{{ .Token }}</p>
                    </div>
                  </td>
                </tr>
              </table>
              <p style="font-family: Arial, sans-serif; font-size: 14px; color: #666666; line-height: 1.6; text-align: center; margin: 20px 0;">This code will expire in 15 minutes.</p>
              <p style="font-family: Arial, sans-serif; font-size: 14px; color: #666666; line-height: 1.6; text-align: center; margin: 20px 0;">If you didn't request this code, you can safely ignore this email.</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f5f5f5; padding: 20px 40px; text-align: center;">
              <p style="font-family: Arial, sans-serif; font-size: 12px; color: #999999; margin: 0;">&copy; 2025 Sweet Dreams Music LLC. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## Instructions for Supabase Setup

### How to Add These Templates to Supabase:

1. Go to your Supabase Dashboard → Authentication → Email Templates
2. For each email type, copy the HTML code (everything inside the code block) and paste it into the corresponding template field
3. Save each template

### About Email Rate Limits:

The warning about rate limits is important. For production, you should set up a custom SMTP server:

**Recommended SMTP Services:**
- **Resend** (Modern, developer-friendly, affordable)
- **SendGrid** (Established, reliable)
- **Amazon SES** (Cost-effective for high volume)
- **Postmark** (Excellent deliverability)

**To Set Up Custom SMTP in Supabase:**
1. Dashboard → Settings → Auth → SMTP Settings
2. Enable Custom SMTP
3. Enter your SMTP credentials from your chosen provider
4. Test the connection

This will remove rate limits and give you better email deliverability and tracking.