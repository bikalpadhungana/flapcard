import {
  FacebookFilled,
  InstagramFilled,
  LinkedinOutlined,
  LinkedinFilled,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className=" bg-[#1E1E1E] text-center py-5">
      <p className="text-gray-400 text-xs sm:text-sm pb-2">
        {" "}
        Ⓒ{new Date().getFullYear()} FLAP - ALL RIGHTS ARE RESERVED
      </p>
      <div className="flex justify-center items-center gap-3 text-gray-400 text-sm sm:text-base">
        <Link to="https://www.facebook.com/esainnovation">
          <FacebookFilled className="cursor-pointer" />
        </Link>
        <Link to="https://www.instagram.com/esainnovation/">
          <InstagramFilled className="cursor-pointer" />
        </Link>
        <LinkedinFilled />
      </div>
    </div>
  );
}

export default Footer;