import { Layout } from "@/components/layout/Layout";

export default function TermsOfService() {
  return (
    <Layout>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif font-bold text-secondary mb-8">
            Terms of Service
          </h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <h2 className="text-2xl font-semibold mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="mb-6">
              By accessing and using The Golden Stitch platform, you accept and
              agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
            <p className="mb-6">
              Permission is granted to temporarily download one copy of the
              materials on The Golden Stitch's website for personal,
              non-commercial transitory viewing only.
            </p>

            <h2 className="text-2xl font-semibold mb-4">3. Disclaimer</h2>
            <p className="mb-6">
              The materials on The Golden Stitch's website are provided on an
              'as is' basis. The Golden Stitch makes no warranties, expressed or
              implied, and hereby disclaims and negates all other warranties
              including without limitation, implied warranties or conditions of
              merchantability, fitness for a particular purpose, or
              non-infringement of intellectual property or other violation of
              rights.
            </p>

            <h2 className="text-2xl font-semibold mb-4">4. Limitations</h2>
            <p className="mb-6">
              In no event shall The Golden Stitch or its suppliers be liable for
              any damages (including, without limitation, damages for loss of
              data or profit, or due to business interruption) arising out of
              the use or inability to use the materials on The Golden Stitch's
              website.
            </p>

            <h2 className="text-2xl font-semibold mb-4">
              5. Accuracy of Materials
            </h2>
            <p className="mb-6">
              The materials appearing on The Golden Stitch's website could
              include technical, typographical, or photographic errors. The
              Golden Stitch does not warrant that any of the materials on its
              website are accurate, complete, or current.
            </p>

            <h2 className="text-2xl font-semibold mb-4">6. Links</h2>
            <p className="mb-6">
              The Golden Stitch has not reviewed all of the sites linked to its
              website and is not responsible for the contents of any such linked
              site.
            </p>

            <h2 className="text-2xl font-semibold mb-4">7. Governing Law</h2>
            <p className="mb-6">
              These terms and conditions are governed by and construed in
              accordance with the laws of your jurisdiction and you irrevocably
              submit to the exclusive jurisdiction of the courts in that state
              or location.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
