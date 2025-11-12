import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-16 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="text-4xl font-bold text-foreground mb-8">Cookie Policy</h1>
            <p className="text-muted-foreground mb-8">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. What Are Cookies?</h2>
              <p className="text-muted-foreground mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. Cookies are widely used to make websites work more efficiently and provide information to website owners.
              </p>
              <p className="text-muted-foreground mb-4">
                Cookies allow a website to recognize your device and store some information about your preferences or past actions. This helps us provide you with a better experience when you browse our website and allows us to improve our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Cookies</h2>
              <p className="text-muted-foreground mb-4">
                TrueHome uses cookies for the following purposes:
              </p>
              
              <h3 className="text-xl font-semibold text-foreground mb-3">2.1 Essential Cookies</h3>
              <p className="text-muted-foreground mb-4">
                These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt-out of these cookies.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li><strong>Authentication:</strong> Remember your login status and session information</li>
                <li><strong>Security:</strong> Protect against fraudulent activity and ensure secure transactions</li>
                <li><strong>Preferences:</strong> Remember your language and region preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-3">2.2 Performance Cookies</h3>
              <p className="text-muted-foreground mb-4">
                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve the way our website works.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li><strong>Analytics:</strong> Track page views, user interactions, and website performance</li>
                <li><strong>Error Tracking:</strong> Identify and fix technical issues</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-3">2.3 Functionality Cookies</h3>
              <p className="text-muted-foreground mb-4">
                These cookies allow the website to remember choices you make and provide enhanced, personalized features.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li><strong>User Preferences:</strong> Remember your settings and preferences</li>
                <li><strong>Search History:</strong> Remember your recent property searches</li>
                <li><strong>Report History:</strong> Track your purchased reports</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-3">2.4 Marketing Cookies</h3>
              <p className="text-muted-foreground mb-4">
                These cookies are used to deliver advertisements that are relevant to you and your interests. They may also be used to limit the number of times you see an advertisement.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li><strong>Advertising:</strong> Deliver targeted advertisements</li>
                <li><strong>Retargeting:</strong> Show you relevant content based on your browsing history</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Types of Cookies We Use</h2>
              
              <div className="bg-card border border-border rounded-lg p-6 mb-4">
                <h3 className="text-xl font-semibold text-foreground mb-3">Session Cookies</h3>
                <p className="text-muted-foreground mb-2">
                  These are temporary cookies that are deleted when you close your browser. They are used to maintain your session while you navigate our website.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 mb-4">
                <h3 className="text-xl font-semibold text-foreground mb-3">Persistent Cookies</h3>
                <p className="text-muted-foreground mb-2">
                  These cookies remain on your device for a set period or until you delete them. They help us recognize you when you return to our website.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 mb-4">
                <h3 className="text-xl font-semibold text-foreground mb-3">First-Party Cookies</h3>
                <p className="text-muted-foreground mb-2">
                  These cookies are set directly by TrueHome and are used to provide core functionality and improve user experience.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">Third-Party Cookies</h3>
                <p className="text-muted-foreground mb-2">
                  These cookies are set by third-party services we use, such as analytics providers and payment processors. We do not control these cookies.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Third-Party Cookies</h2>
              <p className="text-muted-foreground mb-4">
                We use third-party services that may set cookies on your device:
              </p>
              
              <h3 className="text-xl font-semibold text-foreground mb-3">4.1 Analytics Services</h3>
              <p className="text-muted-foreground mb-4">
                We use analytics services (such as Google Analytics) to understand how users interact with our website. These services may use cookies to collect information about your use of our website.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3">4.2 Payment Processors</h3>
              <p className="text-muted-foreground mb-4">
                When you make a purchase, our payment processor (Stripe) may set cookies to process your transaction securely.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3">4.3 Advertising Partners</h3>
              <p className="text-muted-foreground mb-4">
                We may work with advertising partners who use cookies to deliver relevant advertisements. These partners have their own privacy policies and cookie practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Managing Cookies</h2>
              
              <h3 className="text-xl font-semibold text-foreground mb-3">5.1 Browser Settings</h3>
              <p className="text-muted-foreground mb-4">
                Most web browsers allow you to control cookies through their settings preferences. You can:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Block all cookies</li>
                <li>Block third-party cookies only</li>
                <li>Delete cookies that have already been set</li>
                <li>Receive a notification before a cookie is set</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                Please note that blocking or deleting cookies may impact your ability to use certain features of our website.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3">5.2 Browser-Specific Instructions</h3>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                <li><strong>Edge:</strong> Settings → Privacy, search, and services → Cookies and site permissions</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-3">5.3 Opt-Out Tools</h3>
              <p className="text-muted-foreground mb-4">
                You can opt out of certain third-party cookies by visiting:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li><a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Analytics Opt-out</a></li>
                <li><a href="https://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Network Advertising Initiative</a></li>
                <li><a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Your Online Choices</a></li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Do Not Track Signals</h2>
              <p className="text-muted-foreground mb-4">
                Some browsers include a "Do Not Track" (DNT) feature that signals to websites you visit that you do not want to have your online activity tracked. Currently, there is no standard for how DNT signals should be interpreted. As a result, we do not currently respond to DNT signals.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Updates to This Cookie Policy</h2>
              <p className="text-muted-foreground mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Cookie Policy on this page and updating the "Last Updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              <div className="bg-card border border-border rounded-lg p-6">
                <p className="text-muted-foreground mb-2">
                  <strong>TrueHome</strong>
                </p>
                <p className="text-muted-foreground mb-2">
                  Email: privacy@truehome.com
                </p>
                <p className="text-muted-foreground">
                  Website: <a href="/" className="text-primary hover:underline">www.truehome.com</a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

