# GitHub Repository Secrets Setup

To configure managed secrets for secure CI/CD operations, set up the following GitHub repository secrets in your repository settings:

## Required Secrets

### NETLIFY_AUTH_TOKEN
- **Description**: Netlify personal access token for deployment authentication
- **How to obtain**:
  1. Go to https://app.netlify.com/user/applications#personal-access-tokens
  2. Create a new personal access token
  3. Copy the token value
- **GitHub Secret Name**: NETLIFY_AUTH_TOKEN
- **Purpose**: Authenticates GitHub Actions with Netlify for automated deployments

### NETLIFY_SITE_ID
- **Description**: Site ID for the Netlify site to deploy to
- **How to obtain**:
  1. Go to your Netlify site dashboard
  2. Navigate to Site settings > General > Site details
  3. Copy the Site ID
- **GitHub Secret Name**: NETLIFY_SITE_ID
- **Purpose**: Identifies the specific Netlify site for deployment

## Setup Steps

1. Navigate to your GitHub repository
2. Go to Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Add each secret with the exact names above
5. Use the obtained values from Netlify

## Usage in CI/CD

These secrets will be available in GitHub Actions workflows as:
- `${{ secrets.NETLIFY_AUTH_TOKEN }}`
- `${{ secrets.NETLIFY_SITE_ID }}`

Example workflow usage:
```yaml
- name: Deploy to Netlify
  uses: netlify/actions/cli@master
  env:
    NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
    NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}