"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FaCheckCircle, 
  FaClipboard, 
  FaClipboardCheck, 
  FaHome, 
  FaFileAlt,
  FaShieldAlt,
  FaArrowRight,
  FaEnvelope
} from "react-icons/fa";

export default function ThankYou() {
  const router = useRouter();
  const [reportId, setReportId] = useState("");
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    const id = localStorage.getItem("reportId");
    if (id) setReportId(id);

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopy = () => {
    if (reportId) {
      navigator.clipboard.writeText(reportId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-gray-900 to-blue-900 text-white">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative flex flex-col items-center justify-center min-h-screen p-6">
        <div className="max-w-3xl w-full space-y-8">
          {/* Success Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                <FaCheckCircle className="text-green-400 text-7xl relative z-10" />
              </div>
              <h1 className="text-4xl font-bold mt-6 mb-4 bg-gradient-to-r from-green-400 to-blue-400 text-transparent bg-clip-text">
                Report Submitted Successfully!
              </h1>
              <p className="text-xl text-gray-300">
                Thank you for helping make our community safer
              </p>
            </div>

            {/* Report ID Card */}
            <div className="bg-gray-800/50 rounded-xl p-6 mb-8 backdrop-blur-sm border border-gray-700">
              <h2 className="text-lg font-semibold mb-4 text-gray-300">Your Report ID</h2>
              <div className="flex items-center justify-between bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <code className="font-mono text-xl text-green-400">{reportId || 'No ID Found'}</code>
                <button
                  onClick={handleCopy}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    copied ? 'bg-green-500/20 text-green-400' : 'hover:bg-gray-700 text-gray-400'
                  }`}
                >
                  {copied ? <FaClipboardCheck size={20} /> : <FaClipboard size={20} />}
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                <span>Please save this ID for future reference</span>
                <span className="text-yellow-400">Time remaining: {formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Next Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-600/20 rounded-xl p-6 border border-blue-500/20">
                <FaShieldAlt className="text-blue-400 text-3xl mb-4" />
                <h3 className="text-lg font-semibold mb-2">What Happens Next?</h3>
                <p className="text-gray-300 text-sm">
                  Our team will review your report and take appropriate action. You can track the status using your Report ID.
                </p>
              </div>
              <div className="bg-purple-600/20 rounded-xl p-6 border border-purple-500/20">
                <FaFileAlt className="text-purple-400 text-3xl mb-4" />
                <h3 className="text-lg font-semibold mb-2">Track Your Report</h3>
                <p className="text-gray-300 text-sm">
                  Use your Report ID to check the status and updates on your submission.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="flex items-center justify-center px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-300"
              >
                <FaHome className="mr-2" />
                Return Home
              </Link>
              <Link
                href="/reports"
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                View Reports
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>

          {/* Support Section */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Need assistance? 
              <button className="ml-2 text-blue-400 hover:text-blue-300 inline-flex items-center">
                <FaEnvelope className="mr-1" /> Contact Support
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
