import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                By accessing or using TrueHome's website and services ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, then you may not access the Service.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                These Terms apply to all visitors, users, and others who access or use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                TrueHome provides comprehensive property history reports and related services. Our Service includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Property history reports containing ownership, sales, permits, and maintenance information</li>
                <li>Property search and discovery tools</li>
                <li>User accounts for managing property claims and updates</li>
                <li>Credit-based system for purchasing reports</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
              <h3 className="text-xl font-semibold mb-3">3.1 Account Creation</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To access certain features of the Service, you must register for an account. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information to keep it accurate</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">3.2 Account Termination</h3>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to suspend or terminate your account at any time for violations of these Terms or for any other reason we deem necessary.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Payment Terms</h2>
              <h3 className="text-xl font-semibold mb-3">4.1 Pricing</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our Service operates on a credit-based system. Reports are purchased using credits, which can be bought in various packages. All prices are displayed in U.S. dollars and are subject to change without notice.
              </p>

              <h3 className="text-xl font-semibold mb-3">4.2 Payment Processing</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Payments are processed through secure third-party payment processors. By making a purchase, you agree to the payment terms of our payment processor.
              </p>

              <h3 className="text-xl font-semibold mb-3">4.3 Refunds</h3>
              <p className="text-muted-foreground leading-relaxed">
                Credits are non-refundable once purchased. However, if you experience technical issues preventing report generation, please contact us for assistance. Refunds for unused credits may be considered on a case-by-case basis.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Use of Service</h2>
              <h3 className="text-xl font-semibold mb-3">5.1 Permitted Use</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You may use our Service for lawful purposes only. You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Use the Service in any way that violates applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Transmit any harmful code, viruses, or malicious software</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Scrape, crawl, or use automated tools to access the Service without permission</li>
                <li>Resell or redistribute reports without authorization</li>
                <li>Use the Service to harass, abuse, or harm others</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">5.2 User Content</h3>
              <p className="text-muted-foreground leading-relaxed">
                You retain ownership of any content you submit to the Service (such as property updates). By submitting content, you grant us a license to use, display, and distribute that content as necessary to provide the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Service and its original content, features, and functionality are owned by TrueHome and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You may not copy, modify, distribute, sell, or lease any part of our Service or included software, nor may you reverse engineer or attempt to extract the source code of that software.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Data Accuracy and Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                While we strive to provide accurate and up-to-date information, we cannot guarantee the accuracy, completeness, or timeliness of all data in our reports. Property information is compiled from various public and third-party sources, and may contain errors or omissions.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our reports are provided for informational purposes only and should not be the sole basis for making real estate decisions. We recommend consulting with qualified professionals (real estate agents, inspectors, attorneys) before making significant property-related decisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, TRUEHOME SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our total liability for any claims arising from or related to the Service shall not exceed the amount you paid to us in the twelve (12) months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Indemnification</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to defend, indemnify, and hold harmless TrueHome and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorney's fees, arising out of or in any way connected with your access to or use of the Service, your violation of these Terms, or your violation of any third-party rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Upon termination, your right to use the Service will cease immediately. All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Any disputes arising from these Terms or the Service shall be resolved in the appropriate courts of the United States.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-muted-foreground mb-2"><strong>Email:</strong> legal@truehome.com</p>
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

