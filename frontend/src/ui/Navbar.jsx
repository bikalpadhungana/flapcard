import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/use.auth.context";
import { MenuOutlined } from "@ant-design/icons";
import { Drawer } from "antd";
import { useEffect, useState } from "react";
import FlapLogo from "/images/flap.png"

export default function Navbar() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { user } = useAuthContext();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    if (windowWidth > 768) {
      setDrawerOpen(false);
    }
    //add event listener when compent mounts to detect resize
    window.addEventListener("resize", handleResize);

    //cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth]);


  return (
    <header className="bg-black py-4 sm:py-5 mb-[0px]">
      <div className="max-w-[1150px] mx-auto flex justify-between px-5 items-center">
        <Link to="/">
        <img src="/images/flap_white.png" alt="" className="w-[70px] sm:w-[80px] ps-1"/>
        </Link>
        <ul className=" gap-8 text-white text-[0.9rem] items-center hidden md:visible md:flex">
          <Link to="/">
            <li>Home</li>
          </Link>
          <li>||</li>
          {!user && (
            <>
              <Link to="/sign-in">
                <li>Sign In</li>
              </Link>
              <Link to="/sign-up">
                <li className="border rounded-md px-2 py-1">Sign Up</li>
              </Link>
            </>
          )}
          {user && (
            <>
              <Link to="/Profile">
                <li className="border rounded-md px-2 py-1">Profile</li>
              </Link>
            </>
          )}
          
        </ul>
        <MenuOutlined
          className="text-white text-[1.6rem] sm:text-[2rem] visible md:hidden cursor-pointer"
          onClick={() => setDrawerOpen(true)}
        />
      </div>
      <Drawer
        title={<img src={FlapLogo} alt="Flap Logo" className="w-[80px] py-3"/>}
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={200}
        closable={false}
     
      >
        <ul className=" gap-8 text-black text-[0.95rem] items-left flex flex-col font-['Montserrat'] font-medium ">
          <Link to="/">
            <li className="hover:text-[#23455A] ease-linear duration-150">Home</li>
          </Link>
          {/* <li className="hover:text-[#23455A] ease-linear duration-150">About</li>
          <li className="hover:text-[#23455A] ease-linear duration-150">Contact</li> */}
          {!user && (
            <>
              <Link to="/sign-in">
                <li className="hover:text-[#23455A] ease-linear duration-150">Sign In</li>
              </Link>
              <Link to="/sign-up">
                <li className="hover:text-[#23455A] ease-linear duration-150">Sign Up</li>
              </Link>
            </>
          )}
          {user && (
            <>
              <Link to="/profile">
                <li className="hover:text-[#101011] ease-linear duration-150">Profile</li>
              </Link>
            </>
          )}
        </ul>
      </Drawer>
    </header>
  );
}