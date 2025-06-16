import React from "react";
import HeroSection from "./HeroSection";
import Features from "./Features";
import Footer from "./Footer";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
