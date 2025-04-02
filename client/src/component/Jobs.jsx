import React, { useState, useEffect } from "react";
import axios from "axios";

const Jobs = () => {
  const [allJobs, setAllJobs] = useState([]); // ✅ Store total jobs
  const [jobs, setJobs] = useState([]); // ✅ Jobs after filtering
  const [loading, setLoading] = useState(true);
  const [applyingJobId, setApplyingJobId] = useState(null); // ✅ Track which job is being applied to
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Get candidate ID from token
  const token = localStorage.getItem("token");
  const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const candidateId = decodedToken?.id || null;

  useEffect(() => {
    fetchAllJobs();
  }, []);

  const fetchAllJobs = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get("http://localhost:3000/api/job/allJobs");

      const jobsData = response.data.jobs || response.data.recruiters || [];
      setAllJobs(jobsData); // ✅ Store all jobs initially
      setJobs(jobsData); // ✅ Show all jobs before filtering
    } catch (err) {
      setError("Failed to fetch jobs.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Filters
  const [filters, setFilters] = useState({
    skill: "",
    experience: "",
    location: "",
  });

  // ✅ Apply Filters
  const applyFilters = () => {
    let filtered = allJobs;

    if (filters.skill) {
      filtered = filtered.filter((job) => job.skill.toLowerCase().includes(filters.skill.toLowerCase()));
    }
    if (filters.experience) {
      filtered = filtered.filter((job) => job.experience === Number(filters.experience));
    }
    if (filters.location) {
      filtered = filtered.filter((job) => job.location.toLowerCase().includes(filters.location.toLowerCase()));
    }

    setJobs(filtered);
  };

  // ✅ Reset Filters
  const resetFilters = () => {
    setFilters({ skill: "", experience: "", location: "" });
    setJobs(allJobs); // ✅ Reset to show all jobs
  };

  // ✅ Apply for Job Function
  const handleApply = async (jobId) => {
    if (!candidateId) {
      setMessage("❌ You must be logged in to apply.");
      return;
    }

    setApplyingJobId(jobId); // ✅ Start loading

    try {
      setMessage(""); // Reset message

      await axios.post(
        "http://localhost:3000/api/apply/applications",
        { candidateId, jobId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("✅ Successfully applied for the job!");
    } catch (error) {
      console.error("Application Error:", error.response?.data || error.message);
      setMessage(`❌ ${error.response?.data?.message || "Failed to apply for the job."}`);
    } finally {
      setApplyingJobId(null); // ✅ End loading
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">All Jobs</h2>

      {/* ✅ Show total jobs before filtering */}
      <p className="text-center text-gray-700 font-semibold mb-4">
        Total Jobs: {allJobs.length}
      </p>

      {loading && <p className="text-center text-gray-600">Loading jobs...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {message && <p className="text-center text-blue-600 font-semibold">{message}</p>}

      {/* ✅ Search Filters */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <select name="skill" value={filters.skill} onChange={(e) => setFilters({ ...filters, skill: e.target.value })} className="border p-2 rounded">
          <option value="">Select Skill</option>
          <option value="Nodejs">Node.js</option>
          <option value="React">React</option>
          <option value="Python">Python</option>
          <option value="Java">Java</option>
        </select>

        <select name="experience" value={filters.experience} onChange={(e) => setFilters({ ...filters, experience: e.target.value })} className="border p-2 rounded">
          <option value="">Experience</option>
          <option value="1">1 Year</option>
          <option value="2">2 Years</option>
          <option value="3">3 Years</option>
          <option value="4">4+ Years</option>
        </select>

        <select name="location" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} className="border p-2 rounded">
          <option value="">Select Location</option>
          <option value="Delhi">Delhi</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Mumbai">Mumbai</option>
        </select>

        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={applyFilters}>
          🔍 Search Jobs
        </button>

        <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={resetFilters}>
          🔄 Reset Filters
        </button>
      </div>

      {/* ✅ Show Jobs */}
      {!loading && jobs.length === 0 && <p className="text-center text-gray-500">No jobs found.</p>}

      {!loading && jobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job._id} className="border p-4 rounded-lg shadow-md bg-white">
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p className="text-gray-600"><strong>Skills:</strong> {job.skill}</p>
              <p className="text-gray-600"><strong>Experience:</strong> {job.experience} years</p>
              <p className="text-gray-600"><strong>Location:</strong> {job.location}</p>
              <p className="text-gray-600"><strong>CTC:</strong> ₹{job.maxCTC?.toLocaleString()}</p>
              <p className="text-gray-600"><strong>Notice Period:</strong> {job.noticePeriod} days</p>

              {/* ✅ Apply Button with Loading */}
              <button
                className={`mt-4 text-white px-4 py-2 rounded w-full ${
                  applyingJobId === job._id ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                }`}
                onClick={() => handleApply(job._id)}
                disabled={applyingJobId === job._id} // ✅ Disable while applying
              >
                {applyingJobId === job._id ? "Applying..." : "Apply Now"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
