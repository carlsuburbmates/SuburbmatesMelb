import Link from 'next/link';

export function FeaturedSection() {
  return (
    <section className="py-16 md:py-24 accent-overlay-orange">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/images/featured-workspace.jpg)',
          filter: 'grayscale(100%)'
        }}
      />
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="relative container-custom">
        <div className="max-w-2xl">
          <h2 className="text-white mb-6">
            Get Featured
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Boost your visibility with featured placement in your local area. 
            Stand out from the competition and attract more customers.
          </p>
          <div className="space-y-4 mb-8">
            <div className="flex items-center text-white/80">
              <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
              <span className="text-sm">Prime position in search results</span>
            </div>
            <div className="flex items-center text-white/80">
              <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
              <span className="text-sm">30 days of featured visibility</span>
            </div>
            <div className="flex items-center text-white/80">
              <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
              <span className="text-sm">Just A$20 per placement</span>
            </div>
          </div>
          <button className="btn-secondary bg-white text-gray-900 hover:bg-gray-100">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}