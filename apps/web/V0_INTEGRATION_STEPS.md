# Quick V0 Integration Steps

## 🚀 Fast Track (5 minutes)

### 1. Generate in V0
- Go to **https://v0.dev**
- Sign in with Vercel account
- Use this prompt:

\`\`\`
Create a modern landing page for TrueHome property history service.

Hero section with:
- Large "TrueHome" headline
- Tagline "Carfax for Homes - Comprehensive Property History Reports"  
- Search bar placeholder (I'll replace with my component)

Features section with 3 cards:
- Ownership History
- Permits & Inspections  
- Risk Assessment

Use dark blue (#0ea5e9) and white color scheme.
Modern, clean, professional design.
Fully responsive.
Tailwind CSS.
Next.js 14 App Router.
\`\`\`

### 2. Copy V0 Code
- Click "Copy Code" in V0
- The code will be React/Next.js compatible

### 3. Replace Landing Page

**Option A: Direct Replace**
\`\`\`bash
# Edit apps/web/src/app/page.tsx
# Paste V0 code
# Find the search input and replace with:
import PropertySearch from '../components/PropertySearch'

// In the V0 JSX, replace search input with:
<PropertySearch />
\`\`\`

**Option B: Use Template**
\`\`\`bash
# Edit apps/web/src/components/V0LandingTemplate.tsx
# Paste V0 code
# Keep the PropertySearch import and usage
\`\`\`

### 4. Test Locally
\`\`\`bash
cd apps/web
npm run dev
# Visit http://localhost:3000
\`\`\`

### 5. Deploy
\`\`\`bash
git add .
git commit -m "feat: Add V0 landing page"
git push origin main
# Vercel will auto-deploy
\`\`\`

## 🔗 Key Integration Points

### Keep PropertySearch Component
Your V0 landing page will have a search input. Replace it with:

\`\`\`tsx
import PropertySearch from '../components/PropertySearch'

// In V0 JSX, replace:
<input type="text" placeholder="Search..." />

// With:
<PropertySearch />
\`\`\`

### Maintain Routing
V0 code should work with Next.js routing. Your property detail pages at `/property/[id]` will still work.

### Color Scheme
V0 might use different colors. Update to match your `primary` colors in `tailwind.config.ts`:
- Primary: `#0ea5e9` (blue-500)
- Use your existing color palette

## 📝 Example V0 Prompt Variations

**Minimal Landing:**
\`\`\`
Simple hero section with TrueHome branding and search bar placeholder.
\`\`\`

**Full Landing:**
\`\`\`
Complete landing page with hero, features, how it works, testimonials, and CTA sections.
\`\`\`

**Modern Design:**
\`\`\`
Ultra-modern landing page with glassmorphism effects, gradients, and smooth animations.
\`\`\`

## ✅ Checklist

- [ ] Generated landing page in V0
- [ ] Copied code
- [ ] Replaced search input with `<PropertySearch />`
- [ ] Tested locally
- [ ] Colors match your brand
- [ ] Responsive on mobile
- [ ] Pushed to GitHub
- [ ] Verified on Vercel

## 🎨 Styling Tips

V0 uses Tailwind. Your existing config supports:
- Custom `primary` colors (already defined)
- Responsive breakpoints
- All Tailwind utilities

If V0 uses custom classes, add them to `tailwind.config.ts`.

## 🔧 Troubleshooting

**V0 code doesn't work?**
- Make sure it's Next.js 14 compatible
- Check for any missing imports
- Verify Tailwind classes are valid

**Search not working?**
- Make sure you replaced V0's search with `<PropertySearch />`
- Check that PropertySearch component is imported

**Styles look off?**
- V0 might use different color values
- Update to match your `primary` color scheme
- Check responsive breakpoints
