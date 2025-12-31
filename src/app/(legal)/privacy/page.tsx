import { PLATFORM } from '@/lib/constants';

export const metadata = {
  title: `Privacy Policy | ${PLATFORM.NAME}`,
  description: 'Our commitment to protecting your privacy.',
};

export default function PrivacyPage() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p>Last updated: December 31, 2024</p>

      <p>
        At {PLATFORM.NAME}, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform.
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        We collect information you provide directly to us, such as when you create an account, create a business profile, or list products. This may include your name, email address, business details, and payment information processed securely via Stripe.
      </p>

      <h2>2. How We Use Your Information</h2>
      <p>We use your information to:</p>
      <ul>
        <li>Provide, maintain, and improve our services.</li>
        <li>Process transactions and send related information.</li>
        <li>Send administrative messages, such as confirmation emails and technical notices.</li>
        <li>Respond to your comments and questions.</li>
      </ul>

      <h2>3. Data Sharing</h2>
      <p>
        We do not sell your personal data. We may share information with vendors (like Stripe) only as necessary to provide our services. Your public business profile and products are visible to other users.
      </p>

      <h2>4. Data Retention</h2>
      <p>
        We retain your information for as long as necessary to provide our services and comply with our legal obligations. You may request deletion of your account by contacting support.
      </p>

      <h2>5. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us at {PLATFORM.SUPPORT_EMAIL}.
      </p>
    </>
  );
}
