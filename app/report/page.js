"use client";
import { useState, useEffect } from "react";
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
  FaCheck,
  FaArrowRight,
  FaArrowLeft,
  FaCalendarAlt,
  FaQuestion,
  FaShieldAlt,
  FaClipboardCheck,
} from "react-icons/fa";
import supabase from "@/supabase/supabase";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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
  const [errors, setErrors] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isFormTouched, setIsFormTouched] = useState(false);
  const totalSteps = 4; // Now 4 steps with review

  // Validation functions
  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.reportType)
        newErrors.reportType = "Please select a report type";
      if (!formData.location) newErrors.location = "Location is required";
      if (!formData.incidentDate) newErrors.incidentDate = "Date is required";
    } else if (currentStep === 2) {
      if (!formData.description || formData.description.length < 10)
        newErrors.description =
          "Please provide a detailed description (minimum 10 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setIsFormTouched(true);

    // Real-time validation
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  useEffect(() => {
    // Save draft to localStorage
    if (isFormTouched) {
      const dataToSave = { ...formData };
      delete dataToSave.evidence; // Don't save the file object
      localStorage.setItem("reportDraft", JSON.stringify(dataToSave));
    }
  }, [formData, isFormTouched]);

  useEffect(() => {
    // Load draft from localStorage on initial load
    const savedDraft = localStorage.getItem("reportDraft");
    if (savedDraft) {
      try {
        setFormData({ ...formData, ...JSON.parse(savedDraft) });
      } catch (e) {
        console.error("Error loading draft:", e);
      }
    }
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 20MB)
      if (file.size > 20 * 1024 * 1024) {
        toast.error("File size exceeds 20MB limit");
        return;
      }

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

    return { url: publicURLData.publicUrl };
  };

  const uploadToFirebase = async (reportData) => {
    try {
      const docRef = await addDoc(collection(db, "reports"), reportData);
      const docId = docRef.id;
      localStorage.setItem("reportId", docId);
      localStorage.removeItem("reportDraft"); // Clear draft after successful submission
      return docId;
    } catch (error) {
      console.error("Firebase Error:", error);
      throw new Error("Error submitting your report.");
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < totalSteps) {
        setStep(step + 1);
      }
    }
  };

  const handleSubmitConfirm = async () => {
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

      const reportId = await uploadToFirebase(reportData);

      // Show success toast with animation
      toast.success(
        "Report #" + reportId.slice(-6) + " submitted successfully",
        {
          icon: "🔒",
          position: "top-center",
          autoClose: 5000,
        }
      );

      router.push("/thank-you");
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsUploading(false);
      setShowConfirmModal(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < totalSteps) {
      handleNext();
      return;
    }

    if (validateStep(step)) {
      setShowConfirmModal(true);
    }
  };

  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const clearDraft = () => {
    localStorage.removeItem("reportDraft");
    setFormData({
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
    setPreviewURL(null);
    setStep(1);
    toast.info("Draft cleared successfully");
  };

  const ConfirmationModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black bg-opacity-75"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-2xl max-w-md w-full"
      >
        <h3 className="text-xl font-bold text-white mb-4">
          Confirm Submission
        </h3>
        <p className="text-gray-300 mb-6">
          You're about to submit this report to law enforcement. This action
          cannot be undone. Are you sure you want to proceed?
        </p>
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => setShowConfirmModal(false)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex-1 flex items-center justify-center"
          >
            <FaArrowLeft className="mr-2" /> Go Back
          </button>
          <button
            onClick={handleSubmitConfirm}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-colors flex-1 flex items-center justify-center"
            disabled={isUploading}
          >
            {isUploading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>
                <FaShieldAlt className="mr-2" /> Yes, Submit Report
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                Basic Information
              </h2>
              <span className="text-sm text-gray-400">
                Step 1 of {totalSteps}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center text-white text-sm font-medium mb-1">
                  <FaExclamationTriangle className="text-red-400 mr-2" />
                  Report Type
                  <span className="text-red-400 ml-1">*</span>
                </label>
                <div className="relative">
                  <select
                    name="reportType"
                    value={formData.reportType}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-lg bg-gray-800 text-white border ${
                      errors.reportType ? "border-red-500" : "border-gray-600"
                    } focus:ring-2 focus:ring-red-400 outline-none transition-all duration-300`}
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
                  {errors.reportType && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.reportType}
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Select the category that best describes the incident
                </p>
              </div>

              <div>
                <label className="flex items-center text-white text-sm font-medium mb-1">
                  <FaMapMarkerAlt className="text-green-400 mr-2" /> Location
                  <span className="text-red-400 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-lg bg-gray-800 text-white border ${
                      errors.location ? "border-red-500" : "border-gray-600"
                    } focus:ring-2 focus:ring-green-400 outline-none transition-all duration-300`}
                    placeholder="Enter the specific location of the incident"
                    required
                  />
                  {errors.location && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.location}
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Be as specific as possible (address, landmark, etc.)
                </p>
              </div>

              <div>
                <label className="flex items-center text-white text-sm font-medium mb-1">
                  <FaCalendarAlt className="text-blue-400 mr-2" /> Incident Date
                  <span className="text-red-400 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    name="incidentDate"
                    type="date"
                    value={formData.incidentDate}
                    onChange={handleChange}
                    max={new Date().toISOString().split("T")[0]}
                    className={`w-full px-3 py-2 rounded-lg bg-gray-800 text-white border ${
                      errors.incidentDate ? "border-red-500" : "border-gray-600"
                    } focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-300`}
                    required
                  />
                  {errors.incidentDate && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.incidentDate}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                Incident Details
              </h2>
              <span className="text-sm text-gray-400">
                Step 2 of {totalSteps}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center text-white text-sm font-medium mb-1">
                  <FaFileAlt className="text-blue-400 mr-2" /> Description
                  <span className="text-red-400 ml-1">*</span>
                  <div className="ml-auto text-xs text-gray-400">
                    {formData.description.length}/1000
                  </div>
                </label>
                <div className="relative">
                  <textarea
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    maxLength={1000}
                    className={`w-full px-3 py-2 rounded-lg bg-gray-800 text-white border ${
                      errors.description ? "border-red-500" : "border-gray-600"
                    } focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-300`}
                    placeholder="Provide detailed information about what you witnessed"
                    required
                  ></textarea>
                  {errors.description && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Include what you saw, when it happened, and any other relevant
                  details
                </p>
              </div>

              <div>
                <label className="flex items-center text-white text-sm font-medium mb-1">
                  <FaRegUser className="text-yellow-400 mr-2" /> Suspect
                  Description
                </label>
                <div className="relative">
                  <textarea
                    name="suspectDescription"
                    rows="3"
                    value={formData.suspectDescription}
                    onChange={handleChange}
                    maxLength={500}
                    className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-yellow-400 outline-none transition-all duration-300"
                    placeholder="Describe any suspects involved (appearance, vehicles, etc.)"
                  ></textarea>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Include descriptions of people, vehicles, or other identifying
                  information
                </p>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                Evidence & Additional Info
              </h2>
              <span className="text-sm text-gray-400">
                Step 3 of {totalSteps}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center text-white text-sm font-medium mb-1">
                  <FaUpload className="text-purple-400 mr-2" /> Upload Evidence
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
                    {formData.evidence ? (
                      <FaCheck className="mr-2 text-green-400" />
                    ) : (
                      <FaCamera className="mr-2 text-purple-400" />
                    )}
                    <span className="text-white">
                      {formData.evidence
                        ? "File Selected: " +
                          formData.evidence.name.substring(0, 20) +
                          "..."
                        : "Choose Photo or Video"}
                    </span>
                  </label>
                </div>
                {previewURL && (
                  <div className="mt-3 relative">
                    <div className="bg-gray-700 p-1 rounded-lg">
                      {formData.evidence?.type.startsWith("image/") ? (
                        <img
                          src={previewURL}
                          alt="Preview"
                          className="w-full h-40 object-contain rounded-lg"
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
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Upload photos or videos related to the incident (max 20MB)
                </p>
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
                  maxLength={500}
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-300"
                  placeholder="Any other information that might be helpful"
                ></textarea>
                <p className="text-xs text-gray-400 mt-1">
                  Include any other relevant details about the incident
                </p>
              </div>

              <div className="flex items-center bg-gradient-to-r from-gray-800 to-gray-900 p-3 rounded-lg border border-gray-700 shadow-md">
                <FaLock className="text-yellow-400 mr-3 text-lg" />
                <div className="flex-1">
                  <h3 className="text-white text-sm font-medium">
                    Anonymous Submission
                  </h3>
                  <p className="text-gray-400 text-xs">
                    Your personal information will not be disclosed
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    name="isAnonymous"
                    type="checkbox"
                    checked={formData.isAnonymous}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                </label>
              </div>
            </div>
          </motion.div>
        );

      case 4: // Review step
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                Review Your Report
              </h2>
              <span className="text-sm text-gray-400">
                Step 4 of {totalSteps}
              </span>
            </div>

            <div className="space-y-4 text-white">
              <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <FaClipboardCheck className="text-emerald-400 mr-2" /> Report
                  Summary
                </h3>

                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-xs">Report Type:</span>
                    <span className="font-medium capitalize">
                      {formData.reportType || "Not specified"}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-gray-400 text-xs">
                      Incident Location:
                    </span>
                    <span className="font-medium">
                      {formData.location || "Not specified"}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-gray-400 text-xs">
                      Incident Date:
                    </span>
                    <span className="font-medium">
                      {formatDateForDisplay(formData.incidentDate) ||
                        "Not specified"}
                    </span>
                  </div>

                  <div className="border-t border-gray-700 my-2 pt-2">
                    <span className="text-gray-400 text-xs">Description:</span>
                    <p className="mt-1 text-sm">
                      {formData.description || "No description provided"}
                    </p>
                  </div>

                  {formData.suspectDescription && (
                    <div className="border-t border-gray-700 my-2 pt-2">
                      <span className="text-gray-400 text-xs">
                        Suspect Description:
                      </span>
                      <p className="mt-1 text-sm">
                        {formData.suspectDescription}
                      </p>
                    </div>
                  )}

                  {formData.additionalDetails && (
                    <div className="border-t border-gray-700 my-2 pt-2">
                      <span className="text-gray-400 text-xs">
                        Additional Details:
                      </span>
                      <p className="mt-1 text-sm">
                        {formData.additionalDetails}
                      </p>
                    </div>
                  )}

                  <div className="border-t border-gray-700 my-2 pt-2">
                    <span className="text-gray-400 text-xs">
                      Evidence Attached:
                    </span>
                    <p className="mt-1 text-sm">
                      {formData.evidence ? (
                        <span className="flex items-center">
                          <FaCheck className="text-green-500 mr-1" />
                          {formData.evidence.type.startsWith("image/")
                            ? "Image"
                            : "Video"}{" "}
                          attached
                        </span>
                      ) : (
                        "No evidence attached"
                      )}
                    </p>
                  </div>

                  <div className="flex items-center border-t border-gray-700 pt-2 mt-2">
                    <FaLock className="text-yellow-400 mr-2" />
                    <span className="text-sm">
                      {formData.isAnonymous
                        ? "Anonymous submission"
                        : "Identity will be shared with authorities"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg border border-blue-800">
                <div className="flex items-start">
                  <FaInfoCircle className="text-blue-400 mt-1 mr-2 flex-shrink-0" />
                  <p className="text-sm text-gray-300">
                    Please review your report carefully before submitting. Once
                    submitted, your report will be encrypted and shared with
                    relevant authorities.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
      {/* Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.2)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 bg-gradient-to-b from-black to-gray-900 bg-opacity-80 p-8 rounded-xl shadow-2xl max-w-md w-full backdrop-blur-sm border border-gray-800">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 mb-2">
            Report an Incident
          </h1>

          {/* Progress bar */}
          <div className="mt-4 relative">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-800">
              <motion.div
                initial={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
                animate={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-indigo-600"
                transition={{ duration: 0.5 }}
              ></motion.div>
            </div>
            <div className="flex justify-between mt-1">
              {[...Array(totalSteps)].map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      i + 1 <= step
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                        : "bg-gray-600"
                    }`}
                  />
                  <span className="text-xs text-gray-400 mt-1">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStep()}

            <div className="flex justify-between space-x-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 px-5 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 flex items-center justify-center"
                >
                  <FaArrowLeft className="mr-2" /> Back
                </button>
              )}

              {step === 1 &&
                formData.reportType &&
                localStorage.getItem("reportDraft") && (
                  <button
                    type="button"
                    onClick={clearDraft}
                    className="flex-1 px-5 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-300"
                  >
                    Clear Draft
                  </button>
                )}

              <button
                type="submit"
                className={`flex-1 px-5 py-3 ${
                  step === totalSteps
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                } text-white rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg`}
                disabled={isUploading}
              >
                {isUploading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : step === totalSteps ? (
                  <>
                    Submit Report <FaLock className="ml-2" />
                  </>
                ) : (
                  <>
                    Continue <FaArrowRight className="ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>
        </AnimatePresence>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 p-4 bg-gradient-to-r from-blue-900/50 to-indigo-900/50 rounded-lg border border-blue-800/50"
          >
            <div className="flex items-start">
              <FaShieldAlt className="text-blue-400 mt-1 mr-2 flex-shrink-0" />
              <p className="text-sm text-gray-300">
                Your report helps law enforcement combat drug trafficking. All
                information is encrypted and handled securely.
              </p>
            </div>
          </motion.div>
        )}

        {/* Help button */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <button
            type="button"
            onClick={() =>
              toast.info(
                "For emergency situations, please call 911 immediately."
              )
            }
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors"
          >
            <FaQuestion size={14} />
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && <ConfirmationModal />}
      </AnimatePresence>
    </div>
  );
}
