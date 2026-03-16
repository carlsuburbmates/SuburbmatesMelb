"use client";

export function NewsletterForm() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex max-w-md"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address for newsletter
      </label>
      <input
        id="newsletter-email"
        type="email"
        placeholder="Enter your email"
        className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        required
      />
      <button
        type="submit"
        className="px-6 py-2 bg-gray-900 text-white rounded-r-md hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
      >
        Subscribe
      </button>
    </form>
  );
}
