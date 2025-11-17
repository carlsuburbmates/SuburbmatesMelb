// Google Analytics 4 Integration for SuburbMates

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: Record<string, unknown>[];
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Initialize GA4
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Custom event tracking
export const trackEvent = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// SuburbMates specific event tracking
export const analytics = {
  // Homepage interactions
  heroSlideView: (slideIndex: number) =>
    trackEvent({
      action: 'hero_slide_view',
      category: 'homepage',
      label: `slide_${slideIndex}`,
    }),

  searchSuburb: (searchTerm: string) =>
    trackEvent({
      action: 'suburb_search',
      category: 'search',
      label: searchTerm,
    }),

  // Signup flow
  signupModalOpen: (trigger: string) =>
    trackEvent({
      action: 'signup_modal_open',
      category: 'signup',
      label: trigger,
    }),

  signupRoleSelect: (role: 'customer' | 'vendor') =>
    trackEvent({
      action: 'signup_role_select',
      category: 'signup',
      label: role,
    }),

  signupComplete: (role: 'customer' | 'vendor') =>
    trackEvent({
      action: 'signup_complete',
      category: 'conversion',
      label: role,
    }),

  // Featured placement
  featuredModalOpen: () =>
    trackEvent({
      action: 'featured_modal_open',
      category: 'featured',
      label: 'learn_more',
    }),

  featuredClick: () =>
    trackEvent({
      action: 'featured_cta_click',
      category: 'conversion',
      label: 'get_featured',
    }),

  // Navigation
  navClick: (destination: string) =>
    trackEvent({
      action: 'nav_click',
      category: 'navigation',
      label: destination,
    }),

  // Directory browsing
  directoryBrowse: () =>
    trackEvent({
      action: 'directory_browse',
      category: 'directory',
      label: 'browse_now',
    }),

  // Business listing interactions
  businessView: (businessId: string) =>
    trackEvent({
      action: 'business_view',
      category: 'directory',
      label: businessId,
    }),

  businessContact: (businessId: string, method: string) =>
    trackEvent({
      action: 'business_contact',
      category: 'conversion',
      label: `${businessId}_${method}`,
    }),

  // Marketplace
  productView: (productId: string) =>
    trackEvent({
      action: 'product_view',
      category: 'marketplace',
      label: productId,
    }),

  productPurchase: (productId: string, value: number) =>
    trackEvent({
      action: 'purchase',
      category: 'ecommerce',
      label: productId,
      value: value,
    }),

  // Error tracking
  errorOccurred: (errorType: string, errorMessage: string) =>
    trackEvent({
      action: 'error',
      category: 'error',
      label: `${errorType}: ${errorMessage}`,
    }),
};
