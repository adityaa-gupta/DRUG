"use client";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase/Config";
import {
  FaUpload,
  FaFileAlt,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaRegUser,
  FaLock,
  FaInfoCircle,
  FaCamera,
  FaVideo,
} from "react-icons/fa";
import supabase from "@/supabase/supabase";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function ReportForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    reportType: "",
    description: "",
    location: "",
    evidence: null,
    isAnonymous: true,
    status: "pending",
    incidentDate: "",
    suspectDescription: "",
    additionalDetails: "",
  });

  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [previewURL, setPreviewURL] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, evidence: file });
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewURL(url);
    }
  };

  const removeFile = () => {
    setFormData({ ...formData, evidence: null });
    if (previewURL) {
      URL.revokeObjectURL(previewURL);
      setPreviewURL(null);
    }
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

    console.log("image", publicURLData.publicUrl);

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
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setIsUploading(true);
    try {
      let evidenceUrl = null;
      if (formData.evidence) {
        const result = await uploadImage(formData.evidence);
        if (result.error) {
          toast.error("Failed to upload evidence: " + result.error);
          return;
        }
        evidenceUrl = result.url;
      }

      const reportData = {
        ...formData,
        evidence: evidenceUrl,
        timestamp: new Date().toISOString(),
      };

      await uploadToFirebase(reportData);
      toast.success(
        "Report submitted successfully. Thank you for helping keep our community safe."
      );
      router.push("/thank-you");
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Basic Information
                </h2>
                <span className="text-sm text-gray-400">Step 1 of 3</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center text-white text-sm font-medium mb-1">
                    <FaExclamationTriangle className="text-red-400 mr-2" />{" "}
                    Report Type
                  </label>
                  <select
                    name="reportType"
                    value={formData.reportType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-red-400 outline-none transition-all duration-300"
                    required
                  >
                    <option value="">Select a report type</option>
                    <option value="drug trafficking">Drug Trafficking</option>
                    <option value="illegal possession">
                      Illegal Possession
                    </option>
                    <option value="suspicious activity">
                      Suspicious Activity
                    </option>
                    <option value="drug manufacturing">
                      Drug Manufacturing
                    </option>
                    <option value="distribution">Drug Distribution</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center text-white text-sm font-medium mb-1">
                    <FaMapMarkerAlt className="text-green-400 mr-2" /> Location
                  </label>
                  <input
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-green-400 outline-none transition-all duration-300"
                    placeholder="Enter the specific location of the incident"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center text-white text-sm font-medium mb-1">
                    <FaFileAlt className="text-blue-400 mr-2" /> Incident Date
                  </label>
                  <input
                    name="incidentDate"
                    type="date"
                    value={formData.incidentDate}
                    onChange={handleChange}
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-300"
                    required
                  />
                </div>
              </div>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Incident Details
                </h2>
                <span className="text-sm text-gray-400">Step 2 of 3</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center text-white text-sm font-medium mb-1">
                    <FaFileAlt className="text-blue-400 mr-2" /> Description
                  </label>
                  <textarea
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-300"
                    placeholder="Provide detailed information about what you witnessed"
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="flex items-center text-white text-sm font-medium mb-1">
                    <FaRegUser className="text-yellow-400 mr-2" /> Suspect
                    Description
                  </label>
                  <textarea
                    name="suspectDescription"
                    rows="3"
                    value={formData.suspectDescription}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-yellow-400 outline-none transition-all duration-300"
                    placeholder="Describe any suspects involved (appearance, vehicles, etc.)"
                  ></textarea>
                </div>
              </div>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Evidence & Submission
                </h2>
                <span className="text-sm text-gray-400">Step 3 of 3</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center text-white text-sm font-medium mb-1">
                    <FaUpload className="text-purple-400 mr-2" /> Upload
                    Evidence
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="evidence-upload"
                    />
                    <label
                      htmlFor="evidence-upload"
                      className="w-full flex items-center justify-center px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700 transition-all duration-300"
                    >
                      <FaCamera className="mr-2 text-purple-400" />
                      <span className="text-white">Choose Photo/Video</span>
                    </label>
                  </div>
                  {previewURL && (
                    <div className="mt-2 relative">
                      {formData.evidence?.type.startsWith("image/") ? (
                        <img
                          src={previewURL}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-800 rounded-lg flex items-center justify-center">
                          <FaVideo className="text-4xl text-purple-400" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={removeFile}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center text-white text-sm font-medium mb-1">
                    <FaInfoCircle className="text-blue-400 mr-2" /> Additional
                    Details
                  </label>
                  <textarea
                    name="additionalDetails"
                    rows="3"
                    value={formData.additionalDetails}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-300"
                    placeholder="Any other information that might be helpful"
                  ></textarea>
                </div>

                <div className="flex items-center bg-gray-800 p-3 rounded-lg border border-gray-600">
                  <FaLock className="text-yellow-400 mr-2" />
                  <div className="flex-1">
                    <h3 className="text-white text-sm font-medium">
                      Anonymous Submission
                    </h3>
                    <p className="text-gray-400 text-xs">
                      Your identity will be protected
                    </p>
                  </div>
                  <input
                    name="isAnonymous"
                    type="checkbox"
                    checked={formData.isAnonymous}
                    onChange={handleChange}
                    className="h-4 w-4 border border-gray-400 rounded bg-gray-800"
                  />
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-8">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.3)",
        }}
      />

      <div className="relative z-10 bg-black bg-opacity-70 p-8 rounded-xl shadow-2xl max-w-md w-full backdrop-blur-sm border border-gray-800">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Report an Incident
          </h1>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-2 rounded-full ${
                  s === step ? "bg-yellow-400" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStep()}

          <div className="flex justify-between space-x-4">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-300"
              >
                Previous
              </button>
            )}
            <button
              type="submit"
              className={`flex-1 px-6 py-3 ${
                step === 3
                  ? "bg-gradient-to-r from-green-500 to-emerald-600"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600"
              } text-white rounded-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center`}
              disabled={isUploading}
            >
              {isUploading ? (
                "Submitting..."
              ) : step === 3 ? (
                <>
                  Submit Report <FaLock className="ml-2" />
                </>
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </form>

        {step === 1 && (
          <div className="mt-6 p-4 bg-blue-900 bg-opacity-50 rounded-lg">
            <div className="flex items-start">
              <FaInfoCircle className="text-blue-400 mt-1 mr-2" />
              <p className="text-sm text-gray-300">
                Your report helps law enforcement combat drug trafficking. All
                information is encrypted and handled securely.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
