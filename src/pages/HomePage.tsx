import React from "react";
import studentsImg from "../assets/studentsexchange.jpeg";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Recycle,
  Users,
  Heart,
  ShoppingBag,
  MessageCircle,
} from "lucide-react";

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

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-blue-700">UniSwap</div>
        <div className="flex items-center gap-6">
          <Link
            to="/browse"
            className="text-gray-600 hover:text-gray-900 transition"
          >
            Browse
          </Link>
          <Link
            to="/signup"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-semibold transition"
          >
            Join Now
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Floating gradient blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400 rounded-full blur-3xl opacity-40 translate-x-1/3 translate-y-1/3"></div>

        <div className="max-w-7xl mx-auto px-8 py-28 grid md:grid-cols-2 items-center relative z-10">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900">
              Exchange, Share, <span className="text-blue-600">Save</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-lg">
              The student marketplace for textbooks, electronics, and dorm
              essentials. Build connections while saving money and reducing
              waste.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                to="/browse"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition"
              >
                Start Browsing
              </Link>
              <Link
                to="/signup"
                className="border border-gray-300 hover:border-gray-400 px-8 py-4 rounded-full font-semibold text-lg transition"
              >
                Join Now
              </Link>
            </div>
          </div>
          <div className="mt-12 md:mt-0">
            <img
              src={studentsImg}
              alt="Students exchanging items"
              className="rounded-3xl shadow-2xl border border-gray-200"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition"
            >
              <div className="text-3xl font-bold text-blue-600">
                {stat.number}
              </div>
              <div className="text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
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
                className="p-8 rounded-2xl bg-gray-50 hover:bg-white shadow-sm hover:shadow-md transition group"
              >
                <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <feature.icon className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-center text-white">
        <h2 className="text-4xl font-bold mb-4">Ready to Start Exchanging?</h2>
        <p className="text-lg text-blue-100 max-w-xl mx-auto mb-8">
          Join thousands of students already saving money and reducing waste.
        </p>
        <Link
          to="/signup"
          className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition"
        >
          Get Started Now
        </Link>
      </section>
    </div>
  );
}
