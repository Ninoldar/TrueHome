import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. Cookies are widely used to make websites work more efficiently and provide information to website owners.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This Cookie Policy explains how TrueHome ("we," "us," or "our") uses cookies and similar technologies when you visit our website and use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use cookies for various purposes, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Essential Cookies:</strong> Required for the website to function properly (authentication, security)</li>
                <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our website (analytics)</li>
                <li><strong>Functionality Cookies:</strong> Remember your preferences and settings</li>
                <li><strong>Targeting/Advertising Cookies:</strong> Used to deliver relevant advertisements (if applicable)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-semibold mb-3">3.1 Essential Cookies</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These cookies are necessary for the website to function and cannot be switched off. They are usually set in response to actions made by you, such as:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Setting your privacy preferences</li>
                <li>Logging in to your account</li>
                <li>Maintaining your session</li>
                <li>Security and fraud prevention</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">3.2 Performance and Analytics Cookies</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us understand:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Which pages are most popular</li>
                <li>How visitors move around the site</li>
                <li>What features are used most frequently</li>
                <li>Any error messages users encounter</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                All information these cookies collect is aggregated and anonymous.
              </p>

              <h3 className="text-xl font-semibold mb-3">3.3 Functionality Cookies</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages. They remember:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Your language preferences</li>
                <li>Your region or location</li>
                <li>Your account settings</li>
                <li>Other preferences you've selected</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Third-Party Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In addition to our own cookies, we may also use various third-party cookies to report usage statistics and deliver content. These may include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Analytics Services:</strong> Such as Google Analytics, to help us understand website usage</li>
                <li><strong>Payment Processors:</strong> Cookies from payment providers to process transactions securely</li>
                <li><strong>Content Delivery Networks:</strong> To optimize content delivery</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. How to Control Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in your browser settings.
              </p>

              <h3 className="text-xl font-semibold mb-3">5.1 Browser Settings</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Most web browsers allow you to control cookies through their settings preferences. However, limiting cookies may impact your ability to use our Service. Here are links to cookie settings for popular browsers:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Microsoft Edge</a></li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">5.2 Opt-Out Tools</h3>
              <p className="text-muted-foreground leading-relaxed">
                You can also opt out of certain third-party cookies by visiting:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Analytics Opt-Out</a></li>
                <li><a href="https://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Network Advertising Initiative</a></li>
                <li><a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Your Online Choices</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Cookie Duration</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Cookies can be either "persistent" or "session" cookies:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until you delete them</li>
                <li><strong>Session Cookies:</strong> Temporary cookies that are deleted when you close your browser</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The duration for which cookies are stored depends on their purpose. Essential cookies typically last for the duration of your session, while preference cookies may last longer to remember your settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Updates to This Cookie Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Cookie Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-muted-foreground mb-2"><strong>Email:</strong> privacy@truehome.com</p>
                <p className="text-muted-foreground mb-2"><strong>Address:</strong> TrueHome, Inc.</p>
                <p className="text-muted-foreground">United States</p>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

