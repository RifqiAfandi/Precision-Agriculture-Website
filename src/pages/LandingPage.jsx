import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Cloud, Home, ArrowRight, Leaf, ChevronDown, ArrowUp } from "lucide-react";
import { Logo } from "@/components/common/Logo";

export function LandingPage() {
  const navigate = useNavigate();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const observerRef = useRef(null);

  const products = [
    {
      name: "Agriino",
      description: "Monitoring Klorofil & Nitrogen",
      icon: Leaf,
      features: [
        "SPAD Meter Low-cost",
        "Analisis Real-time",
        "Rekomendasi Pemupukan AI",
      ],
      color: "text-green-600 dark:text-emerald-400",
      bgColor: "bg-green-50 dark:bg-emerald-500/20",
    },
    {
      name: "Agriimeter",
      description: "Pengukur DBH Pohon",
      icon: Cloud,
      features: [
        "Monitoring DBH Real-time",
        "Prediksi Pertumbuhan",
        "Analisis Biomassa",
      ],
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-500/20",
    },
    {
      name: "Greenhouse Compax",
      description: "Monitoring Rumah Kaca",
      icon: Home,
      features: [
        "Kontrol Otomatis",
        "Monitoring CO₂",
        "Sistem Ventilasi Pintar",
      ],
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-500/20",
    },
  ];

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";

    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Intersection Observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    // Observe sections
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => {
      if (observerRef.current) {
        observerRef.current.observe(section);
      }
    });

    return () => {
      document.documentElement.style.scrollBehavior = "";
      window.removeEventListener("scroll", handleScroll);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-slate-800 relative scroll-smooth">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/75 dark:bg-slate-900/75 backdrop-blur-md border-b border-green-100 dark:border-slate-700">
        <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4">
          <Logo size="lg" variant="default" textClassName="black" />
          <div className="flex gap-2 sm:gap-4">
            <Button
              className="px-3 py-2 sm:px-5 sm:py-4 text-sm sm:text-md border-2 border-green-500 dark:border-emerald-600 text-green-700 dark:text-emerald-400 hover:bg-green-600 hover:text-white hover:border-green-600 dark:hover:bg-emerald-600 dark:hover:text-white dark:hover:border-emerald-600 transition-all duration-300"
              variant="outline"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              className="px-3 py-2 sm:px-5 sm:py-4 text-sm sm:text-md bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 dark:from-emerald-600 dark:to-emerald-700 dark:hover:from-emerald-700 dark:hover:to-emerald-800"
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex flex-col justify-center items-center relative px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 md:mb-6 leading-tight animate-fade-in px-2">
              Precision Agriculture Platform
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 md:mb-6 leading-relaxed font-medium animate-fade-in-delay-1 px-2">
              Smart Farming Made Simple
            </p>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-delay-2 px-4">
              AI-powered IoT agricultural monitoring platform that helps modern
              farmers optimize crop yields with advanced sensor technology
              and real-time data analysis.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center animate-fade-in-delay-3 px-4 max-w-lg sm:max-w-none mx-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto px-6 py-4 sm:px-8 sm:py-6 text-base sm:text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 dark:from-emerald-600 dark:to-emerald-700 dark:hover:from-emerald-700 dark:hover:to-emerald-800 shadow-lg hover:shadow-xl transition-all duration-300 min-h-[48px] active:scale-95"
                onClick={() => navigate("/register")}
              >
                Get Started
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-6 py-4 sm:px-8 sm:py-6 text-base sm:text-lg border-2 border-green-500 dark:border-emerald-600 text-green-700 dark:text-emerald-400 hover:bg-green-600 hover:text-white hover:border-green-600 dark:hover:bg-emerald-600 dark:hover:text-white dark:hover:border-emerald-600 shadow hover:shadow-lg transition-all duration-300 min-h-[48px] active:scale-95"
                onClick={() => scrollToSection("solutions")}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="hidden md:block absolute top-20 left-10 w-20 h-20 bg-green-100 dark:bg-emerald-900/30 rounded-full animate-float opacity-60"></div>
          <div
            className="hidden md:block absolute top-40 right-20 w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full animate-float opacity-60"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="hidden md:block absolute bottom-40 left-20 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full animate-float opacity-60"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={() => scrollToSection("solutions")}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/80 rounded-full p-3 transition-all duration-300 shadow-md"
          aria-label="Scroll to next section"
        >
          <ChevronDown className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>
      </section>

      {/* Solutions Section */}
      <section 
        id="solutions" 
        className={`min-h-screen flex flex-col justify-center items-center relative px-4 sm:px-6 lg:px-8 py-20 bg-white dark:bg-slate-900 transition-all duration-1000 ${
          visibleSections.has("solutions") 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 transition-all duration-700 delay-100 ${
              visibleSections.has("solutions") 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-5"
            }`}>
              Leading Agricultural IoT Solutions
            </h2>
            <p className={`text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${
              visibleSections.has("solutions") 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-5"
            }`}>
              Premium products specially designed to help modern farmers
              increase productivity and efficiency through AI and
              IoT technology.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {products.map((product, index) => (
              <Card
                key={product.name}
                className={`hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 ${
                  visibleSections.has("solutions")
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ 
                  transitionDelay: visibleSections.has("solutions") ? `${300 + index * 150}ms` : "0ms"
                }}
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 mx-auto ${product.bgColor} rounded-2xl flex items-center justify-center mb-4 transition-transform hover:scale-110 duration-300`}
                  >
                    <product.icon className={`w-8 h-8 ${product.color}`} />
                  </div>
                  <CardTitle className="text-2xl text-gray-900 dark:text-gray-100 mb-2">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {product.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center space-x-3"
                      >
                        <div
                          className={`w-2 h-2 ${product.bgColor} rounded-full flex-shrink-0`}
                        ></div>
                        <span className="text-base text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={() => scrollToSection("cta")}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer bg-gray-100 dark:bg-slate-800/50 hover:bg-gray-200 dark:hover:bg-slate-700/80 rounded-full p-3 transition-all duration-300 shadow-md"
          aria-label="Scroll to next section"
        >
          <ChevronDown className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>
      </section>

      {/* Statistics Section */}
      <section 
        id="statistics" 
        className={`bg-gradient-to-r from-green-500 to-green-600 dark:from-emerald-600 dark:to-emerald-700 py-8 sm:py-12 md:py-16 mt-12 sm:mt-16 md:mt-20 transition-all duration-1000 ${
          visibleSections.has("statistics") 
            ? "opacity-100 scale-100" 
            : "opacity-0 scale-95"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 text-center text-white">
            <div className={`transition-all duration-700 delay-100 ${
              visibleSections.has("statistics") 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-5"
            }`}>
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-1 sm:mb-2">1000+</div>
              <div className="text-xs sm:text-sm md:text-base text-green-100 dark:text-emerald-100">Registered Farmers</div>
            </div>
            <div className={`transition-all duration-700 delay-200 ${
              visibleSections.has("statistics") 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-5"
            }`}>
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-1 sm:mb-2">5000+</div>
              <div className="text-xs sm:text-sm md:text-base text-green-100 dark:text-emerald-100">Active Devices</div>
            </div>
            <div className={`transition-all duration-700 delay-300 ${
              visibleSections.has("statistics") 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-5"
            }`}>
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-1 sm:mb-2">25%</div>
              <div className="text-xs sm:text-sm md:text-base text-green-100 dark:text-emerald-100">Harvest Yield Increase</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        id="cta" 
        className={`min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-slate-800 relative transition-all duration-1000 ${
          visibleSections.has("cta") 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto max-w-4xl text-center">
          <div className={`bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 sm:p-12 lg:p-16 border border-gray-100 dark:border-slate-700 transition-all duration-700 delay-200 ${
            visibleSections.has("cta") 
              ? "opacity-100 scale-100" 
              : "opacity-0 scale-95"
          }`}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Ready to Start the Digital Farming Revolution?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
              Join thousands of farmers who have experienced the benefits
              of AI technology for modern agriculture.
            </p>
            <Button
              size="lg"
              className="px-10 py-6 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 dark:from-emerald-600 dark:to-emerald-700 dark:hover:from-emerald-700 dark:hover:to-emerald-800 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => navigate("/register")}
            >
              Start Free Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-100 dark:bg-emerald-900/30 rounded-full opacity-50 blur-2xl"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-100 dark:bg-blue-900/30 rounded-full opacity-50 blur-2xl"></div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10 mb-8 sm:mb-12">
            <div className="col-span-2 md:col-span-1">
              <Logo size="md" variant="white" className="mb-3 sm:mb-4" />
              <p className="text-xs sm:text-sm md:text-base text-gray-400 leading-relaxed">
                Leading agricultural IoT platform for modern Indonesian farmers.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base md:text-lg">Products</h4>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm md:text-base text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">Agriino</li>
                <li className="hover:text-white transition-colors cursor-pointer">Agriimeter</li>
                <li className="hover:text-white transition-colors cursor-pointer">Greenhouse Compax</li>
                <li className="hover:text-white transition-colors cursor-pointer">SkyVera</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base md:text-lg">Company</h4>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm md:text-base text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">About Us</li>
                <li className="hover:text-white transition-colors cursor-pointer">Contact</li>
                <li className="hover:text-white transition-colors cursor-pointer">Careers</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base md:text-lg">Contact</h4>
              <div className="text-xs sm:text-sm md:text-base text-gray-400 space-y-2 sm:space-y-3">
                <p>PT Precision Agriculture Indonesia</p>
                <p>Jakarta, Indonesia</p>
                <p className="hover:text-white transition-colors cursor-pointer">info@agriiweb.com</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-400">
            <p>
              &copy; 2024 PT Precision Agriculture Indonesia. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-green-600 hover:bg-green-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 animate-fade-in"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
