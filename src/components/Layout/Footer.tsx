import React from 'react';
import { BookOpen, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">UniSwap</span>
            </div>
            <p className="text-gray-400 max-w-md">
              Connecting university students through sustainable item exchange. 
              Share, swap, and save while building a more sustainable campus community.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/browse" className="hover:text-white transition-colors">Browse Items</a></li>
              <li><a href="/post-item" className="hover:text-white transition-colors">Post Item</a></li>
              <li><a href="/messages" className="hover:text-white transition-colors">Messages</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Safety Guidelines</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex items-center justify-between">
          <p className="text-gray-400">© 2025 UniSwap. All rights reserved.</p>
          <div className="flex items-center space-x-1 text-gray-400">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>for students</span>
          </div>
        </div>
      </div>
    </footer>
  );
}