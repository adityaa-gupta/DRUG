"use client";
import React, { useState } from "react";
import { 
  FaCalendarAlt, 
  FaChevronRight, 
  FaSearch, 
  FaTrophy, 
  FaHandshake, 
  FaShieldAlt,
  FaNewspaper,
  FaShare
} from "react-icons/fa";

const successStories = [
  {
    title: "Anonymous Tip Leads to Major Drug Bust",
    description: "An anonymous report about suspicious activity at a warehouse led to a major drug bust. Law enforcement seized over 500 kilograms of illegal substances and arrested multiple suspects.",
    image: "https://images.unsplash.com/photo-1620065692460-d8e110a47ffb?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "November 20, 2024",
    category: "Major Bust",
    impact: "500kg seized",
    location: "Metropolitan Area"
  },
  {
    title: "Illegal Trafficking Ring Dismantled",
    description: "A report about frequent late-night deliveries to a residential area helped authorities uncover a trafficking ring operating across the city.",
    image: "https://images.unsplash.com/photo-1624969862644-791f3dc98927?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "October 15, 2024",
    category: "Network Disruption",
    impact: "12 arrests",
    location: "Urban District"
  },
  {
    title: "School Drug Supply Stopped",
    description: "Thanks to a detailed report, law enforcement intercepted a drug supplier targeting local schools, ensuring a safer environment for students.",
    image: "https://plus.unsplash.com/premium_photo-1664299872241-79cb6af9981?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "September 5, 2024",
    category: "Community Safety",
    impact: "Schools protected",
    location: "Educational Zone"
  },
  {
    title: "Dark Web Dealer Arrested",
    description: "A community member's report about suspicious online activities led authorities to identify and arrest a drug dealer operating on the dark web.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "August 10, 2024",
    category: "Cyber Crime",
    impact: "Online network shutdown",
    location: "Cyber Division"
  },
];

const impactStats = [
  { number: "2.5M", label: "Worth of Drugs Seized", icon: FaTrophy },
  { number: "150+", label: "Successful Operations", icon: FaHandshake },
  { number: "1000+", label: "Lives Impacted", icon: FaShieldAlt },
];

const SuccessStories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredStories = successStories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || story.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-40"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Making Communities Safer
              <span className="block text-yellow-400 mt-2">One Report at a Time</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8">
              Discover how anonymous reports have helped law enforcement combat drug trafficking
            </p>
            
            {/* Impact Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {impactStats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 transform hover:scale-105 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-yellow-400 mb-4 mx-auto" />
                  <h3 className="text-3xl font-bold text-white mb-2">{stat.number}</h3>
                  <p className="text-gray-200">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-white shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search success stories..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-4">
              {["all", "Major Bust", "Network Disruption", "Community Safety", "Cyber Crime"].map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === "all" ? "All Categories" : category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <main className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStories.map((story, index) => (
            <article
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {story.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <FaCalendarAlt className="mr-2" />
                  {story.date}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {story.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {story.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      📍 {story.location}
                    </span>
                    <span className="text-sm font-medium text-blue-600">
                      {story.impact}
                    </span>
                  </div>
                  
                  <button className="text-blue-600 hover:text-blue-800 transition-colors">
                    <FaShare className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredStories.length === 0 && (
          <div className="text-center py-12">
            <FaNewspaper className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No stories found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SuccessStories;
