"use client";

import React from "react";
import Image from "next/image";

const successStories = [
  {
    title: "Anonymous Tip Leads to Major Drug Bust",
    description:
      "An anonymous report about suspicious activity at a warehouse led to a major drug bust. Law enforcement seized over 500 kilograms of illegal substances and arrested multiple suspects.",
    image:
      "https://images.unsplash.com/photo-1620065692460-d8e110a47ffb?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "November 20, 2024",
  },
  {
    title: "Illegal Trafficking Ring Dismantled",
    description:
      "A report about frequent late-night deliveries to a residential area helped authorities uncover a trafficking ring operating across the city.",
    image:
      "https://images.unsplash.com/photo-1624969862644-791f3dc98927?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "October 15, 2024",
  },
  {
    title: "School Drug Supply Stopped",
    description:
      "Thanks to a detailed report, law enforcement intercepted a drug supplier targeting local schools, ensuring a safer environment for students.",
    image:
      "https://plus.unsplash.com/premium_photo-1664299872241-79cb6af9d981?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "September 5, 2024",
  },
  {
    title: "Dark Web Dealer Arrested",
    description:
      "A community member's report about suspicious online activities led authorities to identify and arrest a drug dealer operating on the dark web.",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "August 10, 2024",
  },
];

const SuccessStories = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 text-gray-900">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-12 text-center shadow-lg">
        <h1 className="text-5xl font-extrabold tracking-wide">
          Success Stories
        </h1>
        <p className="text-lg mt-2 font-medium opacity-90">
          Celebrating the impact of community efforts in making the world a
          safer place.
        </p>
      </header>

      {/* Content Section */}
      <main className="container mx-auto px-6 py-16">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {successStories.map((story, index) => (
            <div
              key={index}
              className="bg-white shadow-xl rounded-2xl overflow-hidden transition-transform transform hover:scale-[1.05] hover:shadow-2xl duration-300 group relative"
            >
              <div className="relative">
                <img
                  src={story.image}
                  alt={story.title}
                  width={400}
                  height={300}
                  className="w-full h-60 object-cover rounded-t-2xl"
                />
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="p-6 relative">
                <h3 className="text-2xl font-bold text-gray-800">
                  {story.title}
                </h3>
                <p className="text-gray-500 text-sm mb-3">{story.date}</p>
                <p className="text-gray-700">{story.description}</p>
                {/* Subtle Floating Effect */}
                <div className="absolute -top-2 -left-2 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full opacity-80 shadow-md">
                  Featured
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default SuccessStories;
