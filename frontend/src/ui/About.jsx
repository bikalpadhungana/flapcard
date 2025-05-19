import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Array of cards with URLs and captions
const cards = [
  { src: 'https://www.flaap.me/flapcard', caption: 'Flap for Everyone', id: 1 },
  { src: 'https://www.flaap.me/payments/flapcard', caption: 'Flap for Payments', id: 2 },
  { src: 'https://www.flaap.me/business/flapcard', caption: 'Flap for Business', id: 3 },
  { src: 'https://www.flaap.me/ai/flapcard', caption: 'Flap for AI Enthusiasts', id: 4 },
  { src: 'https://www.flaap.me/artist/flapcard', caption: 'Flap for Artists', id: 5 },
  { src: 'https://www.flaap.me/healthcare/flapcard', caption: 'Flap for Healthcare', id: 6 },
  { src: 'https://www.flaap.me/developer/flapcard', caption: 'Flap for Developers', id: 7 },
  { src: 'https://www.flaap.me/student/flapcard', caption: 'Flap for Students', id: 8 },
];

const About = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Navigation functions
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  // Card variants for 3D animation
  const cardVariants = {
    active: {
      x: 0,
      y: 0,
      scale: 1,
      rotateY: 0,
      zIndex: 10,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    inactiveLeft: {
      x: -80,
      y: 40,
      scale: 0.85,
      rotateY: 25,
      zIndex: 5,
      opacity: 0.7,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    inactiveRight: {
      x: 80,
      y: 40,
      scale: 0.85,
      rotateY: -25,
      zIndex: 5,
      opacity: 0.7,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    exit: {
      x: 0,
      y: 150,
      scale: 0.5,
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full space-y-12">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Phone/Card Section */}
          <div className="relative flex justify-center lg:w-1/2">
            <div
              className="relative w-[340px] h-[640px] perspective-1000"
              tabIndex={0}
              role="region"
              aria-label="Flap Card carousel"
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') handlePrev();
                if (e.key === 'ArrowRight') handleNext();
              }}
            >
              {/* Background Gradient */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-[#e6f0fa] to-[#b3d4fc] rounded-3xl -z-10"
                style={{ width: '110%', height: '110%', transform: 'translate(-5%, -5%)' }}
              ></div>

              {/* 3D Card Stack */}
              <AnimatePresence>
                {cards.map((card, index) => {
                  let variant = 'exit';
                  if (index === currentIndex) variant = 'active';
                  else if (index === (currentIndex - 1 + cards.length) % cards.length) variant = 'inactiveLeft';
                  else if (index === (currentIndex + 1) % cards.length) variant = 'inactiveRight';

                  return (
                    variant !== 'exit' && (
                      <motion.div
                        key={card.id}
                        className="absolute w-[340px] h-[640px] rounded-3xl shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900"
                        style={{
                          transformStyle: 'preserve-3d',
                        }}
                        variants={cardVariants}
                        initial="exit"
                        animate={variant}
                        exit="exit"
                        whileHover={
                          variant === 'active'
                            ? { scale: 1.03, rotateY: 3, boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }
                            : {}
                        }
                        drag={variant === 'active' ? 'x' : false}
                        dragConstraints={{ left: -50, right: 50 }}
                        onDragEnd={(e, info) => {
                          if (info.offset.x > 50) handlePrev();
                          if (info.offset.x < -50) handleNext();
                        }}
                      >
                        {/* iPhone Frame */}
                        <div className="relative w-full h-full">
                          {/* Camera Module */}
                          <div className="absolute top-6 left-6 flex flex-col gap-2">
                            <div className="w-6 h-6 bg-gray-700 rounded-full border-2 border-gray-600"></div>
                            <div className="w-6 h-6 bg-gray-700 rounded-full border-2 border-gray-600 ml-4"></div>
                            <div className="w-3 h-3 bg-gray-600 rounded-full border-2 border-gray-500 absolute top-8 left-2"></div>
                          </div>

                          {/* Dynamic Island */}
                          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-24 h-8 bg-black rounded-full"></div>

                          {/* Screen */}
                          <div className="absolute inset-2 bg-black rounded-2xl overflow-hidden">
                            <iframe
                              src={card.src}
                              className="w-full h-full"
                              title={card.caption}
                              frameBorder="0"
                              sandbox="allow-scripts allow-same-origin"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                            {/* Fallback Content */}
                            <div
                              className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gray-900"
                              style={{ display: 'none' }}
                            >
                              <h3 className="text-lg font-semibold text-white">{card.caption}</h3>
                              <p className="text-sm text-gray-400 mt-2">
                                Unable to load preview. Visit the site for more information.
                              </p>
                              <a
                                href={card.src}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition"
                              >
                                Visit Site
                              </a>
                            </div>
                          </div>

                          {/* Volume Buttons */}
                          <div className="absolute left-[-2px] top-20 w-1 h-12 bg-gray-600 rounded-l-sm"></div>
                          <div className="absolute left-[-2px] top-36 w-1 h-12 bg-gray-600 rounded-l-sm"></div>

                          {/* Power Button */}
                          <div className="absolute right-[-2px] top-28 w-1 h-16 bg-gray-600 rounded-r-sm"></div>
                        </div>

                        {/* Caption Inside Card */}
                        <div className="absolute bottom-4 w-full text-center">
                          <p className="text-[#1c73ba] font-semibold text-base">{card.caption}</p>
                        </div>
                      </motion.div>
                    )
                  );
                })}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-[#1c73ba] text-white p-2 rounded-full hover:bg-blue-700 transition duration-300"
                aria-label="Previous card"
              >
                ❮
              </button>
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-[#1c73ba] text-white p-2 rounded-full hover:bg-blue-700 transition duration-300"
                aria-label="Next card"
              >
                ❯
              </button>
            </div>
          </div>

          {/* Text Section */}
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center lg:text-left">
              What is Flap <span className="text-[#1c73ba]">Card</span> ?
            </h2>
            <p className="text-gray-700 text-base sm:text-lg lg:text-xl leading-relaxed text-center lg:text-left">
              Flap Card is a digital contact-sharing platform that revolutionizes the way we connect. Ditch the outdated business cards and embrace the future of networking with customizable, shareable digital cards. Flap lets you instantly share your contact details, including social media profiles and websites, with real-time updates. Whether you're at a conference, networking event, or simply meeting someone new, Flap makes it easy to connect seamlessly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;