import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MyContext from "./context/ContextApi";

const ProviderProfile = () => {
  const {value,setValue}=useContext(MyContext)
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [recruiterId, setRecruiterId] = useState(null);
  const [jobData, setJobData] = useState({
    title: "",
    skill: "",
    experience: "",
    location: "",
    maxCTC: "",
    noticePeriod: "",
  });
  console.log("provider Value=",value)
  // ✅ Fetch recruiter ID from API
  // useEffect(() => {
  //   const fetchRecruiterId = async () => {
  //     try {
  //       console.log("Fetching recruiter ID...");
        
  //       const response = await axios.post(
  //         "http://localhost:3000/api/recruiter/recruiterjob",
  //         {}, // Ensure request body is correct
  //         {
  //           headers: { "Content-Type": "application/json" },
  //         }
  //       );

  //       console.log("API Response:", response.data); // Debugging

  //       if (response.data && response.data.recruiter && response.data.recruiter._id) {
  //         setRecruiterId(value);
  //         console.log("Recruiter ID Set:", value);
  //       } else {
  //         console.error("❌ Recruiter ID not found in API response.");
  //         setMessage("❌ Error: Recruiter ID not found.");
  //       }
  //     } catch (error) {
  //       console.error("❌ Error fetching recruiter ID:", error.response?.data || error.message);
  //       setMessage("❌ Error: Could not fetch recruiter ID.");
  //     }
  //   };

  //   fetchRecruiterId();
  // }, []);

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!value) {
      console.error("❌ recruiterId is null or undefined!");
      setMessage("❌ Recruiter ID is missing! Please refresh the page.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/api/job/${value}`,
        { ...jobData, value },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Job Created:", response.data);

      setMessage("✅ Job Created Successfully!");
      setJobData({ title: "", skill: "", experience: "", location: "", maxCTC: "", noticePeriod: "" });
      setShowForm(false);
      // setTimeout(() => navigate(`/profile-provider/${value}`), 1500);
    } catch (error) {
      console.error("Job Posting Error:", error.response?.data || error.message);
      setMessage(`❌ Error: ${error.response?.data?.message || "Failed to create job."}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-6">Job Provider Dashboard</h2>

      <div className="flex gap-4 mb-6">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setShowForm(true)}>
          Create Job
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => navigate(`/job-list/${value}`)}>
          Find Jobs
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded w-96">
          <h3 className="text-lg font-bold mb-4">Create a Job</h3>

          <input type="text" name="title" placeholder="Title" value={jobData.title} onChange={handleChange} className="border p-2 w-full mb-3" required />

          <input type="text" name="skill" placeholder="Skill" value={jobData.skill} onChange={handleChange} className="border p-2 w-full mb-3" required />

          <input type="number" name="experience" placeholder="Experience (Years)" value={jobData.experience} onChange={handleChange} className="border p-2 w-full mb-3" required />

          <input type="text" name="location" placeholder="Location" value={jobData.location} onChange={handleChange} className="border p-2 w-full mb-3" required />

          <input type="number" name="maxCTC" placeholder="Max CTC (LPA)" value={jobData.maxCTC} onChange={handleChange} className="border p-2 w-full mb-3" required />

          <input type="number" name="noticePeriod" placeholder="Notice Period (Days)" value={jobData.noticePeriod} onChange={handleChange} className="border p-2 w-full mb-3" required />

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
            Post Job
          </button>
        </form>
      )}

      {message && <p className="mt-4 text-center font-semibold">{message}</p>}
    </div>
  );
};

export default ProviderProfile;
