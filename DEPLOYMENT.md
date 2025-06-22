# Deployment Guide

This project uses GitHub Actions for continuous integration and deployment to AWS S3.

## CI/CD Pipeline

The pipeline is triggered on:
- Push to `master` branch
- Pull requests to `master` branch

### Pipeline Steps

1. **Test Job** (runs on all triggers):
   - Install dependencies
   - Run tests
   - Generate test coverage
   - Upload coverage to Codecov

2. **Build and Deploy Job** (runs only on master branch):
   - Build the application with production API URL
   - Deploy to S3 bucket

## Required GitHub Secrets

You need to configure the following secrets in your GitHub repository:

### Go to your repository settings:
1. Navigate to your GitHub repository
2. Click on "Settings" tab
3. Click on "Secrets and variables" → "Actions"
4. Click "New repository secret" to add each secret

### Required Secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | Your AWS access key ID | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | Your AWS secret access key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `S3_BUCKET_NAME` | Your S3 bucket name | `my-habits-tracker-app` |
| `VITE_API_BASE_URL` | Your production API base URL | `https://api.yourdomain.com/api` |

## AWS IAM Permissions

Your AWS user needs the following permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::your-bucket-name",
                "arn:aws:s3:::your-bucket-name/*"
            ]
        }
    ]
}
```

## S3 Bucket Configuration

Make sure your S3 bucket is configured for static website hosting:

1. Enable static website hosting
2. Set the index document to `index.html`
3. Set the error document to `index.html` (for SPA routing)
4. Configure bucket policy for public read access (if needed)

## Environment Variables

### Development
- `VITE_API_BASE_URL` defaults to `http://localhost:3001/api`

### Production
- `VITE_API_BASE_URL` must be set to your production API endpoint
- Example: `https://api.yourdomain.com/api`

## Manual Deployment

To deploy manually:

```bash
# Set the production API URL
export VITE_API_BASE_URL=https://api.yourdomain.com/api

# Build the application
npm run build

# Deploy to S3 (replace with your bucket name)
aws s3 sync build/ s3://your-bucket-name --delete
```

## Troubleshooting

### Common Issues:

1. **Tests failing**: Check the test output in the GitHub Actions logs
2. **Build failing**: Ensure all dependencies are properly installed
3. **S3 deployment failing**: Verify AWS credentials and bucket permissions
4. **API calls failing in production**: Check that `VITE_API_BASE_URL` is set correctly

### Checking Pipeline Status:

1. Go to your GitHub repository
2. Click on "Actions" tab
3. View the latest workflow run
4. Click on individual jobs to see detailed logs 