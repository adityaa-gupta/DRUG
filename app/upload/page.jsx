"use client";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase/Config";

const bulkUploadReports = async () => {
  // JSON data
const reports=  [
    {
      "id": "1",
      "reportType": "drug trafficking",
      "description": "Suspicious packages exchanged near the docks.",
      "location": "Portside Avenue, New Orleans",
      "evidence": "https://example.com/evidence1.jpg",
      "isAnonymous": true,
      "status": "pending",
      "timestamp": "2024-12-01T09:00:00Z"
    },
    {
      "id": "2",
      "reportType": "illegal possession",
      "description": "Person seen with illegal substances in the subway.",
      "location": "Downtown Station, Chicago",
      "evidence": null,
      "isAnonymous": false,
      "status": "processing",
      "timestamp": "2024-12-02T11:30:00Z"
    },
    {
      "id": "3",
      "reportType": "suspicious activity",
      "description": "Frequent deliveries to an abandoned warehouse.",
      "location": "456 Industrial Road, Houston",
      "evidence": "https://example.com/evidence3.mp4",
      "isAnonymous": true,
      "status": "solved",
      "timestamp": "2024-12-03T14:20:00Z"
    },
    {
      "id": "4",
      "reportType": "drug trafficking",
      "description": "Late-night vehicle exchanges observed.",
      "location": "789 Oak Lane, Denver",
      "evidence": "https://example.com/evidence4.jpg",
      "isAnonymous": false,
      "status": "pending",
      "timestamp": "2024-12-04T20:10:00Z"
    },
    {
      "id": "5",
      "reportType": "illegal possession",
      "description": "Teenager seen with banned items on school grounds.",
      "location": "Central High School, Los Angeles",
      "evidence": null,
      "isAnonymous": true,
      "status": "solved",
      "timestamp": "2024-12-05T08:00:00Z"
    },
    {
      "id": "6",
      "reportType": "suspicious activity",
      "description": "Unmarked vehicles parked outside a hotel for hours.",
      "location": "Luxury Suites, Miami",
      "evidence": "https://example.com/evidence6.mp4",
      "isAnonymous": false,
      "status": "processing",
      "timestamp": "2024-12-06T18:30:00Z"
    },
    {
      "id": "7",
      "reportType": "drug trafficking",
      "description": "Illegal substances sold in a public restroom.",
      "location": "City Mall, Atlanta",
      "evidence": null,
      "isAnonymous": true,
      "status": "pending",
      "timestamp": "2024-12-07T15:40:00Z"
    },
    {
      "id": "8",
      "reportType": "suspicious activity",
      "description": "Large crowds gathering with suspicious behavior.",
      "location": "Empty Lot, San Francisco",
      "evidence": "https://example.com/evidence8.jpg",
      "isAnonymous": false,
      "status": "solved",
      "timestamp": "2024-12-08T17:10:00Z"
    },
    {
      "id": "9",
      "reportType": "illegal possession",
      "description": "Items openly displayed in a market stall.",
      "location": "Marketplace, Dallas",
      "evidence": "https://example.com/evidence9.jpg",
      "isAnonymous": true,
      "status": "processing",
      "timestamp": "2024-12-09T12:20:00Z"
    },
    {
      "id": "10",
      "reportType": "drug trafficking",
      "description": "Frequent visits to a suspicious building.",
      "location": "Old Factory, Seattle",
      "evidence": null,
      "isAnonymous": false,
      "status": "pending",
      "timestamp": "2024-12-10T13:10:00Z"
    },
    {
      "id": "11",
      "reportType": "illegal possession",
      "description": "Person seen with suspicious bags near a park.",
      "location": "Riverside Park, New York",
      "evidence": "https://example.com/evidence11.jpg",
      "isAnonymous": true,
      "status": "solved",
      "timestamp": "2024-12-01T14:40:00Z"
    },
    {
      "id": "12",
      "reportType": "drug trafficking",
      "description": "Night deliveries to a local store.",
      "location": "Main Street Grocery, San Diego",
      "evidence": null,
      "isAnonymous": false,
      "status": "processing",
      "timestamp": "2024-12-02T22:10:00Z"
    },
    {
      "id": "13",
      "reportType": "suspicious activity",
      "description": "Unmarked vans arriving at random intervals.",
      "location": "Sunset Boulevard, Hollywood",
      "evidence": "https://example.com/evidence13.mp4",
      "isAnonymous": true,
      "status": "pending",
      "timestamp": "2024-12-03T08:15:00Z"
    },
    {
      "id": "14",
      "reportType": "illegal possession",
      "description": "Illegal items carried by delivery personnel.",
      "location": "456 Courier Lane, Phoenix",
      "evidence": null,
      "isAnonymous": false,
      "status": "pending",
      "timestamp": "2024-12-04T11:50:00Z"
    },
    {
      "id": "15",
      "reportType": "drug trafficking",
      "description": "Packages exchanged at a highway rest stop.",
      "location": "Route 66, Oklahoma City",
      "evidence": "https://example.com/evidence15.jpg",
      "isAnonymous": true,
      "status": "solved",
      "timestamp": "2024-12-05T19:25:00Z"
    },
    {
      "id": "16",
      "reportType": "suspicious activity",
      "description": "Frequent gatherings at an abandoned property.",
      "location": "Elm Street, Denver",
      "evidence": null,
      "isAnonymous": true,
      "status": "pending",
      "timestamp": "2024-12-06T16:30:00Z"
    },
    {
      "id": "17",
      "reportType": "drug trafficking",
      "description": "Vehicles meeting and exchanging packages.",
      "location": "Maple Avenue, Boston",
      "evidence": "https://example.com/evidence17.jpg",
      "isAnonymous": false,
      "status": "processing",
      "timestamp": "2024-12-07T13:20:00Z"
    },
    {
      "id": "18",
      "reportType": "illegal possession",
      "description": "Illegal substances found near a construction site.",
      "location": "789 Builder's Road, Houston",
      "evidence": null,
      "isAnonymous": true,
      "status": "solved",
      "timestamp": "2024-12-08T10:50:00Z"
    },
    {
      "id": "19",
      "reportType": "suspicious activity",
      "description": "Unusual activity near a power station.",
      "location": "123 Power Avenue, Chicago",
      "evidence": "https://example.com/evidence19.mp4",
      "isAnonymous": true,
      "status": "pending",
      "timestamp": "2024-12-09T09:10:00Z"
    },
    {
      "id": "20",
      "reportType": "drug trafficking",
      "description": "Frequent deliveries to a residence known for suspicious activity.",
      "location": "789 Residential Road, Miami",
      "evidence": "https://example.com/evidence20.jpg",
      "isAnonymous": false,
      "status": "pending",
      "timestamp": "2024-12-10T20:15:00Z"
    }
  ]
  

  try {
    const collectionRef = collection(db, "reports"); // Reference to the "reports" collection

    // Iterate over each report and upload it
    for (const report of reports) {
      const docRef = await addDoc(collectionRef, report);
      console.log(`Report added with ID: ${docRef.id}`);
    }

    alert("All reports have been successfully uploaded!");
  } catch (error) {
    console.error("Error uploading reports: ", error);
    alert("An error occurred while uploading reports.");
  }
};

export default function BulkUploader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">
      <button
        onClick={bulkUploadReports}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Upload Reports
      </button>
    </div>
  );
}
import React from 'react'

