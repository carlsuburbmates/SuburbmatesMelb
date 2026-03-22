"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Newsletter signup logic would go here
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md w-full">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        aria-label="Email address for newsletter"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-gray-900 text-white rounded-r-md hover:bg-gray-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
        aria-label="Subscribe to newsletter"
      >
        Subscribe
      </button>
    </form>
  );
}
