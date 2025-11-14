export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Create Profile',
      description: 'Set up your free business directory profile in minutes. Add photos, contact details, and showcase your services.',
      icon: '👤'
    },
    {
      number: '02', 
      title: 'Connect Locally',
      description: 'Get discovered by customers in your suburb. Build trust through reviews and local community engagement.',
      icon: '🤝'
    },
    {
      number: '03',
      title: 'Grow Revenue',
      description: 'Upgrade to sell digital products when ready. Keep 92-94% of sales with our vendor-friendly commission structure.',
      icon: '📈'
    }
  ];

  return (
    <section className="py-16 md:py-24 accent-overlay-purple">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/images/how-it-works.jpg)',
          filter: 'grayscale(100%)'
        }}
      />
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="relative container-custom">
        <div className="text-center mb-16">
          <h2 className="text-white mb-6">
            How It Works
          </h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Three simple steps to establish your local digital presence and start 
            building meaningful connections with your community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div 
              key={step.number}
              className="text-center animate-slide-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                {step.icon}
              </div>
              <div className="text-white/60 text-sm font-medium tracking-wider uppercase mb-2">
                Step {step.number}
              </div>
              <h3 className="text-white mb-4 text-xl">
                {step.title}
              </h3>
              <p className="text-white/80 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <a href="/auth/signup" className="btn-secondary bg-white text-gray-900 hover:bg-gray-100">
            Start Now
          </a>
        </div>
      </div>
    </section>
  );
}