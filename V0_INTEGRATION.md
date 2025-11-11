# Integrating V0 Landing Page with TrueHome

## What is V0?

V0 is Vercel's AI-powered UI component generator. You can create beautiful landing pages by describing what you want, and V0 generates React/Next.js code.

## How to Integrate V0 Components

### Step 1: Generate Your Landing Page in V0

1. Go to https://v0.dev
2. Sign in with your Vercel account
3. Describe your landing page, for example:
   \`\`\`
   Create a modern landing page for TrueHome - a property history report service.
   Include:
   - Hero section with headline "Carfax for Homes"
   - Search bar prominently displayed
   - Features section (Ownership History, Permits, Risk Assessment)
   - How it works section
   - Call to action
   \`\`\`
4. V0 will generate React/Next.js code
5. Click "Copy Code" to get the component

### Step 2: Add V0 Component to Your App

#### Option A: Replace Current Landing Page

1. Copy the V0-generated code
2. Replace the content in `apps/web/src/app/page.tsx`
3. Make sure to:
   - Keep the `PropertySearch` component import
   - Integrate the search bar from V0 with your `PropertySearch` component
   - Maintain your existing routing

#### Option B: Create Separate Landing Component

1. Create `apps/web/src/components/V0Landing.tsx`
2. Paste V0 code there
3. Import and use in `page.tsx`

### Step 3: Integrate PropertySearch Component

The V0 landing page will have its own search UI. You need to connect it to your `PropertySearch` component:

\`\`\`tsx
// In your V0 landing page component
import PropertySearch from '../components/PropertySearch'

// Replace V0's search input with:
<PropertySearch />
\`\`\`

Or if V0 generates a custom search, you can wrap it:

\`\`\`tsx
// V0 might generate something like:
<div className="search-container">
  <input type="text" placeholder="Search properties..." />
</div>

// Replace with:
<div className="search-container">
  <PropertySearch />
</div>
\`\`\`

### Step 4: Style Integration

V0 uses Tailwind CSS (which you already have). Make sure:
- Your `tailwind.config.ts` includes any custom colors V0 uses
- V0 components use your existing color scheme (primary colors)
- Responsive breakpoints match

## Quick Integration Steps

### Method 1: Direct Replacement

1. **Generate in V0**: Create your landing page
2. **Copy Code**: Get the React component code
3. **Update page.tsx**:
   \`\`\`tsx
   // apps/web/src/app/page.tsx
   import PropertySearch from '../components/PropertySearch'
   
   export default function Home() {
     return (
       <V0GeneratedComponent>
         {/* Replace V0's search with your component */}
         <PropertySearch />
       </V0GeneratedComponent>
     )
   }
   \`\`\`

### Method 2: Component Wrapper

1. **Create V0 Component File**:
   \`\`\`tsx
   // apps/web/src/components/V0Landing.tsx
   'use client'
   
   export default function V0Landing() {
     // Paste V0 code here
     return (
       // V0 generated JSX
     )
   }
   \`\`\`

2. **Use in page.tsx**:
   \`\`\`tsx
   // apps/web/src/app/page.tsx
   import V0Landing from '../components/V0Landing'
   import PropertySearch from '../components/PropertySearch'
   
   export default function Home() {
     return <V0Landing />
   }
   \`\`\`

3. **Replace Search in V0 Component**: Find the search input in V0 code and replace with `<PropertySearch />`

## Example: V0 Landing Page Structure

Here's what a typical V0 landing page might look like:

\`\`\`tsx
'use client'

import PropertySearch from '../components/PropertySearch'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero">
        <h1>TrueHome</h1>
        <p>Carfax for Homes</p>
        <PropertySearch /> {/* Your existing component */}
      </section>
      
      {/* Features */}
      <section className="features">
        {/* V0 generated feature cards */}
      </section>
      
      {/* CTA */}
      <section className="cta">
        {/* V0 generated CTA */}
      </section>
    </div>
  )
}
\`\`\`

## Tips for V0 Integration

1. **Keep Your Components**: Don't replace `PropertySearch` - it has all your logic
2. **Maintain Routing**: Keep Next.js routing intact
3. **Style Consistency**: Update V0 colors to match your `primary` color scheme
4. **Responsive Design**: V0 usually generates responsive code, but test it
5. **TypeScript**: V0 generates TypeScript-compatible code

## Common V0 Patterns

V0 often generates:
- Hero sections with gradients
- Feature grids
- Testimonials
- Pricing sections
- FAQ accordions
- Footer components

You can generate each section separately in V0 and combine them.

## Next Steps

1. Go to https://v0.dev
2. Generate your landing page
3. Copy the code
4. Follow one of the integration methods above
5. Test locally
6. Push to GitHub (Vercel will auto-deploy)

## Example V0 Prompt

Try this prompt in V0:

\`\`\`
Create a modern, professional landing page for TrueHome - a property history report service like Carfax for homes.

Requirements:
- Hero section with large headline "TrueHome" and tagline "Comprehensive Property History Reports"
- Prominent search bar (I'll replace this with my component)
- Three feature cards: "Ownership History", "Permits & Inspections", "Risk Assessment"
- Dark blue and white color scheme
- Modern, clean design
- Fully responsive
- Use Tailwind CSS
- Next.js 14 App Router compatible
\`\`\`

Then replace the search input with your `<PropertySearch />` component.
