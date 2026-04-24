import Hero from "../Hero";
import LandingNav from "../LandingNav";
import Footer from "../Footer";
import Features from "../Features";
import Payments from "../Payments";
import CustomerLogos from "../CustomerLogos";

const Home = () => {
  return (
    <div className="bg-dark">
      <LandingNav />
      <Hero />
      <Features />
      <Payments />
      <CustomerLogos />
      <Footer />
    </div>
  );
};

export default Home;
