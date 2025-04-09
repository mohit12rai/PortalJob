import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MyContext from "./context/ContextApi";

const ProviderProfile = () => {
  const { value } = useContext(MyContext); // recruiterId from context
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [jobData, setJobData] = useState({
    title: "",
    skill: "", // comma-separated string
    experience: "",
    location: "",
    maxCTC: "",
    noticePeriod: "",
  });

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!value) {
      setMessage("❌ Recruiter ID is missing! Please refresh or re-login.");
      return;
    }

    try {
      // Convert skill string into an array
      const formattedJobData = {
        ...jobData,
        skill: jobData.skill.split(",").map((s) => s.trim()),
        recruiterId: value, // backend expects recruiterId
      };

      const response = await axios.post(
        `http://localhost:3000/api/jobs`,
        formattedJobData,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("✅ Job Created:", response.data);
      setMessage("✅ Job Created Successfully!");

      // Clear form and hide it
      setJobData({
        title: "",
        skill: "",
        experience: "",
        location: "",
        maxCTC: "",
        noticePeriod: "",
      });
      setShowForm(false);
    } catch (error) {
      console.error("❌ Job Posting Error:", error.response?.data || error.message);
      setMessage(`❌ Error: ${error.response?.data?.message || "Failed to create job."}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h2 className="text-2xl font-bold mb-6">Job Provider Dashboard</h2>

      <div className="flex gap-4 mb-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setShowForm(true)}
        >
          Create Job
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => navigate("/jobs")}
        >
          Find Jobs
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 shadow-md rounded w-full max-w-md"
        >
          <h3 className="text-lg font-bold mb-4">Create a Job</h3>

          <input
            type="text"
            name="title"
            placeholder="Title"
            value={jobData.title}
            onChange={handleChange}
            className="border p-2 w-full mb-3"
            required
          />

          <input
            type="text"
            name="skill"
            placeholder="Skills (comma separated)"
            value={jobData.skill}
            onChange={handleChange}
            className="border p-2 w-full mb-3"
            required
          />

          <input
            type="number"
            name="experience"
            placeholder="Experience (Years)"
            value={jobData.experience}
            onChange={handleChange}
            className="border p-2 w-full mb-3"
            required
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={jobData.location}
            onChange={handleChange}
            className="border p-2 w-full mb-3"
            required
          />

          <input
            type="number"
            name="maxCTC"
            placeholder="Max CTC (LPA)"
            value={jobData.maxCTC}
            onChange={handleChange}
            className="border p-2 w-full mb-3"
            required
          />

          <input
            type="number"
            name="noticePeriod"
            placeholder="Notice Period (Days)"
            value={jobData.noticePeriod}
            onChange={handleChange}
            className="border p-2 w-full mb-3"
            required
          />

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            Post Job
          </button>
        </form>
      )}

      {message && (
        <p className="mt-4 text-center font-semibold text-red-600">{message}</p>
      )}
    </div>
  );
};

export default ProviderProfile;