"use client";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase/Config";
import { s3, BucketName } from "@/awsConfig";
import {
  FaUpload,
  FaFileAlt,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaRegUser,
} from "react-icons/fa";
import supabase from "@/supabase/supabase";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function ReportForm() {
  const [formData, setFormData] = useState({
    reportType: "",
    description: "",
    location: "",
    evidence: null,
    isAnonymous: false,
    status: "pending",
  });

  const router = useRouter();

  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileUpload = (e) => {
    setFormData({ ...formData, evidence: e.target.files[0] });
  };

  const uploadImage = async (file) => {
    if (!file) {
      console.error("No file selected");
      return { error: "No file selected" };
    }

    const fileName = `${Date.now()}-${file.name}`; // Unique filename
    const { data, error } = await supabase.storage
      .from("USB") // Bucket name
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false, // Avoid overwriting existing files
      });

    if (error) {
      console.error("Upload Error:", error.message);
      return { error: error.message };
    }

    // Get public URL of the uploaded image
    const { data: publicURLData } = supabase.storage
      .from("USB")
      .getPublicUrl(fileName);

    return { url: publicURLData.publicUrl };
  };

  const uploadToFirebase = async (reportData) => {
    try {
      const docRef = await addDoc(collection(db, "reports"), reportData);
      const docId = docRef.id;
      localStorage.setItem("reportId", docId);
    } catch (error) {
      console.error("Firebase Error:", error);
      toast.error("Error submitting your report.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let evidenceUrl = null;
      if (formData.evidence) {
        evidenceUrl = await uploadImage(formData.evidence);
      }

      const reportData = {
        ...formData,
        evidence: evidenceUrl,
        timestamp: new Date().toISOString(),
      };

      await uploadToFirebase(reportData);
      toast.success("Your report has been submitted successfully!");
      setFormData({
        reportType: "",
        description: "",
        location: "",
        evidence: null,
        isAnonymous: false,
        status: "pending",
      });
      router.push("/thank-you");
    } catch (error) {
      console.error("Submission Error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-900 flex items-center justify-center px-4"
      style={{
        backgroundImage: `url(https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-black bg-opacity-70 p-6 rounded-xl shadow-lg max-w-md w-full">
        <header className="text-white text-center mb-6">
          <h1 className="text-3xl font-bold">Report an Incident</h1>
          <p className="text-gray-300 text-sm">
            Help keep your community safe by submitting an anonymous report.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Report Type */}
          <div>
            <label className="flex items-center text-white text-sm font-medium mb-1">
              <FaExclamationTriangle className="text-red-400 mr-2" /> Report
              Type
            </label>
            <select
              name="reportType"
              value={formData.reportType}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-red-400 outline-none"
              required
            >
              <option value="">Select a report type</option>
              <option value="drug trafficking">Drug Trafficking</option>
              <option value="illegal possession">Illegal Possession</option>
              <option value="suspicious activity">Suspicious Activity</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center text-white text-sm font-medium mb-1">
              <FaFileAlt className="text-blue-400 mr-2" /> Description
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Provide details about the incident."
              required
            ></textarea>
          </div>

          {/* Location */}
          <div>
            <label className="flex items-center text-white text-sm font-medium mb-1">
              <FaMapMarkerAlt className="text-green-400 mr-2" /> Location
            </label>
            <input
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="Enter the location."
              required
            />
          </div>

          {/* Evidence Upload */}
          <div>
            <label className="flex items-center text-white text-sm font-medium mb-1">
              <FaUpload className="text-purple-400 mr-2" /> Upload Evidence
              (optional)
            </label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="w-full text-white bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 cursor-pointer"
            />
          </div>

          {/* Anonymous Reporting */}
          <div className="flex items-center">
            <input
              name="isAnonymous"
              type="checkbox"
              checked={formData.isAnonymous}
              onChange={handleChange}
              className="h-4 w-4 border border-gray-400 rounded bg-gray-800"
            />
            <label className="ml-2 text-gray-300 text-sm flex items-center">
              <FaRegUser className="mr-1" /> Submit anonymously
            </label>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 to-yellow-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:opacity-90 transition-all duration-300"
              disabled={isUploading}
            >
              {isUploading ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
