import React from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AISearchBar from "@/components/AISearchBar";
import TrendingSection from "@/components/TrendingSection";
import ArtistCollaborationSection from "@/components/ArtistCollaborationSection";
import SustainabilityIndicator from "@/components/SustainabilityIndicator";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header with transparent background for hero section */}
      <Header transparent={true} />

      {/* Hero Section with runway video and featured products */}
      <HeroSection />

      {/* AI-Powered Search Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Discover Your Style</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Our AI understands natural language and your unique preferences to
            find exactly what you're looking for.
          </p>
          <AISearchBar className="max-w-2xl mx-auto" />
        </div>
      </section>

      {/* Personalized Trending Section */}
      <TrendingSection
        title="Trending For You"
        subtitle="Curated based on your style preferences and browsing history"
      />

      {/* Artist Collaboration Showcase */}
      <ArtistCollaborationSection />

      {/* Sustainability Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              Our Sustainability Commitment
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every product features transparent sustainability metrics, helping
              you make informed choices for the planet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="mb-4">
                <SustainabilityIndicator level="high" size="lg" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Highly Sustainable</h3>
              <p className="text-gray-600">
                Products that exceed our rigorous environmental and ethical
                standards, with minimal ecological impact.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="mb-4">
                <SustainabilityIndicator level="medium" size="lg" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Moderately Sustainable
              </h3>
              <p className="text-gray-600">
                Items that meet industry sustainability standards with ongoing
                improvements in production methods.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="mb-4">
                <SustainabilityIndicator level="low" size="lg" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Low Sustainability</h3>
              <p className="text-gray-600">
                Products we're actively working to improve, with transparent
                reporting on environmental impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter and CTA Section */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join the Future of Fashion
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Subscribe for personalized AI style recommendations and exclusive
            early access to new collections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="px-4 py-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white/50 flex-grow"
            />
            <button className="px-6 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
