import { PLATFORM } from '@/lib/constants';

export const metadata = {
  title: `Terms of Service | ${PLATFORM.NAME}`,
  description: 'Terms and conditions for using SuburbMates.',
};

export default function TermsPage() {
  return (
    <>
      <h1>Terms of Service</h1>
      <p>Last updated: December 31, 2024</p>

      <p>
        Please read these Terms of Service (&quot;Terms&quot;) carefully before using the {PLATFORM.NAME} platform. By accessing or using our services, you agree to be bound by these Terms.
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using our services, you confirm your agreement to be bound by these Terms. If you do not agree to these Terms, please do not use our services.
      </p>

      <h2>2. User Accounts</h2>
      <p>
        You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. You agree not to disclose your password to any third party.
      </p>

      <h2>3. Vendor Obligations</h2>
      <p>
        Vendors are responsible for the accuracy of their product listings and business profiles. You generally agree to fulfill orders promptly and communicate professionally with customers.
      </p>

      <h2>4. Content Guidelines</h2>
      <p>
        You retain ownership of the content you post. However, by posting content, you grant us a license to use, store, and display your content in connection with our services. We reserve the right to remove content that violates our policies.
      </p>

      <h2>5. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, {PLATFORM.NAME} shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues.
      </p>

      <h2>6. Changes to Terms</h2>
      <p>
        We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page.
      </p>

      <h2>7. Contact Us</h2>
      <p>
        If you have any questions about these Terms, please contact us at {PLATFORM.SUPPORT_EMAIL}.
      </p>
    </>
  );
}
