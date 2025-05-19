import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

function CardsDesign({ type, desc, img, price, onToggle, buttonText }) {

  const orderCard = () => {
    let message = '';
    switch (type) {
      case 'Plastic':
        message = `I would like to order Plastic Flap card. Here is the image: https://flaap.me/images/plasticCard_front.png`;
        break;
      case 'Wood':
        message = `I would like to order wooden Flap card. Here is the image: https://flaap.me/images/woodCard_front.png`;
        break;
      case 'Metal':
        message = `I would like to order Metal Flap card. Here is the image: https://flaap.me/images/metalCard_front.png`;
        break;
      case 'Black Metal':
        message = `I would like to order Black Metal Flap card. Here is the image: https://flaap.me/images/blackmetalCard_front.png`;
        break;
      case 'Flap Stand':
        message = `I would like to order Flap Stand. Here is the image: https://flaap.me/images/flapStand_wood.png`;
        break;
      case 'Social Media':
        message = `I would like to order Social Media card. Here is the image: https://flaap.me/images/instafaceCard.png`;
        break;
      case 'Flap Keyring':
        message = `I would like to order Keyring. Here is the image: https://flaap.me/images/keyring_wood.png`;
        break;
      default:
        message = 'I would like to Customized order';
        break;
        
    }
    window.open(`https://wa.me/9779802365432?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="flex flex-col items-center">
      <img src={img} alt={`${type} Card`} className="w-[300px] mb-3" />
      <div className="text-center">
        <p className="font-semibold md:text-xl">{type}</p>
        <p className="text-[0.80rem] md:text-sm">{desc}</p>
      </div>
      <div className="flex justify-between items-center mt-2 w-full px-4">
        <button
          onClick={onToggle}
          className="bg-[#1c73ba] text-white py-1 px-2 rounded-lg transition-colors duration-300 hover:bg-white hover:text-[#1c73ba]"
        >
          {buttonText}
        </button>
        <p className="text-gray-700 font-semibold">{price}</p>
      </div>
      <div className="mt-2">
        <button
          onClick={orderCard}
          className="bg-[#1c73ba] text-white py-1 px-4 rounded-lg transition-colors duration-300 hover:bg-white hover:text-[#1c73ba]"
        >
          Order Now
        </button>
      </div>
    </div>
  );
}

function Products() {
  const [showBack, setShowBack] = useState({});

  const toggleShowBack = (index) => {
    setShowBack((prevState) => {
      if (cards[index].type === "Social Media") {
        const nextValue = (prevState[index] !== undefined ? prevState[index] + 1 : 0) % 3; // Cycle through 0, 1, 2
        return {
          ...prevState,
          [index]: nextValue,
        };
      }
      return {
        ...prevState,
        [index]: !prevState[index], // Toggle for other card types
      };
    });
  };

  const cards = [
    { type: 'Plastic', frontImg: '/images/plasticCard_front.png', backImg: '/images/plasticCard_back.png', desc: 'Classic and durable, ideal for everyday use.', price: 'Rs. 1499' },
    { type: 'Wood', frontImg: '/images/woodCard_front.png', backImg: '/images/woodCard_back.png', desc: 'Unique and eco-friendly, for a natural touch.', price: 'Rs. 2499' },
    { type: 'Metal', frontImg: '/images/metalCard_front.png', backImg: '/images/metalCard_back.png', desc: 'Sleek and sophisticated, for a premium feel.', price: 'Rs. 3499' },
    { type: 'Black Metal', frontImg: '/images/blackmetalCard_front.png', backImg: '/images/blackmetalCard_back.png', desc: 'Sleek and sophisticated, for a premium feel.', price: 'Rs. 3499' },
    {
      type: 'Flap Stand',
      frontImg: '/images/flapStand_acrylic.png',
      backImg: '/images/flapStand_wood.png',
      desc: 'Dynamic QR code with content control.',
      price: 'Rs. 2999',
      woodPrice: 'Rs. 3999',
    },
    {
      type: 'Social Media',
      reviewImg: '/images/reviewCard.png',
      instafaceImg: '/images/instafaceCard.png',
      othersImg: '/images/othersCard.png',
      desc: 'Social card for instant online connections.',
      price: 'Rs. 1499',
    },
    {
      type: 'Flap Keyring',
      frontImg: '/images/keyring_Acrylic.png',
      backImg: '/images/keyring_wood.png',
      desc: 'Stylish and portable way to share your details.',
      price: 'Rs. 599',
      woodPrice: 'Rs. 999',
    },
  ];

  return (
    <>  
      <div className='max-w-6xl mx-auto space-y-4 py-4 px-6 text-center'>      
        <h2 className="pb-3 text-center text-[clamp(1.1rem,2.8vw+1rem,2.2rem)] text-[#232946] font-semibold">
          Our <span className="text-[#1c73ba]">Products</span> 
        </h2>
      </div>

      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        slidesPerView={1.1}
        spaceBetween={10}
        centeredSlides={true}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 6, centeredSlides: false },
          1024: { slidesPerView: 3, spaceBetween: 10, centeredSlides: false },
        }}
      >
        {cards.map((card, index) => (
          <SwiperSlide key={index}>
            <CardsDesign 
              type={card.type} 
              desc={card.desc} 
              img={
                card.type === 'Social Media' 
                  ? (showBack[index] === 0 ? card.reviewImg : showBack[index] === 1 ? card.othersImg : card.instafaceImg) 
                  : (showBack[index] ? card.backImg : card.frontImg)
              }
              price={card.type === 'Flap Stand' && showBack[index] ? card.woodPrice : card.price}
              onToggle={() => toggleShowBack(index)}
              buttonText={
                card.type === 'Plastic' || card.type === 'Wood' || card.type === 'Metal'
                  ? (showBack[index] ? 'Front' : 'Back')
                  : card.type === 'Flap Stand'
                  ? (showBack[index] ? 'Acrylic' : 'Wood')
                  : card.type === 'Flap Keyring'
                  ? (showBack[index] ? 'Acrylic' : 'Wood')
                  : card.type === 'Social Media'
                  ? (showBack[index] === 0 ? 'Others' : showBack[index] === 1 ? 'Instaface' : 'Review')
                  : (showBack[index] ? 'Back' : 'Front')
              }
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

export default Products;
