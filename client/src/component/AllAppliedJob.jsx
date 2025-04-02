import React, { useState, useEffect } from "react";
import axios from "axios";

const AllAppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]); // Store applied jobs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/apply/applications");

        console.log("API Response:", response.data); // Debugging

        if (response.data?.applications) {
          setAppliedJobs(response.data.applications);
        } else {
          setError("No job applications found.");
        }
      } catch (err) {
        console.error("Error fetching jobs:", err.message);
        setError("❌ Failed to fetch applied jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Applied Jobs</h2>

      {loading && <p className="text-center text-gray-600">🔄 Loading applied jobs...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      
      {!loading && !error && appliedJobs.length === 0 && (
        <p className="text-center text-gray-500">📌 No jobs applied yet.</p>
      )}

      {!loading && !error && appliedJobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appliedJobs.map(({ jobId }) => {
            if (!jobId) return null; // 🔥 Prevent crashes if jobId is missing
            
            return (
              <div key={jobId._id} className="border p-4 rounded-lg shadow-md bg-white">
                <h3 className="text-xl font-semibold">{jobId.title || "N/A"}</h3>
                <p className="text-gray-600"><strong>Skills:</strong> {jobId.skill || "N/A"}</p>
                <p className="text-gray-600"><strong>Experience:</strong> {jobId.experience ? `${jobId.experience} years` : "N/A"}</p>
                <p className="text-gray-600"><strong>Location:</strong> {jobId.location || "N/A"}</p>
                <p className="text-gray-600"><strong>CTC:</strong> ₹{jobId.maxCTC ? jobId.maxCTC.toLocaleString() : "N/A"}</p>
                <p className="text-gray-600"><strong>Notice Period:</strong> {jobId.noticePeriod ? `${jobId.noticePeriod} days` : "N/A"}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllAppliedJobs;
