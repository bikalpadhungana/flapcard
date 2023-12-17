import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

// components
import Navbar from "../components/Navbar";
import flapCard from "../../images/flap-card.png";

// user hooks
import useUserCardContext from "../hooks/use.user.card.context";
import { useAuthContext } from "../hooks/use.auth.context";

export default function Home() {

  const { user } = useAuthContext();
  const { data, dispatch } = useUserCardContext();

  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const sendData = useRef({});

  // sending data change
  useEffect(() => {
    sendData.current = data;
    if (user && sendData.current) {
      sendData.current._id = user._id;
    }
  }, [data, user]);

  useEffect(() => {
    const placeUserCardOrder = async () => {

      const response = await fetch("http://localhost:3000/api/order/placeOrder", {
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
    e.preventDefault();

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
  }

  const handleColorChange = (e) => {
    setFormData({ ...formData, color: e.target.id });
  }

  return (
      <div>
          <Navbar />
          <div className="flex flex-col md:flex-row gap-8 md:gap-20 max-w-full mx-auto">
              <div className="flex flex-col">  
                <div className="max-w-3xl my-8 mx-5 border-2 border-navbar rounded-xl">
                    <img src={flapCard}></img>
                </div>
                <div className="flex max-w-xs md:max-w-3xl mx-auto md:ml-5">
                    <button onClick={handleColorChange} id="grey" className="w-10 md:w-20 h-10 md:ml-10 bg-card-color-1 hover:w-12 hover:md:w-24 hover:-ml-1 hover:md:ml-9 duration-500"></button>
                    <button onClick={handleColorChange} id="cyan" className="w-10 md:w-20 h-10 ml-2 md:ml-5 bg-card-color-2 hover:w-12 hover:md:w-24 hover:md:ml-9 duration-500"></button>
                    <button onClick={handleColorChange} id="pink" className="w-10 md:w-20 h-10 ml-2 md:ml-5 bg-card-color-3 hover:w-12 hover:md:w-24 hover:md:ml-9 duration-500"></button>
                    <button onClick={handleColorChange} id="dark-grey" className="w-10 md:w-20 h-10 ml-2 md:ml-5 bg-card-color-4 hover:w-12 hover:md:w-24 hover:md:ml-9 duration-500"></button>
                    <button onClick={handleColorChange} id="black" className="w-10 md:w-20 h-10 ml-2 md:ml-5 bg-card-color-5 hover:w-12 hover:md:w-24 hover:md:ml-9 duration-500"></button>
                    <button onClick={handleColorChange} id="navy-blue" className="w-10 md:w-20 h-10 ml-2 md:ml-5 bg-card-color-6 hover:w-12 hover:md:w-24 hover:md:ml-9 duration-500"></button>
                    <button onClick={handleColorChange} id="green" className="w-10 md:w-20 h-10 ml-2 md:ml-5 bg-card-color-7 hover:w-12 hover:md:w-24 hover:md:ml-9 duration-500"></button>
                </div>
              </div>
              <div className="max-w-3xl mx-auto mb-5 md:ml-10 md:my-auto p-10 border-2 border-navbar rounded-xl">
                  <form className="flex flex-col gap-5">
                    <input onChange={handleChange} type='text' placeholder='Username' className='w-60 md:w-96 border p-3 rounded-lg' id='username' />
                    <input onChange={handleChange} type='text' placeholder='Email' className='w-60 md:w-96 border p-3 rounded-lg' id='email' />
                    <input onChange={handleChange} type='number' placeholder='Phone number' className='w-60 md:w-96 border p-3 rounded-lg' id='phone_number' />
                    <input onChange={handleChange} type='text' placeholder='Organization' className='w-60 md:w-96 border p-3 rounded-lg' id='organization' />
                    <button onClick={handleCreateCard} className='bg-navbar text-black p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create Card</button>
                  </form>
              </div>
          </div>
    </div>
  )
}