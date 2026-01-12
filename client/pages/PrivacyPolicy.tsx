import { Layout } from "@/components/layout/Layout";

export default function PrivacyPolicy() {
  return (
    <Layout>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif font-bold text-secondary mb-8">
            Privacy Policy
          </h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <h2 className="text-2xl font-semibold mb-4">
              1. Information We Collect
            </h2>
            <p className="mb-6">
              We collect information you provide directly to us, such as when
              you create an account, make a purchase, or contact us for support.
              This may include your name, email address, phone number, and
              payment information.
            </p>

            <h2 className="text-2xl font-semibold mb-4">
              2. How We Use Your Information
            </h2>
            <p className="mb-6">
              We use the information we collect to provide, maintain, and
              improve our services, process transactions, send you technical
              notices and support messages, and respond to your comments and
              questions.
            </p>

            <h2 className="text-2xl font-semibold mb-4">
              3. Information Sharing
            </h2>
            <p className="mb-6">
              We do not sell, trade, or otherwise transfer your personal
              information to third parties without your consent, except as
              described in this policy or as required by law.
            </p>

            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p className="mb-6">
              We implement appropriate security measures to protect your
              personal information against unauthorized access, alteration,
              disclosure, or destruction.
            </p>

            <h2 className="text-2xl font-semibold mb-4">
              5. Cookies and Tracking
            </h2>
            <p className="mb-6">
              We use cookies and similar technologies to enhance your experience
              on our platform, remember your preferences, and analyze site
              usage.
            </p>

            <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
            <p className="mb-6">
              You have the right to access, update, or delete your personal
              information. You may also opt out of certain communications and
              data processing activities.
            </p>

            <h2 className="text-2xl font-semibold mb-4">
              7. Children's Privacy
            </h2>
            <p className="mb-6">
              Our services are not intended for children under 13. We do not
              knowingly collect personal information from children under 13.
            </p>

            <h2 className="text-2xl font-semibold mb-4">
              8. Changes to This Policy
            </h2>
            <p className="mb-6">
              We may update this privacy policy from time to time. We will
              notify you of any changes by posting the new policy on this page
              and updating the "last updated" date.
            </p>

            <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
            <p className="mb-6">
              If you have any questions about this privacy policy, please
              contact us at privacy@goldenstitch.com.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
