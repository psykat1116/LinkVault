import CTA from "@/components/home/CTA";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/home/Hero";
import Feature from "@/components/home/Feature";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Feature />
      <CTA />
      <Footer />
    </>
  );
};

export default Home;
