# Development Workflow

## ⚠️ IMPORTANT RULE
**NEVER push directly to `main` branch without explicit permission!**

All development work must be done on feature branches and only merged to `main` when approved.

---

## Workflow Steps

### 1. Create a Feature Branch
```bash
# From main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b dev/feature-name
```

**Branch naming convention:**
- `dev/admin-dashboard` - New features
- `fix/booking-bug` - Bug fixes
- `update/calendar-ui` - Updates to existing features

### 2. Make Changes & Commit
```bash
# Make your changes
git add .
git commit -m "Description of changes"
```

### 3. Push to Remote (Optional for backup)
```bash
git push origin dev/feature-name
```

### 4. Test Locally
- Run `npm run dev`
- Test all changes
- Verify nothing breaks

### 5. Get Approval
**ASK USER**: "Ready to merge these changes to main and deploy?"

**Wait for explicit YES** before proceeding.

### 6. Merge to Main (Only After Approval)
```bash
# Switch to main
git checkout main
git pull origin main

# Merge feature branch
git merge dev/feature-name

# Push to main
git push origin main
```

### 7. Clean Up
```bash
# Delete local branch
git branch -d dev/feature-name

# Delete remote branch (if pushed)
git push origin --delete dev/feature-name
```

---

## Current Branch Structure

### `main`
- **Production** branch
- Auto-deploys to Vercel
- Only merge when approved
- Never commit directly

### `dev/[feature-name]`
- Development branches
- Test changes here first
- Can have multiple feature branches

---

## Examples

### ✅ CORRECT Workflow:
```bash
# 1. Create branch
git checkout -b dev/new-admin-feature

# 2. Make changes and commit
git add .
git commit -m "Add new admin feature"

# 3. ASK USER: "Ready to deploy?"
# Wait for YES

# 4. AFTER APPROVAL, merge to main
git checkout main
git merge dev/new-admin-feature
git push origin main
```

### ❌ INCORRECT Workflow:
```bash
# NEVER do this without permission!
git checkout main
git add .
git commit -m "Changes"
git push origin main  # ❌ NO! Ask first!
```

---

## Emergency Rollback

If something goes wrong after deployment:

```bash
# View recent commits
git log --oneline -10

# Rollback to previous commit
git reset --hard HEAD~1
git push origin main --force

# ⚠️ Only do this in emergencies!
```

---

## Current Status

**Active Branch**: `dev/admin-dashboard`
**Changes**: Added admin dashboard link to profile sidebar

**Next Steps**:
1. Test the changes locally
2. Ask: "Ready to merge to main?"
3. Wait for approval
4. Merge only after YES

---

**Last Updated**: November 1, 2025
**Enforced By**: User request - NO automatic deployments!
