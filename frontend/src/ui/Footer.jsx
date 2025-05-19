import {
  FacebookFilled,
  InstagramFilled,
  LinkedinFilled,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="bg-[#498FC7] text-center py-5">
      <a href="https://www.flap.com.np" target="_blank" rel="noopener noreferrer" className="text-white text-xs sm:text-sm pb-2">
        Ⓒ {new Date().getFullYear()} FLAP Card - ALL RIGHTS RESERVED
      </a>
      <div className="flex justify-center items-center gap-3 text-white text-sm sm:text-base">
        <a href="https://www.facebook.com/justtflap" target="_blank" rel="noopener noreferrer" className="transform transition-colors duration-300 hover:text-[#1c73ba] hover:scale-150">
          <FacebookFilled className="cursor-pointer" />
        </a>
        <a href="https://www.instagram.com/flap.card/" target="_blank" rel="noopener noreferrer" className="transform transition-colors duration-300 hover:text-[#1c73ba] hover:scale-150">
          <InstagramFilled className="cursor-pointer" />
        </a>
        <a href="https://www.linkedin.com/company/flapcard/" target="_blank" rel="noopener noreferrer" className="transform transition-colors duration-300 hover:text-[#1c73ba] hover:scale-150">
          <LinkedinFilled className="cursor-pointer" />
        </a>
      </div>
    </div>
  );
}

export default Footer;
