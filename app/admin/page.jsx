"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/Config";
import {
  FiFilter,
  FiSearch,
  FiRefreshCw,
  FiCheck,
  FiClock,
  FiAlertCircle,
  FiMenu,
  FiUser,
  FiHome,
  FiSettings,
  FiLogOut,
  FiPieChart,
} from "react-icons/fi";
import {
  FaSearch,
  FaClock,
  FaMapMarkerAlt,
  FaTag,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaFilter,
  FaCalendarAlt,
  FaHome,
  FaChevronRight,
  FaUserShield,
  FaChartBar,
  FaClipboardList,
} from "react-icons/fa";
import Link from "next/link";

const statusCycle = ["Pending", "Active", "Complete"];

const statusStyles = {
  Pending:
    "bg-gradient-to-r from-amber-500/20 to-amber-300/20 text-amber-700 border-amber-300",
  Active:
    "bg-gradient-to-r from-blue-500/20 to-blue-300/20 text-blue-700 border-blue-300",
  Complete:
    "bg-gradient-to-r from-emerald-500/20 to-emerald-300/20 text-emerald-700 border-emerald-300",
};

const statusIcons = {
  Pending: <FiClock className="mr-1.5" />,
  Active: <FiAlertCircle className="mr-1.5" />,
  Complete: <FiCheck className="mr-1.5" />,
};

const statusColors = {
  Pending: "text-amber-500",
  Active: "text-blue-500",
  Complete: "text-emerald-500",
};

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    active: 0,
    complete: 0,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reports"));
        const reportsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date || new Date().toISOString().split("T")[0],
        }));

        setReports(reportsList);

        // Calculate stats
        const pending = reportsList.filter(
          (r) => r.status === "Pending"
        ).length;
        const active = reportsList.filter((r) => r.status === "Active").length;
        const complete = reportsList.filter(
          (r) => r.status === "Complete"
        ).length;

        setStats({
          total: reportsList.length,
          pending,
          active,
          complete,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const updateStatus = async (reportId, currentStatus) => {
    try {
      const nextStatusIndex =
        (statusCycle.indexOf(currentStatus) + 1) % statusCycle.length;
      const nextStatus = statusCycle[nextStatusIndex];
      const reportRef = doc(db, "reports", reportId);

      await updateDoc(reportRef, {
        status: nextStatus,
        statusDescription: `Updated to ${nextStatus} by Admin`,
      });

      // Update reports state
      const updatedReports = reports.map((report) =>
        report.id === reportId
          ? {
              ...report,
              status: nextStatus,
              statusDescription: `Updated to ${nextStatus} by Admin`,
            }
          : report
      );

      setReports(updatedReports);

      // Update stats
      const pending = updatedReports.filter(
        (r) => r.status === "Pending"
      ).length;
      const active = updatedReports.filter((r) => r.status === "Active").length;
      const complete = updatedReports.filter(
        (r) => r.status === "Complete"
      ).length;

      setStats({
        total: updatedReports.length,
        pending,
        active,
        complete,
      });
    } catch (error) {
      console.error("Error updating report status:", error);
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.reportType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "All" || report.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Function to calculate completion percentage
  const completionPercentage =
    stats.total > 0 ? Math.round((stats.complete / stats.total) * 100) : 0;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-900 to-indigo-900 text-white transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out shadow-xl`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-blue-800/40">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-blue-700 flex items-center justify-center">
                <FiPieChart className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">DRUG Admin</h1>
                <p className="text-blue-300 text-xs">Management Dashboard</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <a
              href="#"
              className="flex items-center space-x-3 p-3 rounded-lg bg-blue-800/30 text-white"
            >
              <FiHome className="text-blue-300" />
              <span>Dashboard</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-800/20 text-gray-300"
            >
              <FiUser className="text-blue-300" />
              <span>Users</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-800/20 text-gray-300"
            >
              <FiSettings className="text-blue-300" />
              <span>Settings</span>
            </a>
          </nav>

          <div className="p-4 border-t border-blue-800/40">
            <a
              href="#"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-800/20 text-gray-300"
            >
              <FiLogOut className="text-blue-300" />
              <span>Logout</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 md:hidden"
              >
                <FiMenu />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Reports Management
                </h1>
                <p className="text-gray-500 text-sm">
                  Monitor and manage user submitted reports
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FiUser className="text-blue-600" />
                </div>
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
              </div>
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
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          {/* Stats Overview Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Reports Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-6 transition-all duration-300 hover:shadow-md">
                  <div className="absolute right-0 top-0 -mt-4 -mr-12 h-24 w-24 rounded-full bg-blue-100/80 opacity-50"></div>
                  <div className="relative">
                    <p className="text-sm font-medium text-gray-500">
                      Total Reports
                    </p>
                    <p className="mt-2 text-3xl font-bold text-gray-800">
                      {stats.total}
                    </p>
                    <div className="mt-3 flex items-center text-sm">
                      <div className="flex items-center text-blue-500">
                        <FiRefreshCw className="mr-1 h-4 w-4" />
                        <span>Updated Today</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 p-6 transition-all duration-300 hover:shadow-md">
                  <div className="absolute right-0 top-0 -mt-4 -mr-12 h-24 w-24 rounded-full bg-amber-100/80 opacity-50"></div>
                  <div className="relative">
                    <p className="text-sm font-medium text-amber-700">
                      Pending
                    </p>
                    <p className="mt-2 text-3xl font-bold text-gray-800">
                      {stats.pending}
                    </p>
                    <div className="mt-3 flex items-center text-sm">
                      <div className="flex items-center text-amber-500">
                        <FiClock className="mr-1 h-4 w-4" />
                        <span>Awaiting Action</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 p-6 transition-all duration-300 hover:shadow-md">
                  <div className="absolute right-0 top-0 -mt-4 -mr-12 h-24 w-24 rounded-full bg-blue-100/80 opacity-50"></div>
                  <div className="relative">
                    <p className="text-sm font-medium text-blue-700">Active</p>
                    <p className="mt-2 text-3xl font-bold text-gray-800">
                      {stats.active}
                    </p>
                    <div className="mt-3 flex items-center text-sm">
                      <div className="flex items-center text-blue-500">
                        <FiAlertCircle className="mr-1 h-4 w-4" />
                        <span>In Progress</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 p-6 transition-all duration-300 hover:shadow-md">
                  <div className="absolute right-0 top-0 -mt-4 -mr-12 h-24 w-24 rounded-full bg-emerald-100/80 opacity-50"></div>
                  <div className="relative">
                    <p className="text-sm font-medium text-emerald-700">
                      Completed
                    </p>
                    <p className="mt-2 text-3xl font-bold text-gray-800">
                      {stats.complete}
                    </p>
                    <div className="mt-3 flex items-center text-sm">
                      <div className="flex items-center text-emerald-500">
                        <FiCheck className="mr-1 h-4 w-4" />
                        <span>Resolved</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">
                    Completion Rate
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {completionPercentage}%
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500 ease-out"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-auto relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search reports..."
                  className="pl-10 pr-4 py-2.5 w-full sm:w-80 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center w-full sm:w-auto">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiFilter className="text-gray-400" />
                  </div>
                  <select
                    className="pl-10 pr-4 py-2.5 w-full bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="All">All Status</option>
                    {statusCycle.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reports Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-16 flex flex-col items-center justify-center">
                <div className="relative h-16 w-16">
                  <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-dashed border-blue-400 animate-spin"></div>
                  <div className="absolute top-0 left-0 h-16 w-16 flex items-center justify-center">
                    <FiRefreshCw className="text-blue-500 text-xl animate-pulse" />
                  </div>
                </div>
                <p className="mt-4 text-gray-600 font-medium">
                  Loading reports...
                </p>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="p-16 flex flex-col items-center justify-center">
                <div className="bg-gray-100/80 p-6 rounded-full mb-4">
                  <FiSearch className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-1">
                  No reports found
                </h3>
                <p className="text-gray-500 text-center max-w-md">
                  We couldn't find any reports matching your search criteria.
                  Try adjusting your filters or search terms.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Report Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredReports.map((report) => (
                      <tr
                        key={report.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div
                              className={`h-9 w-9 rounded-full ${
                                statusColors[report.status]
                              } bg-opacity-10 flex items-center justify-center mr-3`}
                            >
                              {statusIcons[report.status]}
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">
                                {report.reportType}
                              </div>
                              <div className="text-xs text-gray-500">
                                #{report.id.slice(0, 8)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs text-sm text-gray-600 truncate">
                            {report.description}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                              statusStyles[report.status]
                            }`}
                          >
                            {statusIcons[report.status]}
                            {report.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {report.date}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              updateStatus(report.id, report.status)
                            }
                            className="px-4 py-2 text-sm text-white rounded-lg shadow-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 focus:ring-2 focus:ring-blue-300 focus:outline-none transform hover:-translate-y-0.5"
                          >
                            Update Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 py-4 px-6">
          <div className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} DRUG Management System. All rights
            reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminReports;
