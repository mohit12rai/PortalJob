import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JobConnector() {
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate(); // For navigation


  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-700 rounded-2xl p-6">
    {/* Job Connector Button */}
    <button
      className="bg-white text-black font-semibold px-6 py-2 rounded-lg shadow-md mb-6"
      onClick={() => setShowOptions(!showOptions)}
    >
      JOB Connector
    </button>

    {/* Job Seeker & Job Provider Buttons */}
    {showOptions && (
      <div className="flex gap-6">
        <button
          className="bg-white text-black font-semibold px-6 py-2 rounded-lg shadow-md"
          onClick={() => navigate("/jobseeker-login")} // Navigate to Job Seeker Login
        >
          Select For Seeker or Provider
        </button>
       
      </div>
    )}
  </div>
  );
}
