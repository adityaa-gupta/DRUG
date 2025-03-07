import Head from "next/head";
import Link from "next/link";
import { 
  FaShieldAlt, 
  FaGlobe, 
  FaLock, 
  FaAngleDown, 
  FaFileAlt, 
  FaHandsHelping,
  FaUserSecret
} from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Head>
        <title>Report Drug Trafficking Anonymously | DRUG Platform</title>
        <meta name="description" content="Make a difference by anonymously reporting drug trafficking activities. Our secure platform protects your identity while helping law enforcement." />
      </Head>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-opacity-50 flex justify-center items-center">
          <img
            src="/hero.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-20 scale-105"
          />
        </div>
        <div className="relative container mx-auto px-6 z-10 text-center md:text-left md:flex md:items-center md:justify-between">
          <div className="md:w-7/12 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight animate-fade-in">
              Report Drug Trafficking <span className="text-yellow-300">Anonymously</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100 max-w-2xl animate-fade-in-delay">
              Join the fight against drug trafficking. Your anonymous reports can help make communities safer and save lives.
            </p>
            <div className="animate-fade-in-delay-2">
              <Link
                href="/report"
                className="px-8 py-4 bg-yellow-500 text-blue-900 font-bold rounded-lg shadow-xl hover:bg-yellow-400 transition duration-300 transform hover:scale-105 inline-flex items-center mr-4"
              >
                Submit Report <FaFileAlt className="ml-2" />
              </Link>
              <Link
                href="#how-it-works"
                className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-800 transition duration-300 inline-flex items-center mt-4 md:mt-0"
              >
                Learn More <FaAngleDown className="ml-2" />
              </Link>
            </div>
          </div>
          <div className="md:w-5/12 hidden md:block animate-fade-in-slide">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20">
              <div className="text-center mb-6">
                <FaUserSecret className="text-6xl mx-auto text-yellow-400 mb-4" />
                <h3 className="text-2xl font-bold">100% Anonymous</h3>
                <p className="text-blue-100">Your identity is completely protected</p>
              </div>
              <div className="flex justify-center space-x-2">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse delay-100"></div>
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white/5 to-transparent"></div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-semibold tracking-wider">SIMPLE PROCESS</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">How It Works</h2>
            <p className="text-gray-600 text-lg">Our secure platform makes it easy to report drug trafficking while keeping your identity protected.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaFileAlt />,
                title: "Fill Out the Form",
                desc: "Provide details about what you've witnessed or know. Be as specific as possible.",
              },
              {
                icon: <FaHandsHelping />,
                title: "Upload Evidence",
                desc: "Securely attach screenshots, photos, or other relevant files to strengthen your report.",
              },
              {
                icon: <FaLock />,
                title: "Submit Anonymously",
                desc: "Your submission is encrypted and your identity is never revealed, even to our team.",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100 relative overflow-hidden group hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 bg-blue-600 text-white h-12 w-12 flex items-center justify-center rounded-bl-2xl font-bold text-lg">
                  {index + 1}
                </div>
                <div className="text-blue-600 text-4xl mb-6 bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition duration-300">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50 relative">
        <div className="absolute inset-0 bg-blue-900 opacity-5 pattern-dots"></div>
        <div className="container mx-auto px-6 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full text-sm font-semibold tracking-wider">WHY CHOOSE US</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">Platform Features</h2>
            <p className="text-gray-600 text-lg">Our specialized platform is designed with your security and privacy as the top priority.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaShieldAlt />,
                title: "Anonymous Reporting",
                desc: "Your identity remains completely confidential. We collect no personal data that could identify you.",
                color: "blue",
              },
              {
                icon: <FaGlobe />,
                title: "Multilingual Support",
                desc: "Report in your preferred language with our comprehensive language options for greater accessibility.",
                color: "indigo",
              },
              {
                icon: <FaLock />,
                title: "End-to-End Encryption",
                desc: "Military-grade encryption protects your data and communications from interception.",
                color: "purple",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-${feature.color}-500 flex flex-col h-full hover:-translate-y-1`}
              >
                <div className={`text-${feature.color}-600 text-4xl mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 flex-grow">{feature.desc}</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link href="#" className={`text-${feature.color}-600 font-semibold flex items-center hover:underline`}>
                    Learn more 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-semibold tracking-wider">SUCCESS STORIES</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">Impact We've Made</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Anonymous reports have helped law enforcement agencies across the country make significant progress in combating drug trafficking.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 md:p-12 rounded-3xl shadow-lg max-w-4xl mx-auto">
            <blockquote className="text-lg md:text-xl text-gray-700 italic mb-8">
              "With the information provided by anonymous citizens through this platform, we were able to dismantle a major drug operation that had been affecting our community for years. The anonymous nature of these reports encourages people to come forward without fear."
            </blockquote>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="font-bold">Law Enforcement Officer</p>
                <p className="text-gray-600">Major Metropolitan Area</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section
        id="cta"
        className="py-20 bg-gradient-to-r from-blue-800 to-indigo-900 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/flagged/photo-1558963675-94dc9c4a66a9?q=80&w=1372&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="CTA Background"
            className="w-full h-full object-cover opacity-10 scale-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent"></div>
        <div className="relative container mx-auto px-6 text-center max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Be Part of the Solution
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Your anonymous report could be the missing piece that helps law enforcement protect your community. Take a stand against drug trafficking today.
          </p>
          <div>
            <Link
              href="/report"
              className="px-8 py-4 bg-yellow-500 text-blue-900 font-bold rounded-lg shadow-xl hover:bg-yellow-400 transition duration-300 transform hover:scale-105 inline-block"
            >
              Submit a Report Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">DRUG Platform</h3>
              <p className="text-gray-400 mb-4">Anonymous drug trafficking reporting platform that helps make communities safer.</p>
              <p>&copy; {new Date().getFullYear()} Drug Traffic Reporting System</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/report" className="text-gray-400 hover:text-white transition duration-300">Submit a Report</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white transition duration-300">About Us</Link></li>
                <li><Link href="/faq" className="text-gray-400 hover:text-white transition duration-300">FAQ</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition duration-300">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/blog" className="text-gray-400 hover:text-white transition duration-300">Blog</Link></li>
                <li><Link href="/statistics" className="text-gray-400 hover:text-white transition duration-300">Statistics</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition duration-300">Contact Us</Link></li>
                <li><Link href="/help" className="text-gray-400 hover:text-white transition duration-300">Help Center</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
