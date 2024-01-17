import Designs from "../ui/Designs";
import Navbar from "../ui/Navbar";
import Main from "../ui/Main";
import About from "../ui/About";
import CustomDesignQuery from "../ui/CustomDesignQuery";
import Footer from "../ui/Footer";

import CheckUserLoggedStatus from "../utilities/CheckUserLoggedStatus";

function Landing() {
  return (
    <>
      <CheckUserLoggedStatus />
      <Navbar />
      <Main />
      <main className="max-w-[1152px] mx-auto px-5">
        <About />
        <Designs />
        <CustomDesignQuery />
        <div className="py-12">
          <h2 className="text-[clamp(1.1rem,2.8vw+1rem,2.2rem)] text-center font-semibold pb-9 text-[#232946]">How does Flap <span className="text-[#143385]">Works?</span></h2>
          <iframe src="https://www.youtube.com/embed/5M69IbgJG90?autoplay=1&mute=" width="100%" className="w-full h-[65vw] lg:h-[570px]"></iframe>
        </div>
      </main>
      <Footer/>
    </>
  );
}

export default Landing;