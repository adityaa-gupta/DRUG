import Head from "next/head";
import Link from "next/link";
import { FaShieldAlt, FaGlobe, FaLock } from "react-icons/fa";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-20">
        <div className="absolute inset-0 bg-opacity-50 flex justify-center items-center">
          <img
            src="/hero.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative container mx-auto px-6">
          <h1 className="text-5xl font-extrabold mb-4">
            Report Drug Trafficking Anonymously
          </h1>
          <p className="text-xl mb-6">
            Join the fight against drug trafficking. Report anonymously and help
            make a difference.
          </p>
          <Link
            href="#submit"
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition"
          >
            Submit a Report
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="container mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              "Fill out the anonymous form.",
              "Upload evidence such as screenshots.",
              "Submit securely and anonymously.",
            ].map((step, index) => (
              <div
                key={index}
                className="bg-white p-8 shadow-lg rounded-xl flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-blue-600 text-white flex items-center justify-center rounded-full text-2xl font-bold mb-4">
                  {index + 1}
                </div>
                <p className="text-lg font-semibold">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-10">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: <FaShieldAlt />,
                title: "Anonymous Reporting",
                desc: "Your identity remains secure and private.",
              },
              {
                icon: <FaGlobe />,
                title: "Multilingual Support",
                desc: "Report in your preferred language.",
              },
              {
                icon: <FaLock />,
                title: "Secure Platform",
                desc: "We use encryption to protect your data.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-100 p-8 shadow-lg rounded-xl flex flex-col items-center"
              >
                <div className="text-blue-600 text-4xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section
        id="cta"
        className="py-16 bg-blue-700 text-white text-center relative"
      >
        <div className="absolute inset-0 flex justify-center items-center">
          <img
            src="https://images.unsplash.com/flagged/photo-1558963675-94dc9c4a66a9?q=80&w=1372&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="CTA Background"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4">Ready to Report?</h2>
          <p className="text-lg mb-6">
            Take a stand against drug trafficking today.
          </p>
          <Link
            href="/report"
            className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition"
          >
            Submit a Report
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 text-center">
        <div className="container mx-auto">
          <p>
            &copy; {new Date().getFullYear()} Drug Traffic Reporting System. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
