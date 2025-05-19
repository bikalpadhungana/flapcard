import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

// components
import Navbar from "../ui/Navbar";
import exampleQr from "/images/example-flap-user.svg";

// user hooks
import useUserCardContext from "../hooks/use.user.card.context";
import { useAuthContext } from "../hooks/use.auth.context";

export default function PlaceOrder() {

  const { user } = useAuthContext();
  const { data, dispatch } = useUserCardContext();

  const navigate = useNavigate();
  const [username, setUsername] = useState("Name");
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [cardView, setCardView] = useState("front");
  const sendData = useRef({});

  const cardBackDiv = useRef(null);
  const cardFrontDiv = useRef(null);

  const cardColors = {
    'black': '#07090e',
    'cyan': '#CBD1F0',
    'pink': '#fecca5',
    'dark-grey': '#2b2a2b',
    'grey': '#8d807f',
    'navy-blue': '#1c1938',
    'green': '#8bca62'
  }

  // check if the username state is empty
  useEffect(() => {
    if (username === "") {
      setUsername("Name");
    }
  }, [username]);

  // sending data change
  useEffect(() => {
    sendData.current = data;
    if (user && sendData.current) {
      sendData.current._id = user._id;
    }
  }, [data, user]);

  useEffect(() => {
    const placeUserCardOrder = async () => {

      const response = await fetch("https://backend.flaap.me/api/order/placeOrder", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendData.current)
      });

      const resData = await response.json();

      if (resData.success === false) {
        alert("There was an error processing your order request. Please try again");
        return;
      }

      alert("Card Order Placed");

    }

    // user filled the card data and then signed up. 
    if (user && sendData.current) {
      placeUserCardOrder();
      dispatch({ type: 'DELETE_USER_CARD_DATA' });
    }
  }, [user, dispatch]);

  const handleCreateCard = (e) => {
    setError(null);
    e.preventDefault();

    if (!formData.username || !formData.email) {
      setError("Username and Email are required");
      return;
    }

    if (!user) {
      if (!formData.color) {
        formData.color = "black";
      }

      dispatch({ type: 'STORE_USER_CARD_DATA', payload: formData });
      alert("Please sign up before creating a card.");
      navigate("/sign-up");
      return;
    }

    // user is signed in and then ordered a card. Link to backend.

  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });

    if (e.target.id === "username") {
      setUsername(e.target.value);
    }
  }

  const handleColorChange = (e) => {
    setFormData({ ...formData, color: e.target.id });

    Object.keys(cardColors).map((color) => {
      if (color === e.target.id) {
        const changeCardColor = color;
        cardBackDiv.current.style.backgroundColor = cardColors[changeCardColor];
        cardFrontDiv.current.style.backgroundColor = cardColors[changeCardColor];
      }
    })
  }

  const handleCardViewChange = (e) => {
    switch (e.target.id) {
      case 'front':
        setCardView("front");
        console.log("front");
        break;
      case 'back':
        setCardView("back");
        console.log("back");
        break;
    }
  }

  if (!user) {
    return (
      <div>
          <Navbar />
          <div className="flex flex-col lg:flex-row self-center justify-center sm:gap-10 lg:gap-5">
              <div className="flex flex-col w-auto md:w-[500px] lg:w-[700px]">  
                  {cardView === "front" ? 
                    (<div className="flex flex-col max-w-3xl md:max-w7-3xl h-60 md:h-96 my-8 mx-5 border-2 border-brand_1 rounded-xl  ">
                    <div ref={cardFrontDiv} className="w-72 md:w-9/12 h-3/4 mx-auto my-7 md:my-12 rounded-xl bg-card-color-1 bg-world-map bg-cover flex self-center">
                      <p className="text-white text-base text-left md:text  -lg font-medium ml-3 md:ml-5 pt-36 md:pt-60">{username}</p>
                    </div>
                    <button onClick={handleCardViewChange} ref={cardBackDiv} id="back" className="w-12 h-6 bg-card-color-1 -mt-6 md:-mt-10 ml-3 md:ml-8 text-white text-xs md:text-sm text-center">
                      Back
                    </button>
                  </div>)  :
                    (
                      <div className="flex flex-col max-w-3xl md:max-w-3xl h-60 md:h-96 my-8 mx-5 border-2 border-brand_1 rounded-xl  ">
                      <div ref={cardBackDiv} className="w-72 md:w-9/12 h-3/4 mx-auto my-7 md:my-12 rounded-xl bg-card-color-1 bg-world-map bg-cover flex justify-center items-center">
                        <div className="h-13 p-2 bg-[rgb(255,255,255)] rounded">
                        <img src={exampleQr} className="h-12 md:h-20 invert"></img>
                        </div>
                      </div>
                      <button onClick={handleCardViewChange} ref={cardFrontDiv} id="front" className="w-12 h-6 bg-card-color-1 -mt-6 md:-mt-10 ml-3 md:ml-8 text-white text-xs md:text-sm text-center">
                        Front
                      </button>
                    </div>  
                    )
                  }
                <div className="flex flex-row my-2 mx-auto md:ml-5">
    <button onClick={handleColorChange} id="black" className="w-10 md:w-20 h-10 md:ml-0  bg-card-color-1 duration-500"></button>
    <button onClick={handleColorChange} id="cyan" className="w-10 md:w-20 h-10 ml-2 md:ml-5 bg-card-color-2 duration-500"></button>
    <button onClick={handleColorChange} id="pink" className="w-10 md:w-20 h-10 ml-2 md:ml-5 bg-card-color-3 duration-500"></button>
    <button onClick={handleColorChange} id="dark-grey" className="w-10 md:w-20 h-10 ml-2 md:ml-5 bg-card-color-4 duration-500"></button>
    <button onClick={handleColorChange} id="grey" className="w-10 md:w-20 h-10 ml-2 md:ml-5 bg-card-color-5 duration-500"></button>
    <button onClick={handleColorChange} id="navy-blue" className="w-10 md:w-20 h-10 ml-2 md:ml-5 bg-card-color-6 duration-500"></button>            
    <button onClick={handleColorChange} id="green" className="w-10 md:w-20 h-10 ml-2 md:ml-5 bg-card-color-7 duration-500"></button>
</div>

              </div>
              <div className="flex flex-col">
                <div className="max-w-3xl mx-auto mt-8 p-10 border-2 border-brand_1 rounded-xl">
                    <form className="flex flex-col gap-5">
                      <input onChange={handleChange} type='text' placeholder='Username' className='w-60 md:w-96 border p-3 rounded-lg' id='username' />
                      <input onChange={handleChange} type='text' placeholder='Email' className='w-60 md:w-96 border p-3 rounded-lg' id='email' />
                      <input onChange={handleChange} type='number' placeholder='Phone number' className='w-60 md:w-96 border p-3 rounded-lg' id='phone_number' />
                      <input onChange={handleChange} type='text' placeholder='Organization' className='w-60 md:w-96 border p-3 rounded-lg' id='organization' />
                      <button onClick={handleCreateCard} className='bg-brand_main text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create Card</button>
                    </form>
                </div>
                {error && <p className="text-red-500 mb-4 ml-10">{error}</p>}
              </div>
          </div>
      </div>
    )
  }
  else {
    return (
      <div>
        <Navbar />
        <div className="flex flex-col md:flex-row gap-8 md:gap-20 max-w-full mx-auto">
              <div className="flex flex-col">  
                  {cardView === "front" ? 
                    (<div className="flex flex-col max-w-3xl md:max-w-3xl h-60 md:h-96 my-8 mx-5 border-2 border-brand_1 rounded-xl">
                      <div ref={cardFrontDiv} className="w-72 md:w-9/12 h-3/4 mx-auto my-7 md:my-12 rounded-xl bg-card-color-1 bg-world-map bg-cover">
                        <p className="text-white text-base md:text-lg font-medium ml-3 md:ml-5 pt-36 md:pt-60">{username}</p>
                      </div>
                      <button onClick={handleCardViewChange} ref={cardBackDiv} id="back" className="w-12 h-6 bg-card-color-1 -mt-6 md:-mt-10 ml-3 md:ml-8 text-white text-xs md:text-sm text-center">
                        Back
                      </button>
                    </div>) :
                    (
                      <div className="flex flex-col max-w-3xl md:max-w-3xl h-60 md:h-96 my-8 mx-5 border-2 border-brand_1 rounded-xl ">
                        <div ref={cardBackDiv} className="w-72 md:w-9/12 h-3/4 mx-auto my-7 md:my-12 rounded-xl bg-card-color-1 bg-world-map bg-cover flex justify-center items-center">

                          <img src={exampleQr} className="h-20"></img>
                        </div>
                        <button onClick={handleCardViewChange} ref={cardFrontDiv} id="front" className="w-12 h-6 bg-card-color-1 -mt-6 md:-mt-10 ml-3 md:ml-8 text-white text-xs md:text-sm text-center">
                          Front
                        </button>
                      </div>
                    )
                  }
                <div className="flex max-w-xs md:max-w-3xl mx-auto md:ml-5">
                    <button onClick={handleColorChange} id="black" className="w-10 md:w-20 h-10 md:ml-0 bg-card-color-1 hover:w-12 hover:md:w-24 hover:md:ml-9 duration-500"></button>
                    <button onClick={handleColorChange} id="cyan" className="w-10 md:w-20 h-10 ml-2 md:ml-5 bg-card-color-2 hover:w-12 hover:md:w-24 hover:md:ml-9 duration-500"></button>
                    <button onClick={handleColorChange} id="pink" className="w-10 md:w-20 h-10 ml-2 md:ml-5 bg-card-color-3 hover:w-12 hover:md:w-24 hover:md:ml-9 duration-500"></button>
                    <button onClick={handleColorChange} id="dark-grey" className="w-10 md:w-20 h-10 ml-2 md:ml-5 bg-card-color-4 hover:w-12 hover:md:w-24 hover:md:ml-9 duration-500"></button>
                    <button onClick={handleColorChange} id="grey" className="w-10 md:w-20 h-10 ml-2 md:ml-5 bg-card-color-5 hover:w-12 hover:md:w-24 hover:md:ml-9 duration-500"></button>
                    <button onClick={handleColorChange} id="navy-blue" className="w-10 md:w-20 h-10 ml-2 md:ml-5 bg-card-color-6 hover:w-12 hover:md:w-24 hover:md:ml-9 duration-500"></button>
                    <button onClick={handleColorChange} id="green" className="w-10 md:w-20 h-10 ml-2 md:ml-5 bg-card-color-7 hover:w-12 hover:md:w-24 hover:md:ml-9 duration-500"></button>
                </div>
              </div>
              <div>
                User Order List
              </div>
          </div>
      </div>
    )
  }

}