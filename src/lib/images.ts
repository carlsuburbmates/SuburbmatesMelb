// Image specifications and optimization utilities
// Based on LATEST_UPDATE_START_HERE/image-specifications.md

export interface ImageSpec {
  id: string;
  filename: string;
  purpose: string;
  dimensions: string;
  accentColor: string;
  description: string;
  section?: string;
}

// 18 Required Images from specification
export const IMAGE_SPECS: ImageSpec[] = [
  // Hero Carousel (3 images)
  {
    id: 'hero-1',
    filename: 'melbourne-laneways-grayscale.jpg',
    purpose: 'Hero carousel slide 1',
    dimensions: '1920x1080',
    accentColor: 'orange', // #FF6B35
    description: 'Melbourne laneway scene with cafes and street art',
    section: 'hero'
  },
  {
    id: 'hero-2', 
    filename: 'brunswick-street-grayscale.jpg',
    purpose: 'Hero carousel slide 2',
    dimensions: '1920x1080',
    accentColor: 'teal', // #20B2AA
    description: 'Brunswick Street with local businesses',
    section: 'hero'
  },
  {
    id: 'hero-3',
    filename: 'south-yarra-shops-grayscale.jpg', 
    purpose: 'Hero carousel slide 3',
    dimensions: '1920x1080',
    accentColor: 'purple', // #8B7DB3
    description: 'South Yarra shopping district',
    section: 'hero'
  },
  
  // Section Backgrounds (6 images)
  {
    id: 'browse-bg',
    filename: 'suburb-search-grayscale.jpg',
    purpose: 'Browse section background',
    dimensions: '1200x800',
    accentColor: 'rose', // #D8A0C7
    description: 'People browsing local businesses on devices',
    section: 'browse'
  },
  {
    id: 'featured-bg',
    filename: 'business-featured-grayscale.jpg',
    purpose: 'Featured section background', 
    dimensions: '1200x800',
    accentColor: 'amber', // #D4A574
    description: 'Local business with featured placement badge',
    section: 'featured'
  },
  {
    id: 'how-it-works-bg',
    filename: 'community-connection-grayscale.jpg',
    purpose: 'How It Works section background',
    dimensions: '1200x800', 
    accentColor: 'sage', // #7CAA9D
    description: 'Community members connecting with local services',
    section: 'how-it-works'
  },
  {
    id: 'why-join-bg',
    filename: 'melbourne-skyline-grayscale.jpg',
    purpose: 'Why Join section background',
    dimensions: '1200x800',
    accentColor: 'orange', // #FF6B35
    description: 'Melbourne skyline from suburban perspective',
    section: 'why-join'
  },
  {
    id: 'faq-bg', 
    filename: 'local-business-owner-grayscale.jpg',
    purpose: 'FAQ section background',
    dimensions: '1200x800',
    accentColor: 'teal', // #20B2AA
    description: 'Local business owner with laptop and customers',
    section: 'faq'
  },
  {
    id: 'cta-bg',
    filename: 'neighbourhood-view-grayscale.jpg',
    purpose: 'CTA section background',
    dimensions: '1200x800',
    accentColor: 'purple', // #8B7DB3
    description: 'Aerial view of Melbourne neighbourhood',
    section: 'cta'
  },

  // Directory Page (3 images)
  {
    id: 'directory-hero',
    filename: 'business-directory-grayscale.jpg',
    purpose: 'Directory page header',
    dimensions: '1200x600',
    accentColor: 'rose', // #D8A0C7
    description: 'Grid of local business storefronts',
    section: 'directory'
  },
  {
    id: 'search-bg',
    filename: 'map-search-grayscale.jpg', 
    purpose: 'Directory search background',
    dimensions: '800x400',
    accentColor: 'amber', // #D4A574
    description: 'Person using map to find local businesses',
    section: 'directory-search'
  },
  {
    id: 'business-cards-bg',
    filename: 'business-cards-collection-grayscale.jpg',
    purpose: 'Business listings background',
    dimensions: '800x400',
    accentColor: 'sage', // #7CAA9D
    description: 'Collection of business cards and contact information',
    section: 'directory-listing'
  },

  // Business Detail Page (3 images)
  {
    id: 'business-profile-bg',
    filename: 'business-profile-grayscale.jpg',
    purpose: 'Business detail page background',
    dimensions: '1200x600',
    accentColor: 'orange', // #FF6B35
    description: 'Professional business interior with owner',
    section: 'business-detail'
  },
  {
    id: 'contact-bg',
    filename: 'business-contact-grayscale.jpg',
    purpose: 'Contact section background',
    dimensions: '600x400',
    accentColor: 'teal', // #20B2AA
    description: 'Business owner on phone with customer service setup',
    section: 'business-contact'
  },
  {
    id: 'products-bg',
    filename: 'digital-products-grayscale.jpg',
    purpose: 'Products section background',
    dimensions: '800x400',
    accentColor: 'purple', // #8B7DB3
    description: 'Digital devices showing various digital products',
    section: 'business-products'
  },

  // Marketplace (3 images) 
  {
    id: 'marketplace-bg',
    filename: 'digital-marketplace-grayscale.jpg',
    purpose: 'Marketplace page background',
    dimensions: '1200x800',
    accentColor: 'rose', // #D8A0C7
    description: 'Digital shopping interface with local products',
    section: 'marketplace'
  },
  {
    id: 'vendor-bg',
    filename: 'vendor-workspace-grayscale.jpg',
    purpose: 'Vendor section background',
    dimensions: '800x600',
    accentColor: 'amber', // #D4A574
    description: 'Creative workspace of digital product vendor',
    section: 'vendor'
  },
  {
    id: 'customer-bg',
    filename: 'customer-shopping-grayscale.jpg',
    purpose: 'Customer section background', 
    dimensions: '800x600',
    accentColor: 'sage', // #7CAA9D
    description: 'Customer browsing and purchasing digital products',
    section: 'customer'
  }
];

// Image utility functions
export function getImageBySection(section: string): ImageSpec[] {
  return IMAGE_SPECS.filter(img => img.section === section);
}

export function getImageById(id: string): ImageSpec | undefined {
  return IMAGE_SPECS.find(img => img.id === id);
}

export function generateImageUrl(spec: ImageSpec, placeholder = false): string {
  if (placeholder) {
    // Generate placeholder URL until real images are available
    const [width, height] = spec.dimensions.split('x');
    return `/api/placeholder/${width}/${height}?text=${encodeURIComponent(spec.description)}`;
  }
  
  return `/images/${spec.filename}`;
}

// CSS class generator for accent overlays
export function getAccentOverlayClass(accentColor: string): string {
  return `accent-overlay-${accentColor}`;
}

// Optimize image loading based on section priority
export function getImagePriority(section: string): boolean {
  // High priority for above-the-fold content
  return section === 'hero' || section === 'directory';
}

// Generate srcSet for responsive images
export function generateSrcSet(spec: ImageSpec): string {
  const [baseWidth] = spec.dimensions.split('x');
  const width = parseInt(baseWidth);
  
  const sizes = [
    Math.floor(width * 0.5),
    Math.floor(width * 0.75),
    width,
    Math.floor(width * 1.5),
    Math.floor(width * 2)
  ];
  
  return sizes
    .map(w => `/images/${spec.filename}?w=${w} ${w}w`)
    .join(', ');
}

// Generate sizes attribute for responsive loading
export function generateSizesAttribute(section: string): string {
  switch (section) {
    case 'hero':
      return '100vw';
    case 'directory':
    case 'business-detail':
      return '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px';
    default:
      return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px';
  }
}