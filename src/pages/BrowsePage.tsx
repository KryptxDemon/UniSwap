import { Link } from "react-router-dom";
import tuition from "../assets/hometutor.png";
import station from "../assets/stationery.png";
import bg from "../assets/background.jpeg";
import { motion } from "framer-motion";

export function BrowsePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div
        className="relative h-[60vh] flex items-center justify-center text-center text-white"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 dark:bg-opacity-60"></div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h1 className="text-5xl font-bold mb-4">Discover & Explore</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Whether you're looking for useful items or exciting tuition
            opportunities, we've got you covered.
          </p>
        </motion.div>
      </div>

      {/* Categories Section */}
      <div className="max-w-6xl mx-auto py-12 px-6 grid md:grid-cols-2 gap-8">
        {/* Items Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Link to="/browse/items">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
              <img
                src={station}
                alt="Items"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2 dark:text-gray-100">
                  Browse Items
                </h2>
                <p className="text-gray-600 dark:text-gray-200">
                  Find and exchange electronics, books, accessories, and more,
                  all in one place.
                </p>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Tuitions Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Link to="/browse/tuitions">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
              <img src={tuition} className="w-full h-56 object-cover" />
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2 dark:text-gray-100">
                  Browse Tuitions
                </h2>
                <p className="text-gray-600 dark:text-gray-200">
                  Explore available tuition opportunities and exchange according
                  to your preference.
                </p>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
