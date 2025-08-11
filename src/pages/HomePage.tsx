import React from "react";
import studentsImg from "../assets/studentsexchange.jpeg";
import logo from "../assets/logo.jpg"; // Imported the logo
import d1 from "../assets/demohomepage.jpg"; // Imported the first demo image
import d2 from "../assets/demohomepage2.jpg"; // Imported the second demo image
import d3 from "../assets/demohomepage3.png"; // Imported the third demo image
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Recycle,
  Users,
  Heart,
  ShoppingBag,
  MessageCircle,
  Star,
  Quote,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

// Changes:
// - Removed the footer entirely.
// - In navbar, replaced the logo img with large text "UniSwap" in bold, large font (text-4xl), well-placed.
// - Changed "Rate & Repeat" to "Rate & Exchange" and updated description to mention tuition exchange: "Build trust while exchanging tuition materials and more."
// - In testimonials, added professional avatar images (using placeholder URLs for demonstration; in real app, use actual images). Made them rounded, with shadow for premium feel.

export function HomePage() {
  const features = [
    {
      icon: BookOpen,
      title: "Textbooks & Academic Materials",
      description:
        "Find affordable textbooks and course materials from fellow students",
    },
    {
      icon: ShoppingBag,
      title: "Electronics & Dorm Essentials",
      description:
        "Get electronics, furniture, and everything you need for dorm life",
    },
    {
      icon: MessageCircle,
      title: "Direct Communication",
      description:
        "Chat directly with other students to arrange exchanges and pickups",
    },
    {
      icon: Recycle,
      title: "Sustainable Exchange",
      description: "Reduce waste and save money through item sharing and reuse",
    },
    {
      icon: Users,
      title: "Campus Community",
      description:
        "Connect with students from your university in a safe environment",
    },
    {
      icon: Heart,
      title: "Free & Donation Items",
      description:
        "Give away items you no longer need or find free items from others",
    },
  ];

  const stats = [
    { number: "500+", label: "Active Students" },
    { number: "1,000+", label: "Items Exchanged" },
    { number: "15+", label: "Campus Locations" },
    { number: "98%", label: "Satisfaction Rate" },
  ];

  const testimonials = [
    {
      name: "Al Amin Mozumder",
      role: "CSE Student",
      content:
        "UniSwap saved me hundreds on textbooks. The community is amazing!",
      rating: 5,
      avatar: d2,
    },
    {
      name: "Shrabonti Sarkar",
      role: "Architecture Student",
      content:
        "Found the perfect hall setup without breaking the bank. Highly recommend!",
      rating: 5,
      avatar: d1,
    },
    {
      name: "Sarowar Islam",
      role: "Assistant Professor, ME",
      content: "Easy to use and great for sustainability.",
      rating: 4,
      avatar: d3,
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Sign Up",
      description: "Create your free account in seconds",
      icon: Users,
    },
    {
      step: 2,
      title: "Browse Items",
      description: "Find what you need from local students",
      icon: ShoppingBag,
    },
    {
      step: 3,
      title: "Connect & Exchange",
      description: "Chat and arrange safe pickups",
      icon: MessageCircle,
    },
    {
      step: 4,
      title: "Rate & Exchange",
      description: "Build trust while exchanging tuition materials and more",
      icon: Star,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Premium Navbar - Sticky, with large "UniSwap" text in good font */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 max-w-7xl mx-auto bg-white/80 backdrop-blur-md shadow-md">
        <Link to="/">
          <div className="text-4xl font-extrabold text-blue-600 tracking-tight">
            UniSwap
          </div>
        </Link>
        <div className="flex items-center gap-8">
          <Link
            to="/browse"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Browse
          </Link>
          <Link
            to="/signup"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-full font-semibold shadow-md transition transform hover:scale-105"
          >
            Join Now
          </Link>
        </div>
      </nav>

      {/* Hero - Enhanced with larger image, better gradients, and animation */}
      <section className="relative overflow-hidden pt-20 pb-28">
        {/* Enhanced floating gradient blobs with animation */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400 rounded-full blur-3xl opacity-30 translate-x-1/3 translate-y-1/3 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 items-center gap-12 relative z-10">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-gray-900 animate-fade-in">
              Exchange, Share,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Save
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-lg">
              The premium student marketplace for textbooks, electronics, and
              dorm essentials. Build lasting connections while saving money and
              promoting sustainability.
            </p>
            <div className="flex gap-6">
              <Link
                to="/browse"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl transition transform hover:scale-105"
              >
                Start Browsing
              </Link>
              <Link
                to="/signup"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full font-semibold text-lg transition transform hover:scale-105"
              >
                Join Now
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src={studentsImg}
              alt="Students exchanging items"
              className="rounded-3xl shadow-2xl border border-gray-200 transform hover:scale-105 transition duration-500"
            />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-100 rounded-full opacity-50 blur-xl"></div>
          </div>
        </div>
      </section>

      {/* Wave Divider */}
      <div className="wave-divider">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full h-32 text-gray-50"
        >
          <path
            fill="currentColor"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,128C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>
      </div>

      {/* Stats - Card-like with hover animations */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl hover:scale-105 transition duration-300"
            >
              <div className="text-4xl font-bold text-blue-600">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works - New section for premium feel */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Simple steps to start exchanging items on campus.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((step, i) => (
              <div key={i} className="text-center group">
                <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-6 group-hover:bg-blue-200 transition">
                  <step.icon className="h-10 w-10 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Enhanced cards with gradients */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">
              Everything You Need for University Life
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              UniSwap makes it easy to find, share, and exchange items with your
              fellow students.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-2xl hover:scale-105 transition duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-6 group-hover:bg-blue-200 group-hover:scale-110 transition">
                  <feature.icon className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - New section for social proof, with avatars */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">
              What Students Say
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from our community of satisfied users.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition"
              >
                <div className="flex justify-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full shadow-md object-cover"
                  />
                </div>
                <Quote className="h-8 w-8 text-blue-600 mb-4 opacity-50 mx-auto" />
                <p className="text-gray-600 mb-6 text-center">
                  {testimonial.content}
                </p>
                <div className="flex justify-center gap-1 mb-2">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star
                      key={j}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <div className="text-center font-semibold">
                  {testimonial.name}
                </div>
                <div className="text-center text-gray-500">
                  {testimonial.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Enhanced with email form */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-700 text-center text-white">
        <h2 className="text-5xl font-bold mb-6">Ready to Start Exchanging?</h2>
        <p className="text-xl text-blue-100 max-w-xl mx-auto mb-10">
          Join thousands of students already saving money and reducing waste.
        </p>
        <div className="max-w-md mx-auto flex gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none"
          />
          <Link
            to="/signup"
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition transform hover:scale-105"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Custom styles for animations and wave */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .wave-divider {
          margin-top: -1px;
          transform: rotate(180deg);
        }
        .wave-divider svg {
          display: block;
        }
      `}</style>
    </div>
  );
}
