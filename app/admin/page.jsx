"use client";

import { useState, useEffect } from "react";
// Ensure correct Firebase import
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/Config";

const statusCycle = ["Pending", "Active", "Complete"];

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reports"));
        const reportsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReports(reportsList);
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

      setReports((prevReports) =>
        prevReports.map((report) =>
          report.id === reportId
            ? {
                ...report,
                status: nextStatus,
                statusDescription: `Updated to ${nextStatus} by Admin`,
              }
            : report
        )
      );
    } catch (error) {
      console.error("Error updating report status:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Admin Reports Panel
      </h1>
      {loading ? (
        <p className="text-center">Loading reports...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3">Title</th>
                <th className="p-3">Description</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b hover:bg-gray-100">
                  <td className="p-3">{report.reportType}</td>
                  <td className="p-3">{report.description}</td>
                  <td className="p-3 font-semibold">{report.status}</td>
                  <td className="p-3">
                    <button
                      onClick={() => updateStatus(report.id, report.status)}
                      className="px-4 py-2 text-white rounded-lg shadow-md transition-all duration-200 bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
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
  );
};

export default AdminReports;
