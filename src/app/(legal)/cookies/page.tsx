import { PLATFORM } from '@/lib/constants';

export const metadata = {
  title: `Cookie Policy | ${PLATFORM.NAME}`,
  description: 'How we use cookies.',
};

export default function CookiesPage() {
  return (
    <>
      <h1>Cookie Policy</h1>
      <p>Last updated: December 31, 2024</p>

      <p>
        The {PLATFORM.NAME} platform uses cookies to improve your experience.
      </p>

      <h2>1. What are Cookies?</h2>
      <p>
        Cookies are small text files stored on your device when you visit a website. They help us remember your preferences and login state.
      </p>

      <h2>2. How We Use Cookies</h2>
      <p>We use cookies for:</p>
      <ul>
        <li><strong>Essential Functions:</strong> Keeping you logged in.</li>
        <li><strong>Analytics:</strong> Understanding how our site is used (via PostHog).</li>
        <li><strong>Preferences:</strong> Remembering your settings.</li>
      </ul>

      <h2>3. Managing Cookies</h2>
      <p>
        You can control and/or delete cookies as you wish using your browser settings.
      </p>

      <h2>4. Contact Us</h2>
      <p>
        If you have questions about our Cookie Policy, please contact us at {PLATFORM.SUPPORT_EMAIL}.
      </p>
    </>
  );
}
