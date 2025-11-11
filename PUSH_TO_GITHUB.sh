#!/bin/bash

# Script to push TrueHome to GitHub

echo "🚀 Pushing TrueHome to GitHub"
echo ""

# Check if remote exists
if git remote get-url origin > /dev/null 2>&1; then
    echo "✅ Remote 'origin' already configured"
    git remote -v
    echo ""
    echo "Pushing to GitHub..."
    git push -u origin main
else
    echo "❌ No remote configured"
    echo ""
    echo "📋 To set up GitHub:"
    echo ""
    echo "1. Create a new repository on GitHub:"
    echo "   https://github.com/new"
    echo "   (Don't initialize with README, .gitignore, or license)"
    echo ""
    echo "2. Then run:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
    echo "   git push -u origin main"
    echo ""
    echo "Or provide the GitHub URL and I can help set it up!"
fi

