import React from "react";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Instagram, Facebook, Twitter, Youtube, Mail } from "lucide-react";

interface FooterProps {
  companyName?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
  };
  newsletterEnabled?: boolean;
}

const Footer = ({
  companyName = "Aetheria",
  socialLinks = {
    instagram: "#",
    facebook: "#",
    twitter: "#",
    youtube: "#",
  },
  newsletterEnabled = true,
}: FooterProps) => {
  return (
    <footer className="w-full bg-black text-white py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold tracking-wider">
            {companyName}
          </h3>
          <p className="text-gray-400 text-sm">
            Redefining luxury fashion with AI-powered personalization and
            sustainable practices.
          </p>
          <div className="flex space-x-4 pt-2">
            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                aria-label="Instagram"
                className="hover:text-gray-300 transition-colors"
              >
                <Instagram size={20} />
              </a>
            )}
            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                aria-label="Facebook"
                className="hover:text-gray-300 transition-colors"
              >
                <Facebook size={20} />
              </a>
            )}
            {socialLinks.twitter && (
              <a
                href={socialLinks.twitter}
                aria-label="Twitter"
                className="hover:text-gray-300 transition-colors"
              >
                <Twitter size={20} />
              </a>
            )}
            {socialLinks.youtube && (
              <a
                href={socialLinks.youtube}
                aria-label="YouTube"
                className="hover:text-gray-300 transition-colors"
              >
                <Youtube size={20} />
              </a>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-medium">Shop</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                New Arrivals
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Collections
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Trending Now
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Sustainability
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Artist Collaborations
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-medium">About</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Our Story
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Sustainability Commitment
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                AI Technology
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Careers
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {newsletterEnabled && (
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Join Our Community</h4>
            <p className="text-gray-400 text-sm">
              Subscribe to receive personalized style recommendations and
              exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-gray-900 border-gray-700 text-white"
              />
              <Button className="bg-white text-black hover:bg-gray-200">
                <Mail className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-800 text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
        </div>
        <div className="flex space-x-6">
          <Link href="#" className="hover:text-gray-300 transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-gray-300 transition-colors">
            Terms of Service
          </Link>
          <Link href="#" className="hover:text-gray-300 transition-colors">
            Shipping & Returns
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
