import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ChatbotSection from "./components/ChatbotSection";
import Features from "./components/Features";
import UseCases from "./components/UseCases";
import WhyMatters from "./components/WhyMatters";
import About from "./components/About";
import HowItWorks from "./components/HowItWorks";
import FinalCTA from "./components/FinalCTA";
import SiteFooter from "./components/SiteFooter";
import ScrollToTop from "./components/ScrollToTop";
import "./index.css";

export default function App() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Navbar />
      <Hero />
      <ChatbotSection />
      <Features />
      <UseCases />
      <WhyMatters />
      <About />
      <HowItWorks />
      <FinalCTA />
      <SiteFooter />
      <ScrollToTop />
    </main>
  );
}