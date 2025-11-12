import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-16 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground mb-4">
                By accessing and using TrueHome ("we," "our," or "us"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground mb-4">
                TrueHome provides comprehensive property history reports that include information about property sales, work history, insurance claims, warranties, title issues, and other relevant property data. Our services are designed to help users make informed decisions about property purchases.
              </p>
              <p className="text-muted-foreground mb-4">
                We aggregate data from various public and private sources, but we do not guarantee the accuracy, completeness, or timeliness of the information provided in our reports.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Accounts</h2>
              
              <h3 className="text-xl font-semibold text-foreground mb-3">3.1 Account Registration</h3>
              <p className="text-muted-foreground mb-4">
                To access certain features of our service, you must register for an account. You agree to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password and identification</li>
                <li>Accept all responsibility for activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-3">3.2 Account Termination</h3>
              <p className="text-muted-foreground mb-4">
                We reserve the right to suspend or terminate your account at any time for violations of these Terms of Service or for any other reason we deem necessary.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Payment Terms</h2>
              
              <h3 className="text-xl font-semibold text-foreground mb-3">4.1 Pricing</h3>
              <p className="text-muted-foreground mb-4">
                Property reports are available for purchase at the prices displayed on our pricing page. We reserve the right to change our pricing at any time, but price changes will not affect reports already purchased.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3">4.2 Payment Processing</h3>
              <p className="text-muted-foreground mb-4">
                All payments are processed through third-party payment processors (e.g., Stripe). By making a purchase, you agree to the terms and conditions of the payment processor.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3">4.3 Refunds</h3>
              <p className="text-muted-foreground mb-4">
                All sales of report credits are final. Refunds may be considered on a case-by-case basis for technical issues or errors in report generation. Contact our support team to request a refund.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3">4.4 Credits</h3>
              <p className="text-muted-foreground mb-4">
                Report credits purchased through our service do not expire and can be used at any time. Credits are non-transferable and cannot be exchanged for cash.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Use of Service</h2>
              
              <h3 className="text-xl font-semibold text-foreground mb-3">5.1 Permitted Use</h3>
              <p className="text-muted-foreground mb-4">
                You may use our service for lawful purposes only. You agree not to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Use the service in any way that violates applicable laws or regulations</li>
                <li>Attempt to gain unauthorized access to our systems or networks</li>
                <li>Interfere with or disrupt the service or servers</li>
                <li>Use automated systems to access the service without permission</li>
                <li>Reproduce, duplicate, copy, or resell any portion of our reports without authorization</li>
                <li>Use the service to compete with TrueHome or to build a competing service</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-3">5.2 Report Usage</h3>
              <p className="text-muted-foreground mb-4">
                Property reports are provided for your personal or business use. You may not:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Resell or redistribute reports to third parties</li>
                <li>Use reports for illegal purposes</li>
                <li>Misrepresent the source or accuracy of report data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Intellectual Property</h2>
              <p className="text-muted-foreground mb-4">
                All content, features, and functionality of the TrueHome service, including but not limited to text, graphics, logos, icons, images, and software, are the exclusive property of TrueHome and are protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-muted-foreground mb-4">
                You may not modify, reproduce, distribute, create derivative works, publicly display, or otherwise use any content from our service without our prior written permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Disclaimers</h2>
              
              <h3 className="text-xl font-semibold text-foreground mb-3">7.1 Data Accuracy</h3>
              <p className="text-muted-foreground mb-4">
                While we strive to provide accurate and up-to-date information, we do not guarantee the accuracy, completeness, or reliability of any information in our reports. Property data is compiled from various sources and may contain errors or omissions.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3">7.2 No Professional Advice</h3>
              <p className="text-muted-foreground mb-4">
                Our reports are for informational purposes only and do not constitute legal, financial, or professional advice. You should consult with qualified professionals (attorneys, real estate agents, inspectors, etc.) before making property-related decisions.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3">7.3 Service Availability</h3>
              <p className="text-muted-foreground mb-4">
                We do not guarantee that our service will be available at all times or that it will be free from errors, interruptions, or security issues. We reserve the right to modify or discontinue the service at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Limitation of Liability</h2>
              <p className="text-muted-foreground mb-4">
                To the maximum extent permitted by law, TrueHome shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Your use or inability to use our service</li>
                <li>Any errors or omissions in our reports</li>
                <li>Any decisions made based on information in our reports</li>
                <li>Unauthorized access to or use of our servers or your account</li>
                <li>Any interruption or cessation of transmission to or from our service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Indemnification</h2>
              <p className="text-muted-foreground mb-4">
                You agree to indemnify, defend, and hold harmless TrueHome and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, arising out of or in any way connected with your use of our service or violation of these Terms of Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Governing Law</h2>
              <p className="text-muted-foreground mb-4">
                These Terms of Service shall be governed by and construed in accordance with the laws of the State of Texas, United States, without regard to its conflict of law provisions. Any disputes arising from these terms or your use of our service shall be resolved in the courts of Texas.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">11. Changes to Terms</h2>
              <p className="text-muted-foreground mb-4">
                We reserve the right to modify these Terms of Service at any time. We will notify users of any material changes by posting the new Terms of Service on this page and updating the "Last Updated" date. Your continued use of the service after such changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">12. Contact Information</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-card border border-border rounded-lg p-6">
                <p className="text-muted-foreground mb-2">
                  <strong>TrueHome</strong>
                </p>
                <p className="text-muted-foreground mb-2">
                  Email: legal@truehome.com
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

