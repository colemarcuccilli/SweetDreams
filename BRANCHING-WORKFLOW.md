# Git Branching Workflow

## Branch Structure

### `main` branch
- **Purpose**: Production-ready code for live site
- **Deploys to**: Live production website
- **Use for**: Bug fixes, urgent updates, content changes
- **Protected**: Only merge after testing

### `feature/dream-suite` branch
- **Purpose**: Dream Suite development (artist platform)
- **Deploys to**: Preview/staging environment (not production)
- **Use for**: All Dream Suite features until ready for launch
- **Will merge to main**: Only when fully complete and tested

## Workflow

### Working on Live Site (Urgent Fixes)
```bash
# Switch to main
git checkout main

# Pull latest
git pull origin main

# Make your changes
# ... edit files ...

# Commit and push
git add -A
git commit -m "Fix: description of fix"
git push origin main
```

### Working on Dream Suite Features
```bash
# Switch to Dream Suite branch
git checkout feature/dream-suite

# Pull latest
git pull origin feature/dream-suite

# Make your changes
# ... build features ...

# Commit and push
git add -A
git commit -m "feat: description of feature"
git push origin feature/dream-suite
```

### Keeping Dream Suite Updated with Main
If `main` gets important updates (bug fixes, dependencies), merge them into Dream Suite:

```bash
# On Dream Suite branch
git checkout feature/dream-suite

# Pull latest from main
git merge main

# Resolve any conflicts if needed
# Push updated Dream Suite branch
git push origin feature/dream-suite
```

## Deployment Strategy

### Current Setup
- **main** → Auto-deploys to live site (Vercel)
- **feature/dream-suite** → Deploy to preview URL (separate Vercel preview)

### When Dream Suite is Ready
1. Test everything thoroughly on preview environment
2. Create pull request: `feature/dream-suite` → `main`
3. Review all changes
4. Merge to main
5. Goes live automatically

## Rules

✅ **DO**:
- Commit Dream Suite work to `feature/dream-suite`
- Commit live site fixes to `main`
- Keep branches in sync by merging main into feature/dream-suite regularly

❌ **DON'T**:
- Push Dream Suite features to `main` until launch
- Work on both branches simultaneously without committing
- Delete `feature/dream-suite` until fully merged

## Current Branch
You are on: `feature/dream-suite`

All Dream Suite development stays here until launch day.
