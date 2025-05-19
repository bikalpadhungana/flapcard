import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import FlapLogo from "/images/flap_page_logo.png";

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

function Main() {
  const [tapAnimation, setTapAnimation] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const canvasRef = useRef(null);

  const wordAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5 },
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height;
    const particles = [];
    const maxParticles = 100;
    let mouse = { x: null, y: null, radius: 150 };

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function createParticles() {
      for (let i = 0; i < maxParticles; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: Math.random() * 2 + 1,
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < maxParticles; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#1c73ba';
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }
    }

    function connectParticles() {
      for (let i = 0; i < maxParticles; i++) {
        for (let j = i + 1; j < maxParticles; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = '#dbecfa';
            ctx.stroke();
          }
        }
      }
    }

    function mouseInteractions() {
      for (let i = 0; i < maxParticles; i++) {
        const p = particles[i];
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.hypot(dx, dy);
        if (distance < mouse.radius) {
          p.vx = dx / 6;
          p.vy = dy / 6;
        }
      }
    }

    function animate() {
      drawParticles();
      connectParticles();
      if (mouse.x && mouse.y) mouseInteractions();
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });
    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });
    window.addEventListener('click', () => {
      for (let i = 0; i < maxParticles; i++) {
        const p = particles[i];
        p.vx = (Math.random() - 0.5) * 5;
        p.vy = (Math.random() - 0.5) * 5;
      }
    });

    resizeCanvas();
    createParticles();
    animate();
  }, []);

  const cardTapVariants = {
    initial: { y: -20, rotate: 0, scale: 0.9 },
    tap: {
      y: -150,
      rotate: -5,
      scale: 1.1,
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
  };

  const phoneShakeVariants = {
    initial: { rotate: 0 },
    shake: {
      rotate: [0, 2, -2, 1, -1, 0],
      transition: { duration: 0.4, ease: 'easeInOut' },
    },
  };

  const rippleVariants = {
    initial: { scale: 0, opacity: 0.5 },
    animate: {
      scale: 2,
      opacity: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const handleTap = () => {
    setTapAnimation(true);
    setCurrentCardIndex((prev) => (prev + 1) % cards.length);
    setTimeout(() => setTapAnimation(false), 600);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text Section */}
          <div className="text-center lg:text-left lg:w-1/2">
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={wordAnimation}
              className="space-y-4"
            >
              {['Inspire', 'Impress', 'Innovate'].map((word, index) => (
                <motion.h1
                  key={index}
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900"
                  whileHover={{ scale: 1.1, color: index % 2 === 0 ? '#1c73ba' : '#10b981' }}
                  transition={{ duration: 0.3 }}
                >
                  {word}
                </motion.h1>
              ))}
            </motion.div>
            <p className="mt-6 text-lg text-gray-600">Click icons to download the app or create your card.</p>
            <div className="mt-8 flex justify-center lg:justify-start gap-6">
              <a
                href="https://drive.google.com/file/d/1JNnPrsv3mjpe6fqNFhlGrVAWU9VYZHIi/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              >
                <motion.i
                  className="fab fa-android text-2xl text-[#1c73ba]"
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.2 }}
                />
              </a>
              <a
                href="/create-card"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              >
                <motion.i
                  className="fas fa-id-card text-2xl text-[#1c73ba]"
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.2 }}
                />
              </a>
            </div>
          </div>

          {/* Phone and Card Section */}
          <div className="relative flex justify-center lg:w-1/2">
            <motion.div
              className="relative w-[250px] h-[500px] rounded-[30px] bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl"
              variants={phoneShakeVariants}
              animate={tapAnimation ? 'shake' : 'initial'}
              onClick={handleTap}
            >
              {/* Camera Module */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <div className="w-5 h-5 bg-gray-700 rounded-full border border-gray-600"></div>
                <div className="w-5 h-5 bg-gray-700 rounded-full border border-gray-600 ml-3"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full border border-gray-500 absolute top-6 left-1"></div>
              </div>

              {/* Dynamic Island */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-black rounded-full"></div>

              {/* Screen */}
              <div className="absolute inset-2 bg-black rounded-[24px] overflow-hidden">
                <iframe
                  src={cards[currentCardIndex].src}
                  className="w-full h-full"
                  title={cards[currentCardIndex].caption}
                  frameBorder="0"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>

              {/* Volume Buttons */}
              <div className="absolute left-[-2px] top-16 w-1 h-10 bg-gray-600 rounded-l-sm"></div>
              <div className="absolute left-[-2px] top-32 w-1 h-10 bg-gray-600 rounded-l-sm"></div>

              {/* Power Button */}
              <div className="absolute right-[-2px] top-24 w-1 h-14 bg-gray-600 rounded-r-sm"></div>

              {/* Ripple Effect */}
              {tapAnimation && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  variants={rippleVariants}
                  initial="initial"
                  animate="animate"
                  style={{ background: 'radial-gradient(circle, rgba(28, 115, 186, 0.3) 0%, transparent 70%)', pointerEvents: 'none' }}
                />
              )}
            </motion.div>

            {/* NFC Card for Ram */}
            <motion.div
              className="absolute w-[200px] h-[300px] rounded-[12px] bg-gradient-to-br from-[#1c73ba] to-[#135a8f] shadow-xl overflow-hidden"
              variants={cardTapVariants}
              initial="initial"
              animate={tapAnimation ? 'tap' : 'initial'}
              onClick={handleTap}
              style={{ top: '15%', left: '50%', transform: 'translateX(-50%)' }}
            >
              <div className="relative w-full h-full flex flex-col items-center justify-center text-white p-4">
                <img src={FlapLogo} alt="Ram's Professional Card Logo" className="w-16 h-16 mb-4" />
                <h3 className="text-xl font-bold tracking-wider">Flap Card</h3>
                <p className="text-sm font-medium mt-1">Flap</p>
                <div className="w-12 h-12 rounded-full border-4 border-white flex items-center justify-center my-3 bg-[#ffffff20]">
                  <span className="text-sm font-medium">Tap</span>
                </div>
                <div className="text-xs space-y-1 text-center">
                  <p>Email: card@flap.com.np</p>
                  <p>Phone: +977 9802365432</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10"></canvas>
    </div>
  );
}

export default Main;