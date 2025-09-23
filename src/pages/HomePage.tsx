import { useState, useEffect } from "react";
import logoImg from "../assets/logo.png";
import { Link } from "react-router-dom";
import {
  Users,
  ShoppingBag,
  MessageCircle,
  Star,
  Quote,
  Moon,
  Sun,
} from "lucide-react";
import { itemAPI } from "../services/apiService";
import { useTheme } from "../hooks/useTheme";

export default function HomePage() {
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        const allItems = await itemAPI.getAllItems();
        // Get the 6 most recent items
        const sortedItems = allItems
          .sort(
            (a: any, b: any) =>
              new Date(b.postDate || b.post?.postTime || 0).getTime() -
              new Date(a.postDate || a.post?.postTime || 0).getTime()
          )
          .slice(0, 6);
        setRecentItems(sortedItems);
      } catch (error) {
        console.error("Error fetching recent items:", error);
        // Fallback to demo data if API fails
        setRecentItems(sampleItems);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentItems();
  }, []);

  const sampleItems = [
    {
      id: 1,
      image:
        "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
      title: "Discrete by Rosen Textbook",
      subtitle: "Used, like new",
      tags: ["Textbook", "Exchange"],
      exchange: "Exchange",
    },
    {
      id: 2,
      image:
        "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
      title: "Compact Desk Lamp",
      subtitle: "Perfect for late night study sessions",
      tags: ["Dorm", "Gadget"],
      exchange: "Swap",
    },
    {
      id: 3,
      image:
        "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
      title: "Hall Bedside Organizer",
      subtitle: "Great condition",
      tags: ["Furniture", "Pickup"],
      exchange: "Giveaway",
    },
    {
      id: 4,
      image:
        "https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
      title: "Course Notes Bundle",
      subtitle: "Compiled over a semester",
      tags: ["Notes", "Exchange"],
      exchange: "Exchange",
    },
    {
      id: 5,
      image:
        "https://images.pexels.com/photos/704767/pexels-photo-704767.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
      title: "Scientific Calculator",
      subtitle: "TI-84 Plus, great condition",
      tags: ["Gadget", "Equipment"],
      exchange: "Swap",
    },
    {
      id: 6,
      image:
        "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
      title: "Stationery Bundle",
      subtitle: "Pens, notebooks, and more",
      tags: ["Supplies", "Bundle"],
      exchange: "Giveaway",
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
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
    },
    {
      name: "Shrabonti Sarkar",
      role: "Architecture Student",
      content:
        "Found the perfect hall setup without breaking the bank. Highly recommend!",
      rating: 5,
      avatar:
        "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
    },
    {
      name: "Sarowar Islam",
      role: "Assistant Professor, ME",
      content: "Easy to use and great for sustainability.",
      rating: 4,
      avatar:
        "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
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
      title: "Connect",
      description: "Chat and arrange safe pickups",
      icon: MessageCircle,
    },
    {
      step: 4,
      title: "Exchange",
      description: "Build trust while exchanging tuition and more",
      icon: Star,
    },
  ];

  // Function to map API item to display format
  const mapItemToDisplay = (item: any) => ({
    id: item.itemId,
    image:
      item.images && item.images.length > 0
        ? item.images[0]
        : "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
    title: item.itemName || "Unknown Item",
    subtitle: item.description || "No description",
    tags: [item.category?.categoryName || "General", item.itemType || "Item"],
    exchange: item.itemType || "Exchange",
  });

  const displayItems = loading
    ? sampleItems
    : recentItems.length > 0
    ? recentItems.map(mapItemToDisplay)
    : sampleItems;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 max-w-7xl mx-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-700 transition-colors">
        <Link to="/">
          <div className="flex items-center gap-4">
            <div className="p-1 rounded-full bg-gradient-to-r from-pine-green to-dark-teal shadow-lg transform hover:scale-105 transition">
              <img
                src={logoImg}
                alt="UniSwap logo"
                className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
              />
            </div>
            <div className="text-4xl font-extrabold text-pine-green dark:text-bright-cyan tracking-tight">
              UniSwap
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-8">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="text-gray-700 dark:text-gray-300 hover:text-pine-green dark:hover:text-bright-cyan p-2 rounded-md transition-colors"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          <Link
            to="/browse"
            className="text-gray-700 dark:text-gray-300 hover:text-pine-green dark:hover:text-bright-cyan font-medium transition-colors"
          >
            Browse
          </Link>
          <Link
            to="/login"
            className="text-gray-700 dark:text-gray-300 hover:text-pine-green dark:hover:text-bright-cyan font-medium transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="bg-gradient-to-r from-pine-green to-dark-teal hover:from-dark-teal hover:to-pine-green text-white px-6 py-3 rounded-full font-semibold shadow-md transition transform hover:scale-105"
          >
            Join Now
          </Link>
        </div>
      </nav>

      <section className="relative overflow-hidden pt-20 pb-28">
        <div className="absolute top-0 left-0 w-96 h-96 bg-pine-green/20 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-dark-teal/20 rounded-full blur-3xl opacity-30 translate-x-1/3 translate-y-1/3"></div>

        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 items-center gap-12 relative z-10">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-gray-900 dark:text-gray-100 animate-fade-in">
              Exchange, Share,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pine-green to-dark-teal">
                Save
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-200 max-w-lg">
              The premium student marketplace for textbooks, electronics, and
              dorm essentials. Build lasting connections while saving money and
              promoting sustainability.
            </p>
            <div className="flex gap-6">
              <Link
                to="/browse"
                className="bg-gradient-to-r from-pine-green to-dark-teal hover:from-dark-teal hover:to-pine-green text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl transition transform hover:scale-105"
              >
                Start Browsing
              </Link>
              <Link
                to="/signup"
                className="border-2 border-pine-green text-pine-green dark:border-bright-cyan dark:text-bright-cyan hover:bg-pine-green hover:text-white dark:hover:bg-bright-cyan dark:hover:text-gray-900 px-8 py-4 rounded-full font-semibold text-lg transition transform hover:scale-105"
              >
                Join Now
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=600&h=450"
              alt="Students exchanging items"
              className="rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-600 transform hover:scale-105 transition duration-500"
              loading="lazy"
            />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-pine-green/30 rounded-full opacity-50 blur-xl"></div>
            <div className="absolute -top-6 left-0 p-2 rounded-full bg-gradient-to-r from-pine-green to-bright-cyan shadow-lg -translate-x-6">
              <img
                src={logoImg}
                alt="logo badge"
                className="w-16 h-16 rounded-full border-2 border-white shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="wave-divider">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full h-32 text-gray-50 dark:text-gray-800"
        >
          <path
            fill="currentColor"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,128C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>
      </div>

      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-white to-pine-green/10 dark:from-gray-700 dark:to-bright-cyan/10 rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl hover:scale-105 transition duration-300"
            >
              <div className="text-4xl font-bold text-pine-green dark:text-bright-cyan">
                {stat.number}
              </div>
              <div className="text-gray-600 dark:text-gray-200 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-700 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-200 max-w-2xl mx-auto">
              Simple steps to start exchanging items on campus.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((step, i) => (
              <div key={i} className="text-center group">
                <div className="w-20 h-20 mx-auto rounded-full bg-powder-blue dark:bg-powder-blue/70 flex items-center justify-center mb-6 group-hover:bg-bright-cyan/30 transition">
                  <step.icon className="h-10 w-10 text-pine-green dark:text-dark-teal" />
                </div>
                <div className="text-2xl font-bold text-pine-green dark:text-bright-cyan mb-2">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2 dark:text-gray-200">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-200">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              Sample Exchanges
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-200 max-w-2xl mx-auto">
              A curated showcase to inspire your next swap. Hover to pause
              animations and explore each item.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-16 top-8 w-48 h-48 bg-gradient-to-br from-pine-green/20 to-dark-teal/20 rounded-full blur-2xl opacity-40 animate-float"></div>
            <div
              className="absolute -right-16 bottom-16 w-56 h-56 bg-gradient-to-br from-powder-blue to-pine-green/30 rounded-full blur-2xl opacity-30 animate-float"
              style={{ animationDelay: "0.6s" }}
            ></div>

            <div className="overflow-hidden">
              <div
                className="marquee flex items-stretch gap-6 py-6"
                onMouseEnter={() => {}}
              >
                {[...displayItems, ...displayItems].map((item, idx) => (
                  <div
                    key={idx}
                    className="min-w-[280px] bg-white dark:bg-gray-700 rounded-2xl shadow-lg overflow-hidden transform transition hover:scale-105 group"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transform transition duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 bg-pine-green dark:bg-bright-cyan text-white dark:text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                        {item.tags[0]}
                      </div>
                      <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full text-sm shadow">
                        {item.exchange}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="font-semibold text-lg dark:text-gray-200">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {item.subtitle}
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <button className="px-4 py-2 bg-gradient-to-r from-pine-green to-dark-teal text-white rounded-full text-sm font-semibold">
                          Request
                        </button>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {item.tags.join(" ")}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-4">
              <Link
                to="/browse"
                className="px-6 py-3 bg-pine-green text-white hover:bg-dark-teal dark:bg-bright-cyan dark:text-gray-900 dark:hover:bg-powder-blue rounded-full font-semibold transition"
              >
                See more exchanges
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-700">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              What Students Say
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-200 max-w-2xl mx-auto">
              Hear from our community of satisfied users.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 hover:shadow-2xl transition"
              >
                <div className="flex justify-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full shadow-md object-cover"
                    loading="lazy"
                  />
                </div>
                <Quote className="h-8 w-8 text-pine-green dark:text-bright-cyan mb-4 opacity-50 mx-auto" />
                <p className="text-gray-600 dark:text-gray-200 mb-6 text-center">
                  {testimonial.content}
                </p>
                <div className="flex justify-center gap-1 mb-2">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star
                      key={j}
                      className="h-5 w-5 text-pine-green dark:text-bright-cyan fill-current"
                    />
                  ))}
                </div>
                <div className="text-center font-semibold dark:text-gray-200">
                  {testimonial.name}
                </div>
                <div className="text-center text-gray-500 dark:text-gray-400">
                  {testimonial.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-r from-dark-teal to-pine-green text-center text-white">
        <h2 className="text-5xl font-bold mb-6">Ready to Start Exchanging?</h2>
        <p className="text-xl text-powder-blue max-w-xl mx-auto mb-10">
          Join thousands of students already saving money and reducing waste.
        </p>
        <p className="text-lg text-powder-blue mb-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-white underline hover:text-powder-blue transition"
          >
            Log in
          </Link>
        </p>
        <div className="max-w-md mx-auto flex gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-6 py-4 rounded-full text-gray-900 dark:text-gray-100 dark:bg-gray-700 dark:placeholder-gray-300 focus:outline-none"
          />
          <Link
            to="/signup"
            className="bg-white text-pine-green hover:bg-powder-blue hover:text-dark-teal dark:bg-gray-200 dark:text-dark-teal dark:hover:bg-bright-cyan dark:hover:text-gray-900 px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition transform hover:scale-105"
          >
            Get Started
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .wave-divider { margin-top: -1px; transform: rotate(180deg); }
        .wave-divider svg { display: block; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .marquee { display: flex; animation: marquee 28s linear infinite; }
        .marquee:hover { animation-play-state: paused; }
        @keyframes float { 0% { transform: translateY(0); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        @keyframes pulseScale { 0% { transform: scale(1); } 50% { transform: scale(1.02); } 100% { transform: scale(1); } }
        .pulse-scale { animation: pulseScale 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
