import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Recycle, Users, Heart, ShoppingBag, MessageCircle } from 'lucide-react';

export function HomePage() {
  const features = [
    {
      icon: BookOpen,
      title: 'Textbooks & Academic Materials',
      description: 'Find affordable textbooks and course materials from fellow students'
    },
    {
      icon: ShoppingBag,
      title: 'Electronics & Dorm Essentials',
      description: 'Get electronics, furniture, and everything you need for dorm life'
    },
    {
      icon: MessageCircle,
      title: 'Direct Communication',
      description: 'Chat directly with other students to arrange exchanges and pickups'
    },
    {
      icon: Recycle,
      title: 'Sustainable Exchange',
      description: 'Reduce waste and save money through item sharing and reuse'
    },
    {
      icon: Users,
      title: 'Campus Community',
      description: 'Connect with students from your university in a safe environment'
    },
    {
      icon: Heart,
      title: 'Free & Donation Items',
      description: 'Give away items you no longer need or find free items from others'
    }
  ];

  const stats = [
    { number: '1,000+', label: 'Active Students' },
    { number: '5,000+', label: 'Items Exchanged' },
    { number: '15+', label: 'Campus Locations' },
    { number: '98%', label: 'Satisfaction Rate' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Exchange, Share, Save
              <span className="block text-blue-200">with UniSwap</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
              The university marketplace where students exchange textbooks, electronics, 
              and dorm essentials. Build connections while saving money sustainably.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/browse"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center space-x-2"
              >
                <span>Start Browsing</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/signup"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center space-x-2"
              >
                <span>Join Now</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for University Life
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              UniSwap makes it easy to find, share, and exchange items with your fellow students. 
              From textbooks to electronics, build a sustainable campus community.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Exchanging?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already saving money and reducing waste 
            through our sustainable exchange platform.
          </p>
          <Link
            to="/signup"
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center space-x-2"
          >
            <span>Get Started Now</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}