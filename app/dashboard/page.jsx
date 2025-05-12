"use client";
import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/Config";
import {
  FaChartLine,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaHourglassHalf,
  FaChartBar,
  FaCalendarAlt,
  FaUserShield,
  FaBell,
  FaSearch,
  FaDownload,
  FaEye,
  FaTimesCircle,
  FaHome,
  FaChevronRight,
  // FaUserShield,
  // FaChartBar,
  FaClipboardList,
} from "react-icons/fa";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Link from "next/link";

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("week");
  const [selectedRegion, setSelectedRegion] = useState("all");

  useEffect(() => {
    const q = query(collection(db, "reports"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reportsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReports(reportsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getStatusStats = () => {
    const stats = {
      pending: 0,
      investigating: 0,
      resolved: 0,
      dismissed: 0,
    };
    reports.forEach((report) => {
      stats[report.status] = (stats[report.status] || 0) + 1;
    });
    return stats;
  };

  const getReportTypeStats = () => {
    const stats = {};
    reports.forEach((report) => {
      stats[report.reportType] = (stats[report.reportType] || 0) + 1;
    });
    return stats;
  };

  const getTimeSeriesData = () => {
    const timeData = [];
    const days = timeframe === "week" ? 7 : timeframe === "month" ? 30 : 90;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const count = reports.filter(
        (report) =>
          new Date(report.timestamp).toDateString() === date.toDateString()
      ).length;
      timeData.push({
        date: date.toLocaleDateString(),
        reports: count,
      });
    }
    return timeData;
  };

  const COLORS = ["#4F46E5", "#7C3AED", "#EC4899", "#F59E0B"];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = getStatusStats();
  const typeStats = getReportTypeStats();
  const timeSeriesData = getTimeSeriesData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Analytics Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <FaBell className="h-6 w-6" />
              </button>
              <button className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                <FaDownload className="h-4 w-4" />
                <span>Export Data</span>
              </button>
            </div>
          </div>
          <div className="bg-gray-100 border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm">
                  <li>
                    <Link
                      href="/"
                      className="text-gray-500 hover:text-blue-600 flex items-center"
                    >
                      <FaHome className="mr-1" />
                      <span>Home</span>
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <FaChevronRight
                      className="text-gray-400 mx-1"
                      aria-hidden="true"
                    />
                    <Link
                      href="/admin"
                      className="text-gray-500 hover:text-blue-600 flex items-center"
                    >
                      <FaUserShield className="mr-1" />
                      <span>Admin</span>
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <FaChevronRight
                      className="text-gray-400 mx-1"
                      aria-hidden="true"
                    />
                    <Link
                      href="/dashboard"
                      className="text-gray-500 hover:text-blue-600 flex items-center"
                    >
                      <FaChartBar className="mr-1" />
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <FaChevronRight
                      className="text-gray-400 mx-1"
                      aria-hidden="true"
                    />
                    <span className="text-blue-600 font-medium flex items-center">
                      <FaClipboardList className="mr-1" />
                      Reports
                    </span>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Reports",
              value: reports.length,
              icon: FaChartBar,
              color: "blue",
            },
            {
              title: "Pending Review",
              value: stats.pending,
              icon: FaHourglassHalf,
              color: "yellow",
            },
            {
              title: "Under Investigation",
              value: stats.investigating,
              icon: FaEye,
              color: "purple",
            },
            {
              title: "Resolved Cases",
              value: stats.resolved,
              icon: FaCheckCircle,
              color: "green",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`text-${stat.color}-500 bg-${stat.color}-50 p-3 rounded-lg`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Time Series Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Report Trends
              </h2>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last 90 Days</option>
              </select>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="reports"
                    stroke="#4F46E5"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribution Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Report Distribution
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(typeStats).map(([name, value]) => ({
                      name,
                      value,
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {Object.entries(typeStats).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {Object.entries(typeStats).map(([type, count], index) => (
                <div key={type} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-600">
                    {type.charAt(0).toUpperCase() + type.slice(1)}: {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Reports Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Reports
              </h2>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.slice(0, 5).map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{report.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.reportType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            report.status === "resolved"
                              ? "bg-green-100 text-green-800"
                              : report.status === "investigating"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(report.timestamp).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
