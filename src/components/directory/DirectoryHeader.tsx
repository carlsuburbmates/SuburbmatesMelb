export function DirectoryHeader() {
  return (
    <section className="bg-white border-b border-gray-200">
      <div className="container-custom py-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Melbourne Creator Directory
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Discover local creators in your neighborhood. From design studios to makers, 
            find exactly who you need in your suburb.
          </p>
            <div className="text-sm text-gray-500">
              <span className="inline-flex items-center space-x-2">
                <span>🏢</span>
                <span>Creator listings are free</span>
              </span>
            <span className="mx-4">•</span>
            <span className="inline-flex items-center space-x-2">
              <span>🛍️</span>
              <span>Upgrade to sell digital products</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}