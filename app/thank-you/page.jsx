"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaClipboard, FaClipboardCheck } from "react-icons/fa";

export default function ThankYou() {
  const router = useRouter();
  const [reportId, setReportId] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("reportId");
    if (id) setReportId(id);
  }, []);

  const handleCopy = () => {
    if (reportId) {
      navigator.clipboard.writeText(reportId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1604881991763-95827d3fca92?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="bg-black bg-opacity-70 p-8 rounded-lg shadow-lg text-center max-w-lg w-full">
        <FaCheckCircle className="text-green-400 text-6xl mb-4 animate-pulse" />
        <h1 className="text-3xl font-bold mb-4">
          Thank You for Taking Action! 🙌
        </h1>
        <p className="text-gray-300 text-lg mb-6">
          Your report has been successfully submitted. Your courage and
          initiative help make our community safer. Together, we can fight
          against crime and injustice! 💪
        </p>

        {/* Report ID Section */}
        {reportId ? (
          <div className="bg-gray-800 text-white rounded-lg p-3 flex justify-between items-center mb-6">
            <span className="font-semibold">{reportId}</span>
            <button
              onClick={handleCopy}
              className="text-lg transition-all duration-200 hover:text-green-400"
            >
              {copied ? (
                <FaClipboardCheck className="text-green-400" />
              ) : (
                <FaClipboard />
              )}
            </button>
          </div>
        ) : (
          <p className="text-red-400 font-semibold mb-4">No Report ID Found!</p>
        )}

        <p className="text-gray-300 text-sm mb-6">
          Please keep this ID for your records. If you have any questions, feel
          free to contact us.
        </p>

        {/* View Reports Button */}
        <Link
          href="/reports"
          className="inline-block px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition-all"
        >
          View All Reports
        </Link>
      </div>
    </div>
  );
}
