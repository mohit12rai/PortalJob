import React, { useState, useEffect } from "react";
import axios from "axios";

const AllRecruiterFind = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedRecruiters, setExpandedRecruiters] = useState({});
  const [editRecruiter, setEditRecruiter] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const fetchRecruiters = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/recruiter");
      setRecruiters(response.data.recruiters);
    } catch (err) {
      setError("Failed to fetch recruiters.");
    } finally {
      setLoading(false);
    }
  };

  const toggleJobs = (id) => {
    setExpandedRecruiters((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recruiter?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/recruiter/${id}`);
      setRecruiters(recruiters.filter((rec) => rec._id !== id));
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  const handleEditClick = (recruiter) => {
    setEditRecruiter(recruiter);
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/recruiter/${editRecruiter._id}`, editRecruiter);
      setRecruiters(recruiters.map((rec) => (rec._id === editRecruiter._id ? editRecruiter : rec)));
      setShowModal(false);
    } catch (error) {
      console.error("Update Error:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">All Recruiters</h2>

      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="space-y-4">
          {recruiters.map((recruiter) => (
            <div key={recruiter._id} className="border p-4 rounded-lg shadow-md bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold">{recruiter.name}</h3>
                  <p className="text-gray-500">{recruiter.company}</p>
                  <p className="text-gray-500">{recruiter.email}</p>
                  <p className="text-gray-500">{recruiter.mobile}</p>
                </div>
                <div className="flex gap-2">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => toggleJobs(recruiter._id)}>
                    {expandedRecruiters[recruiter._id] ? "Hide Jobs" : "View Jobs"}
                  </button>
                  <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={() => handleEditClick(recruiter)}>
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleDelete(recruiter._id)}>
                    Delete
                  </button>
                </div>
              </div>

              {expandedRecruiters[recruiter._id] && (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold">Job Listings:</h4>
                  <ul className="mt-2 space-y-2">
                    {recruiter.jobs.map((job) => (
                      <li key={job._id} className="border p-3 rounded bg-gray-100">
                        <h5 className="text-lg font-medium">{job.title}</h5>
                        <p>Skills: {job.skill}</p>
                        <p>Experience: {job.experience} years</p>
                        <p>Location: {job.location}</p>
                        <p>CTC: ₹{job.maxCTC.toLocaleString()}</p>
                        <p>Notice Period: {job.noticePeriod} days</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && editRecruiter && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Edit Recruiter</h3>
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                name="name"
                value={editRecruiter.name}
                onChange={(e) => setEditRecruiter({ ...editRecruiter, name: e.target.value })}
                className="border p-2 w-full mb-3"
                placeholder="Name"
                required
              />
              <input
                type="text"
                name="company"
                value={editRecruiter.company}
                onChange={(e) => setEditRecruiter({ ...editRecruiter, company: e.target.value })}
                className="border p-2 w-full mb-3"
                placeholder="Company"
                required
              />
              <input
                type="email"
                name="email"
                value={editRecruiter.email}
                onChange={(e) => setEditRecruiter({ ...editRecruiter, email: e.target.value })}
                className="border p-2 w-full mb-3"
                placeholder="Email"
                required
              />
              <input
                type="text"
                name="mobile"
                value={editRecruiter.mobile}
                onChange={(e) => setEditRecruiter({ ...editRecruiter, mobile: e.target.value })}
                className="border p-2 w-full mb-3"
                placeholder="Mobile"
                required
              />
              <div className="flex justify-between">
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Update</button>
                <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllRecruiterFind;
