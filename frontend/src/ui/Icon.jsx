import React from 'react';

const IconCarousel = () => {
  const icons = [
    { icon: "fas fa-seedling", label: "ECO FRIENDLY" },
    { icon: "fas fa-lock", label: "Secure" },
    { icon: "fas fa-bolt", label: "Real-time updates" },
    { icon: "fas fa-tools", label: "Customizable" },
    { icon: "fas fa-hand-pointer", label: "Easy to use" },
    { icon: "fas fa-hand-holding-usd", label: "Affordable" },
    { icon: "fas fa-exchange", label: "Two-way contact sharing" },
    { icon: "fas fa-user-edit", label: "Personalization" },
  ];

  return (
    <>
      <style jsx>{`
        .animate-marquee {
          animation: marquee 80s linear infinite;
          display: inline-block;
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-66.66%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
          }
        }
      `}</style>
      <div className="relative overflow-hidden py-12 md:py-16">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...icons, ...icons, ...icons].map((item, index) => (
            <div 
              key={index}
              className="group mx-10 md:mx-14 inline-flex flex-col items-center transition-all duration-1000"
            >
              <div className="relative flex flex-col items-center">
                <i 
                  className={`${item.icon} text-4xl md:text-5xl text-[#1c73ba] drop-shadow-md 
                    transition-transform duration-300 group-hover:scale-125`}
                  aria-label={item.label}
                ></i>
                <span className="absolute top-full mt-3 text-sm md:text-base font-medium text-[#1c73ba] 
                  opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-2
                  whitespace-nowrap tracking-wide">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default IconCarousel;