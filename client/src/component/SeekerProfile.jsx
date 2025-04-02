import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SeekerProfile = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Job seeker profile fields
  const [profileData, setProfileData] = useState({
    name: "",
    skill: "",
    location: "",
    experience: "",
    ctc: "",
    noticePeriod: "",
  });

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post("http://localhost:3000/api/user/createjob", profileData, {
        headers: { "Content-Type": "application/json" },
      });

      setMessage("✅ Profile Created Successfully!");
      setProfileData({ name: "", skill: "", location: "", experience: "", ctc: "", noticePeriod: "" });
      setShowForm(false);

      //setTimeout(() => navigate("/"), 1500); // ✅ Redirect to job list after success
    } catch (error) {
      console.error("Profile Creation Error:", error.response?.data || error.message);
      setMessage(`❌ Error: ${error.response?.data?.message || "Failed to create profile."}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-6">Job Seeker Dashboard</h2>

      <div className="flex gap-4 mb-6">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setShowForm(true)}>
          Create Profile
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => navigate("/alljobseeker")}>
          Find profile
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => navigate("/alljobs")}>
          Get Total Jobs
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => navigate("/allappliedjob")}>
          All Applied Jobs
        </button>
       
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded w-96">
          <h3 className="text-lg font-bold mb-4">Create Job Seeker Profile</h3>

          <input type="text" name="name" placeholder="Name" value={profileData.name} onChange={handleChange} className="border p-2 w-full mb-3" required />

          <input type="text" name="skill" placeholder="Skill" value={profileData.skill} onChange={handleChange} className="border p-2 w-full mb-3" required />

          <input type="text" name="location" placeholder="Location" value={profileData.location} onChange={handleChange} className="border p-2 w-full mb-3" required />

          <input type="number" name="experience" placeholder="Experience (Years)" value={profileData.experience} onChange={handleChange} className="border p-2 w-full mb-3" required />

          <input type="number" name="ctc" placeholder="Current CTC (LPA)" value={profileData.ctc} onChange={handleChange} className="border p-2 w-full mb-3" required />

          <input type="number" name="noticePeriod" placeholder="Notice Period (Days)" value={profileData.noticePeriod} onChange={handleChange} className="border p-2 w-full mb-3" required />

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
            Save Profile
          </button>
        </form>
      )}

      {message && <p className="mt-4 text-center font-semibold">{message}</p>}
    </div>
  );
};

export default SeekerProfile;
