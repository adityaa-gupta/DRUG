"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/Config";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    pending: 0,
    active: 0,
    resolved: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState("all"); // Default to show all statuses
  const [timeRange, setTimeRange] = useState("1month"); // Default time range

  const fetchStats = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "reports"));
      const data = querySnapshot.docs.map((doc) => doc.data());

      console.log(data);

      // Calculate counts
      const counts = {
        pending: data.filter((item) => item.status === "pending").length,
        active: data.filter((item) => item.status === "active").length,
        resolved: data.filter((item) => item.status === "resolved").length,
      };

      setStats(counts);

      // Prepare data for the chart
      const filteredData = filterDataByRange(data);
      const groupedData = groupData(filteredData);
      setChartData(groupedData);
    } catch (error) {
      console.error("Error fetching stats: ", error);
    }
  };

  const isValidTimestamp = (timestamp) => {
    return !isNaN(new Date(timestamp).getTime());
  };

  const filterDataByRange = (data) => {
    const now = new Date();
    let filteredData = [];

    if (timeRange === "1week") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      filteredData = data.filter(
        (item) =>
          isValidTimestamp(item.timestamp) &&
          new Date(item.timestamp) >= oneWeekAgo
      );
    } else if (timeRange === "1month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      filteredData = data.filter(
        (item) =>
          isValidTimestamp(item.timestamp) &&
          new Date(item.timestamp) >= oneMonthAgo
      );
    } else if (timeRange === "1year") {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      filteredData = data.filter(
        (item) =>
          isValidTimestamp(item.timestamp) &&
          new Date(item.timestamp) >= oneYearAgo
      );
    }

    return filteredData;
  };

  const groupData = (data) => {
    const grouped = {};

    data.forEach((item) => {
      if (!item.timestamp || !isValidTimestamp(item.timestamp)) return;

      let key;
      if (timeRange === "1year") {
        // Group by month
        const date = new Date(item.timestamp);
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
      } else {
        // Group by day
        key = new Date(item.timestamp).toISOString().split("T")[0];
      }

      if (!grouped[key]) {
        grouped[key] = { date: key, pending: 0, active: 0, resolved: 0 };
      }

      grouped[key][item.status]++;
    });

    return Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  };

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-8 text-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p>Track the status of all reports submitted to the system.</p>
      </header>

      <main className="container mx-auto p-8">
        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center">
          <div>
            <label className="mr-4 font-semibold">Filter by Status:</label>
            <select
              value={filteredStatus}
              onChange={(e) => setFilteredStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="active">active</option>
              <option value="resolved">resolved</option>
            </select>
          </div>
          <div className="mt-4 sm:mt-0">
            <label className="mr-4 font-semibold">Filter by Time Range:</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="1week">1 Week</option>
              <option value="1month">1 Month</option>
              <option value="1year">1 Year</option>
            </select>
          </div>
        </div>
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {/* Pending Requests */}
          <div className="bg-white shadow-lg rounded-lg p-6 text-center border-t-4 border-yellow-400">
            <h2 className="text-lg font-bold text-gray-800">Pending</h2>
            <p className="text-3xl font-extrabold text-yellow-500 mt-4">
              {stats.pending}
            </p>
            <p className="text-gray-600 mt-2">Requests yet to be processed</p>
          </div>

          {/* active Requests */}
          <div className="bg-white shadow-lg rounded-lg p-6 text-center border-t-4 border-green-400">
            <h2 className="text-lg font-bold text-gray-800">active</h2>
            <p className="text-3xl font-extrabold text-green-500 mt-4">
              {stats.active}
            </p>
            <p className="text-gray-600 mt-2">Requests successfully reactive</p>
          </div>

          {/* resolved Requests */}
          <div className="bg-white shadow-lg rounded-lg p-6 text-center border-t-4 border-blue-400">
            <h2 className="text-lg font-bold text-gray-800">resolved</h2>
            <p className="text-3xl font-extrabold text-blue-500 mt-4">
              {stats.resolved}
            </p>
            <p className="text-gray-600 mt-2">
              Requests currently under review
            </p>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: "Pending", value: stats.pending },
                  { name: "active", value: stats.active },
                  { name: "resolved", value: stats.resolved },
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={(entry) => `${entry.name}: ${entry.value}`}
              >
                <Cell fill="#F59E0B" />
                <Cell fill="#10B981" />
                <Cell fill="#3B82F6" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Reports Over Time
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {filteredStatus === "all" || filteredStatus === "pending" ? (
                <Line
                  type="monotone"
                  dataKey="pending"
                  stroke="#F59E0B"
                  name="Pending"
                />
              ) : null}
              {filteredStatus === "all" || filteredStatus === "active" ? (
                <Line
                  type="monotone"
                  dataKey="active"
                  stroke="#10B981"
                  name="active"
                />
              ) : null}
              {filteredStatus === "all" || filteredStatus === "resolved" ? (
                <Line
                  type="monotone"
                  dataKey="resolved"
                  stroke="#3B82F6"
                  name="resolved"
                />
              ) : null}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
