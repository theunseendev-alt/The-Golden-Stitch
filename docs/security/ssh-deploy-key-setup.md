# SSH Deploy Key Setup (Optional)

For enhanced security over HTTPS authentication in GitHub deployments, set up SSH deploy keys. This provides an alternative to personal access tokens.

## When to Use SSH Deploy Keys

- When you want to restrict repository access to specific operations
- For automated deployments with more granular permissions
- When HTTPS authentication is not preferred for security reasons

## Setup Steps

### 1. Generate SSH Key Pair

On your deployment machine or CI/CD environment:

```bash
ssh-keygen -t ed25519 -C "deploy@golden-stitch" -f ~/.ssh/golden_stitch_deploy
```

### 2. Add Public Key to GitHub

1. Copy the public key:
   ```bash
   cat ~/.ssh/golden_stitch_deploy.pub
   ```

2. Go to your GitHub repository Settings > Deploy keys
3. Click "Add deploy key"
4. Paste the public key
5. Give it a title like "Golden Stitch Deploy Key"
6. Check "Allow write access" if needed for deployments
7. Click "Add key"

### 3. Configure Private Key as Secret

For GitHub Actions, add the private key as a repository secret:

1. Copy the private key:
   ```bash
   cat ~/.ssh/golden_stitch_deploy
   ```

2. Go to GitHub repository Settings > Secrets and variables > Actions
3. Add a new secret named `SSH_PRIVATE_KEY`
4. Paste the entire private key content

### 4. Update Deployment Workflow

Modify your GitHub Actions workflow to use SSH:

```yaml
- name: Checkout code
  uses: actions/checkout@v4
  with:
    ssh-key: ${{ secrets.SSH_PRIVATE_KEY }}
```

## Security Considerations

- Deploy keys are read-only by default (recommended)
- Each deploy key is specific to one repository
- Rotate keys regularly
- Never share private keys
- Use strong passphrases if storing keys locally

## Alternative: Use HTTPS with Fine-Grained PAT

If SSH is not preferred, consider using GitHub's fine-grained personal access tokens with minimal required permissions for deployments.

## Cleanup

- Remove temporary key files after setup
- Revoke old keys when rotating
- Monitor repository access logs