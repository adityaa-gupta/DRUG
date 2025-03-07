"use client";

import React from "react";
import Faq from "react-faq-component";

const FAQHelp = () => {
  const data = {
    rows: [
      {
        title: "How do I submit a report?",
        content:
          "To submit a report, go to the 'Submit a Report' page, fill in the details, and upload any evidence you have. You can choose to submit the report anonymously if you prefer.",
      },
      {
        title: "What happens after I submit a report?",
        content:
          "Your report will be reviewed by law enforcement. If necessary, they may take further action based on the evidence and information you provided.",
      },
      {
        title: "Is my identity protected when I submit a report?",
        content:
          "Yes, we prioritize your privacy. If you choose to submit anonymously, no personal information will be collected or shared.",
      },
      {
        title: "Can I track the status of my report?",
        content:
          "If you submit a report while logged in, you can track its status in the 'My Reports' section. Anonymous reports cannot be tracked.",
      },
      {
        title: "Who can see the reports I submit?",
        content:
          "Only authorized law enforcement personnel have access to your submitted reports and the attached evidence.",
      },
      {
        title: "What kind of evidence can I upload?",
        content:
          "You can upload images and videos that are relevant to your report. Ensure the file size is less than 10 MB.",
      },
      {
        title: "How do I contact support?",
        content:
          "If you face technical issues or have further questions, you can reach out to our support team at support@example.com.",
      },
    ],
  };

  const styles = {
    bgColor: "#fff",
    titleTextColor: "#1e40af", // Blue-700
    rowTitleColor: "#1e40af",
    rowContentColor: "#4b5563", // Gray-600
    arrowColor: "#1e40af",
  };

  const config = {
    animate: true,
    tabFocus: true,
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-12 text-center shadow-lg">
        <h1 className="text-4xl font-extrabold">FAQ & Help</h1>
        <p className="mt-2 text-lg">Your guide to using the Drug Trafficking Reporting System</p>
      </header>

      <main className="container mx-auto p-6 sm:p-12">
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <Faq data={data} styles={styles} config={config} />
          </div>
        </section>

        <section className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Need Further Assistance?</h2>
          <p className="text-gray-700 mb-4">
            If you have any technical issues or require additional help, feel free to contact our support team.
          </p>
          <div className="space-y-3">
            <p className="text-gray-700 font-semibold">
              Email:{" "}
              <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
                support@example.com
              </a>
            </p>
            <p className="text-gray-700 font-semibold">
              Phone:{" "}
              <a href="tel:+123456789" className="text-blue-600 hover:underline">
                +1 234 567 89
              </a>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default FAQHelp;
