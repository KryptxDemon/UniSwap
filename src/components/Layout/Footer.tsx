import React from "react";
import { Heart, Facebook, Instagram, MapPin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-dark-teal text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-pine-green p-2 rounded-lg">
                <img
                  src="https://i.ibb.co/6JTtvsjh/uniswaplogo.png"
                  alt="UniSwap Logo"
                  className="h-6 w-6"
                />
              </div>
              <span className="text-2xl font-bold">UniSwap</span>
            </Link>
            <p className="text-gray-400 max-w-md mb-6">
              Connecting university students through sustainable item exchange.
              Share, swap, and save while building a more sustainable campus
              community.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/browse"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Browse Items
                </Link>
              </li>
              <li>
                <Link
                  to="/browse-tuitions"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Find Tuitions
                </Link>
              </li>
              <li>
                <Link
                  to="/post-item"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Post Item
                </Link>
              </li>
              <li>
                <Link
                  to="/post-tuition"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Offer Tuition
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-gray-400" />
                <a
                  href="mailto:contact@uniswap.com"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  contact@uniswap.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400">Chattogram, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-gray-400 mb-4 sm:mb-0">
            © {new Date().getFullYear()} UniSwap. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
