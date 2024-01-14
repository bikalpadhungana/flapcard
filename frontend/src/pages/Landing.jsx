import Designs from "../ui/Designs";
import Navbar from "../ui/Navbar";
import Main from "../ui/Main";
import About from "../ui/About";
import CustomDesignForm from "../ui/CustomDesignForm";
import Footer from "../ui/Footer";

function Landing() {
  return (
    <>
      <Navbar />
      <Main />
      <main className="max-w-[1152px] mx-auto px-5">
        <About />
        <Designs />
        <CustomDesignForm />
        <div className="py-12">
          <h2 className="text-[clamp(1.1rem,2.8vw+1rem,2.2rem)] text-center font-semibold pb-9 text-[#232946]">How does Flap <span className="text-[#143385]">Works?</span></h2>
          <iframe src="https://drive.google.com/file/d/1xiweyUPX467vriZkIMYNQaQaKUt5hquk/view?usp=drive_link" width="100%" className="w-full h-[65vw] lg:h-[570px]"></iframe>
        </div>


      </main>
      <Footer/>
    </>
  );
}

export default Landing;