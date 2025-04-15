# Manual Vercel Deployment Instructions

Follow these steps to deploy your Finance App to Vercel manually through their dashboard:

## 1. Prepare Your Project

- Ensure you've committed all changes to Git
- Make sure your package.json is properly configured

## 2. Deploy Through the Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New" > "Project"
3. Import your project from GitHub, GitLab, or Bitbucket
4. Configure your project:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next` (default)
   - Install Command: `npm install`

## 3. Environment Variables

Add the following environment variables:

- `MONGODB_URI`: Your MongoDB connection string
  Example: `mongodb+srv://username:password@cluster.mongodb.net/finance-app`

## 4. Deploy Settings

- Root Directory: `./` (default)
- Node.js Version: 18.x (or higher)

## 5. Deployment

Click "Deploy" and wait for the build to complete.

## 6. Troubleshooting Common Issues

If you encounter build errors:

1. **Error with API Routes**: Make sure your API routes are properly formatted for serverless functions
2. **MongoDB Connection Issues**: Verify your connection string and network rules
3. **Build Failures**: Check the build logs for specific errors

## 7. After Deployment

- Set up a custom domain if needed
- Configure any additional team settings
- Set up monitoring and analytics

## 8. Important Notes

- The free tier has limitations on build minutes and serverless function execution
- For production use, consider upgrading to a paid plan
- MongoDB Atlas free tier should work fine with Vercel deployments

## 9. Testing Your Deployment

After deployment, test:
- API routes
- Database connections
- Authentication flows
- All main features

## 10. CI/CD Setup

For future deployments:
- Connect your repository for automatic deployments
- Configure preview deployments for pull requests
- Set up branch protections if needed 