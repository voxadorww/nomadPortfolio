# Portfolio Setup Guide

## Getting Started

Your Nomad portfolio is ready! Here's how to set it up:

### 1. Create Your Admin Account

Since there's no public signup, you need to create your admin account first:

1. **Triple-click the logo** "itsnomad.lol" at the top of the page
2. OR click the **tiny dot** in the footer (right side)
3. This will open the hidden admin login modal

For your first login, you'll need to create an account via the Supabase backend. Use the `/signup` endpoint:

```javascript
// You can do this once via browser console or API tool
fetch('YOUR_SUPABASE_URL/functions/v1/make-server-31ffd1db/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ANON_KEY'
  },
  body: JSON.stringify({
    email: 'your-admin-email@example.com',
    password: 'your-secure-password',
    name: 'Nomad'
  })
})
```

### 2. Login as Admin

Once your account is created:
1. Triple-click the logo OR click the footer dot
2. Enter your email and password
3. You'll be taken to the admin dashboard

### 3. Add Your Projects

In the admin dashboard:
- Click **"Add Project"** to create a new portfolio item
- Fill in:
  - Title (e.g., "Epic Battle Royale")
  - Description (what the project does)
  - Image URL (screenshot or thumbnail)
  - Tags (Lua, Scripting, Combat, etc.)
  - Roblox Link (optional)

### 4. Customize Your Profile

Update your bio in the Settings section to personalize your "About Me" section.

## Hidden Admin Access Points

There are TWO ways to access the admin login:

1. **Logo Triple-Click**: Triple-click the "itsnomad.lol" logo in the header
2. **Footer Dot**: Click the tiny gray dot on the right side of the footer

Both are discreet and won't be noticed by regular visitors!

## Public vs Admin View

- **Public View**: Default for all visitors - shows your portfolio, projects, and about section
- **Admin Dashboard**: Only accessible after login - manage projects, edit content, delete items

## Tips

- Keep your admin credentials secure
- Add high-quality images to projects for better visual appeal
- Use relevant tags to showcase your skills
- The first 3 projects are shown as "Featured Projects"

Enjoy your new portfolio! 🚀
