import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const JobSeekerLogin = () => {
    const navigate = useNavigate();
    const [isSignup, setIsSignup] = useState(false);
    const [role, setRole] = useState("seeker"); 
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [message, setMessage] = useState(""); 
    const [loading, setLoading] = useState(false); 

    const backendUrl = import.meta.env.VITE_BACKEND_LINKKS || "http://localhost:3000";

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true); 

        const apiUrl = `${backendUrl}/api/auth${role === "provider" ? "provider" : ""}/${isSignup ? "signup" : "login"}`;

        try {
            const { data } = await axios.post(apiUrl, formData);
            setMessage(data.message);
            localStorage.setItem("token", data.token); 

            navigate(role === "seeker" ? "/seeker-profile" : "/recruiter-profile");
        } catch (error) {
            setMessage(error.response?.data?.message || "Something went wrong");
            console.error("Login/Signup Error:", error);
        } finally {
            setLoading(false); // ✅ Stop loading
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            {/* Role Selection (Job Seeker / Job Provider) */}
            <div className="flex gap-4 mb-4">
                <button
                    className={`px-4 py-2 rounded ${role === "seeker" ? "bg-blue-500 text-white" : "bg-white text-black border"}`}
                    onClick={() => setRole("seeker")}
                >
                    Job Seeker
                </button>
                <button
                    className={`px-4 py-2 rounded ${role === "provider" ? "bg-blue-500 text-white" : "bg-white text-black border"}`}
                    onClick={() => setRole("provider")}
                >
                    Job Provider
                </button>
            </div>

            {/* Authentication Form */}
            <h2 className="text-2xl font-bold mb-4">
                {isSignup ? "Sign Up" : "Login"} as {role === "seeker" ? "Job Seeker" : "Job Provider"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
                {/* Show Name Input ONLY for Signup */}
                {isSignup && (
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        className="border p-2"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                )}

                <input type="email" name="email" placeholder="Email" className="border p-2" value={formData.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" className="border p-2" value={formData.password} onChange={handleChange} required />

                {/* ✅ Submit Button with Loading State */}
                <button
                    type="submit"
                    className={`text-white px-4 py-2 rounded ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                    disabled={loading} // ✅ Disable while loading
                >
                    {loading ? (isSignup ? "Signing Up..." : "Logging In...") : isSignup ? "Sign Up" : "Login"}
                </button>
            </form>

            {/* Show Response Message */}
            {message && <p className="mt-3 text-red-500">{message}</p>}

            {/* Toggle Login/Signup */}
            <p className="text-blue-500 cursor-pointer mt-3" onClick={() => setIsSignup(!isSignup)}>
                {isSignup ? "Already have an account? Login" : "New user? Sign Up"}
            </p>
        </div>
    );
};

export default JobSeekerLogin;
