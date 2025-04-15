# Deploying Your Personal Finance App to Vercel

This guide walks you through the process of deploying your Next.js personal finance application to Vercel.

## Prerequisites

- A GitHub account
- Your project pushed to a GitHub repository
- A Vercel account (you can sign up at [vercel.com](https://vercel.com) using your GitHub account)

## Deployment Steps

### 1. Push Your Code to GitHub

If you haven't already, push your code to GitHub:

```bash
git remote add origin https://github.com/yourusername/finance-app.git
git push -u origin main
```

### 2. Deploy with Vercel

1. Visit [Vercel's website](https://vercel.com) and log in with your GitHub account
2. Click the "Add New..." > "Project" button
3. Connect to your GitHub account if you haven't already
4. Find and select your finance-app repository
5. Configure your project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: Next.js includes this automatically
   - Output Directory: Next.js includes this automatically
   
6. Add Environment Variables:
   - Click "Environment Variables" to expand
   - Add your MongoDB connection string:
     - NAME: `MONGODB_URI`
     - VALUE: Your MongoDB connection string

7. Click "Deploy"

### 3. Check the Deployment

- Vercel will build your project and deploy it
- Once deployment is complete, you'll get a URL like `https://finance-app.vercel.app`
- Visit the URL to see your deployed application

### 4. Custom Domain (Optional)

1. In your Vercel dashboard, select your project
2. Go to "Settings" > "Domains"
3. Follow the instructions to add your custom domain

## Troubleshooting

### Build Errors

If you encounter build errors:

1. Check the build logs in Vercel
2. Make sure all dependencies are correctly listed in package.json
3. Verify your environment variables are correctly set

### API Routes Not Working

If your API routes aren't working:

1. Ensure your MongoDB connection string is correctly set as an environment variable
2. Check that your API routes are using the correct path structure for Next.js

### Database Connection Issues

If you can't connect to your database:

1. Verify your MongoDB connection string
2. Make sure your MongoDB instance allows connections from Vercel's IP addresses (you might need to set it to allow connections from anywhere)

## Automatic Deployments

Vercel automatically deploys your app when you push changes to your GitHub repository. This means:

1. Make changes locally
2. Commit and push to GitHub
3. Vercel will automatically rebuild and deploy your app

## Monitoring

- Use the Vercel dashboard to monitor deployments
- View error logs and performance metrics
- Set up alerts for failed deployments

Happy deploying! 