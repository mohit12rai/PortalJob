import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MyContext from "./context/ContextApi";

const RecruiterProfile = () => {
  const navigate = useNavigate();
  const {value, setValue}=useContext(MyContext)

  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [profileData, setProfileData] = useState({
    name: "",
    company: "",
    email: "",
    mobile: "",
  });
 console.log("value=",value)
  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const { data } = await axios.post("http://localhost:3000/api/recruiter/recruiterjob", profileData, {
        headers: { "Content-Type": "application/json" }, // ✅ Ensure JSON headers
      });

      setMessage("✅ Profile Created Successfully!");
      setProfileData({ name: "", company: "", email: "", mobile: "" });
      setShowForm(false);
      console.log("data=",data)
      setValue(data.recruiter._id)
      console.log(data.recruiter._id)
      setTimeout(() => navigate(`/profil-provider/${data.recruiter._id}`), 1500); // ✅ Redirect using the returned recruiterId
     
    } catch (error) {
      console.error("Profile Creation Error:", error.response?.data || error.message);
      setMessage(`❌ Error: ${error.response?.data?.error || "Failed to create profile."}`);
    }
  };
 
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-6">Recruiter Dashboard</h2>

      <div className="flex gap-4 mb-6">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setShowForm(true)}>
          Create Profile
        </button>
        <button onClick={() => navigate(`/allrecruiter`)} className="bg-green-500 text-white px-4 py-2 rounded">
          Find Profiles
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded w-96">
          <h3 className="text-lg font-bold mb-4">Create Recruiter Profile</h3>

          <input type="text" name="name" placeholder="Name" value={profileData.name} onChange={handleChange} className="border p-2 w-full mb-3" required />

          <input type="text" name="company" placeholder="Company" value={profileData.company} onChange={handleChange} className="border p-2 w-full mb-3" required />

          <input type="email" name="email" placeholder="Email" value={profileData.email} onChange={handleChange} className="border p-2 w-full mb-3" required />

          <input type="text" name="mobile" placeholder="Mobile" value={profileData.mobile} onChange={handleChange} className="border p-2 w-full mb-3" required />

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
            Save Profile
          </button>
        </form>
      )}

      {message && <p className="mt-4 text-center font-semibold">{message}</p>}
    </div>
  );
};

export default RecruiterProfile;
