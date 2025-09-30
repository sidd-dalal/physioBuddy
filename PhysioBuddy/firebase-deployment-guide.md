# Firebase Deployment Guide for YourPhysioBuddy

## Steps to Deploy

### 1. Export Your Code
- Download the project as ZIP from Replit
- Extract the files to your local machine

### 2. Prepare the Frontend
- Copy the `client` folder contents
- Run `npm run build` in the client folder to create production build
- The `dist` folder will contain your deployable files

### 3. Firebase Setup
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project in your client/dist folder
firebase init hosting

# Select your existing Firebase project
# Set public directory to: dist
# Configure as single-page app: Yes
# Overwrite index.html: No
```

### 4. Deploy
```bash
firebase deploy --only hosting
```

### 5. Add Custom Domain
1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Enter: yourphysiobuddy.com
4. Add the provided DNS records to your domain registrar

## Contact Form Configuration (EmailJS Setup)

### 1. Create EmailJS Account
1. Go to [emailjs.com](https://emailjs.com) and sign up
2. Create a new service (Gmail, Outlook, etc.)
3. Create an email template with these variables:
   - `{{from_name}}` - sender's name
   - `{{from_email}}` - sender's email  
   - `{{phone}}` - sender's phone
   - `{{message}}` - message content
   - `{{to_email}}` - your email (lodha.unnati@gmail.com)

### 2. Get Your Credentials
- Service ID: Found in EmailJS dashboard
- Template ID: Created template ID
- Public Key: Found in Account settings

### 3. Environment Variables
Create a `.env` file in your project root:
```
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here  
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

### 4. Sample Email Template
```
New Contact Form Submission

Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}

Message:
{{message}}

Reply to: {{from_email}}
```

## Files Modified for Static Hosting
- Contact form updated to use EmailJS instead of backend API
- All API calls removed
- Static build configuration optimized