"use client";
import React, { useEffect, useState } from "react";

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/Config";
import {
  FaMapMarkerAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaSyringe, // Drug Abuse
  FaCapsules, // Drug Trafficking
  FaGavel, // Illegal Possession (Court Gavel)
} from "react-icons/fa";

// Report types and their corresponding icons
const reportTypes = {
  "drug trafficking": {
    label: "Drug Trafficking",
    icon: <FaCapsules className="text-blue-500" />,
  },
  "drug abuse": {
    label: "Drug Abuse",
    icon: <FaSyringe className="text-red-500" />,
  },
  "illegal possession": {
    label: "Illegal Possession",
    icon: <FaGavel className="text-gray-700" />,
  },
};

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reports"));
        const reportsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReports(reportsData);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Filtered reports based on selected filters
  const filteredReports = reports.filter((report) => {
    return (
      (statusFilter ? report.status === statusFilter : true) &&
      (typeFilter ? report.reportType === typeFilter : true)
    );
  });

  return (
    <div className="relative min-h-screen w-full">
      {/* Full-Screen Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1470790376778-a9fbc86d70e2?q=80&w=1408&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl font-extrabold text-center text-white mb-8">
          Reported Incidents
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Status Filter */}
          <select
            className="p-2 rounded bg-white shadow-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
          </select>

          {/* Report Type Filter */}
          <select
            className="p-2 rounded bg-white shadow-md"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Report Types</option>
            {Object.keys(reportTypes).map((key) => (
              <option key={key} value={key}>
                {reportTypes[key].label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-center text-gray-200">Loading reports...</p>
        ) : filteredReports.length === 0 ? (
          <p className="text-center text-gray-200">No reports found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-white w-[300px] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
              >
                {report.evidence && (
                  <img
                    src={report.evidence.url}
                    alt="Evidence"
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-5">
                  <h2 className="text-xl font-semibold flex items-center text-gray-800">
                    {reportTypes[report.reportType]?.icon || (
                      <FaExclamationTriangle className="text-yellow-500" />
                    )}
                    <span className="ml-2">
                      {reportTypes[report.reportType]?.label ||
                        "Unknown Report"}
                    </span>
                  </h2>

                  <div className="flex items-center text-gray-500 mt-3 text-sm">
                    <FaMapMarkerAlt className="mr-2 text-blue-500" />
                    <span>{report.location}</span>
                  </div>
                  <div className="mt-4 flex items-center text-gray-500 text-sm">
                    <FaClock className="mr-2 text-gray-500" />
                    <span>{report.timestamp.split("T")[0]}</span>
                  </div>
                  <div className="mt-4">
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-wide ${
                        report.status === "resolved"
                          ? "bg-green-500 text-white" // Resolved (Green)
                          : report.status === "active"
                          ? "bg-blue-500 text-white" // Active (Blue)
                          : "bg-yellow-500 text-gray-900" // Pending (Yellow)
                      }`}
                    >
                      {report.status === "resolved" ? (
                        <FaCheckCircle className="inline-block mr-1" />
                      ) : report.status === "active" ? (
                        <span className="inline-block w-2 h-2 bg-white rounded-full mr-1"></span>
                      ) : (
                        <FaClock className="inline-block mr-1" />
                      )}
                      {report.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
