'use client';

interface HeroSectionProps {
  productCount?: number;
}

export default function HeroSection({ productCount = 0 }: HeroSectionProps) {
  return (
    <section className="relative pt-0 pb-0 px-0 lg:px-0 overflow-hidden h-96 md:h-[500px] lg:h-[600px]">
      {/* Background Image - Full Screen */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/assets/images/hero-rfid-yellow.jpg)',
          }}
        ></div>
      </div>
    </section>
  );
}