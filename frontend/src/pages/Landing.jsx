import React, { useState, useEffect } from 'react';
import Navbar from "../ui/Navbar";
import Main from "../ui/Main";
import About from "../ui/About";
import Icon from "../ui/icon";
import Footer from "../ui/Footer";
import CheckUserLoggedStatus from "../utilities/CheckUserLoggedStatus";
import Products from "../ui/Products";
import Testimonial from "./Testimonial";
import TrustedBy from "./TrustedBy";

function Landing() {
  const [loading, setLoading] = useState(true);
  const [circles, setCircles] = useState([]);
  const [userPresent, setUserPresent] = useState(true);

  // Generate random card animations every 1 second
  useEffect(() => {
    const generateRandomCards = () => {
      const newCircle = {
        id: Math.random(), // Unique ID for each animation
        className: "absolute animate-pulse",
        style: {
          width: '24px', // Size of the SVG
          height: '24px',
          left: `${Math.random() * 100}%`, // Random x position (0-100%)
          top: `${Math.random() * 100}%`, // Random y position (0-100%)
          transform: 'translate(-50%, -50%)', // Center the SVG
          animationDuration: '1s', // Duration of the pulse animation
        },
      };

      // Add new animation and limit to 10 at a time
      setCircles((prevCircles) => {
        const updatedCircles = [...prevCircles, newCircle].slice(-10); // Keep only the last 10
        return updatedCircles;
      });

      // Remove the animation after 2 seconds
      setTimeout(() => {
        setCircles((prevCircles) => prevCircles.filter((circle) => circle.id !== newCircle.id));
      }, 2000);
    };

    // Generate a new animation every 1 second
    const interval = setInterval(generateRandomCards, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Card Animation SVG Component
  const CardAnimation = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Card rectangle */}
      <rect x="4" y="6" width="16" height="12" rx="2" fill="#1c73ba" />
      {/* Ripple circles */}
      <circle cx="12" cy="12" r="4" fill="none" stroke="#1c73ba" strokeWidth="1">
        <animate
          attributeName="r"
          from="4"
          to="8"
          dur="1.5s"
          repeatCount="indefinite"
          begin="0s"
        />
        <animate
          attributeName="opacity"
          from="1"
          to="0"
          dur="1.5s"
          repeatCount="indefinite"
          begin="0s"
        />
      </circle>
      <circle cx="12" cy="12" r="4" fill="none" stroke="#1c73ba" strokeWidth="1">
        <animate
          attributeName="r"
          from="4"
          to="8"
          dur="1.5s"
          repeatCount="indefinite"
          begin="0.5s"
        />
        <animate
          attributeName="opacity"
          from="1"
          to="0"
          dur="1.5s"
          repeatCount="indefinite"
          begin="0.5s"
        />
      </circle>
    </svg>
  );

  

  return (
    <>
     

      <CheckUserLoggedStatus />
      <Navbar />
      <Main />
      
      <main className="max-w-[1152px] mx-auto px-5">
      <Icon />
        <About />
        
        <Products />
        <Testimonial /> {/* Fixed: Replaced <Test Missy /> */}
        <TrustedBy />

        <div className="py-12">
          <h2 className="text-[clamp(1.1rem,2.8vw+1rem,2.2rem)] text-center font-semibold pb-9 text-[#232946]">
            How does Flap card <span className="text-[#1c73ba]">Work</span>?
          </h2>
          <video
            src="/images/flapcard.mp4"
            className="w-full h-[65vw] lg:h-[570px]"
            title="Flap Works"
            controls
            loop
            autoPlay
          >
            Your browser doesn't support video
          </video>
        </div>

        <div className="py-12 relative">
          <h2 className="text-[clamp(1.1rem,2.8vw+1rem,2.2rem)] text-center font-semibold pb-9 text-[#232946]">
            Flap card in <span className="text-[#1c73ba]">Action</span>
          </h2>
          <div className="relative">
            <img
              src="/images/flapworld.svg"
              alt="World Map"
              className="w-full h-auto world-map"
            />
            <div id="location-circles" className="absolute top-0 left-0 w-full h-full">
              {circles.map((circle) => (
                <div
                  key={circle.id}
                  className={circle.className}
                  style={circle.style}
                >
                  <CardAnimation />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Landing;