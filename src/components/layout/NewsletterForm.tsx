'use client';

export function NewsletterForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add newsletter signup logic here if needed
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md">
      <label htmlFor="newsletter-email" className="sr-only">
        Email Address
      </label>
      <input
        id="newsletter-email"
        type="email"
        placeholder="Enter your email"
        required
        className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-gray-900 text-white rounded-r-md hover:bg-gray-800 transition-colors"
      >
        Subscribe
      </button>
    </form>
  );
}
