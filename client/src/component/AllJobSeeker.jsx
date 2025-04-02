import React, { useState, useEffect } from "react";
import axios from "axios";

const AllJobSeeker = () => {
  const [jobSeekers, setJobSeekers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editSeeker, setEditSeeker] = useState(null);
  const [updatedData, setUpdatedData] = useState({});

  useEffect(() => {
    fetchJobSeekers();
  }, []);

  const fetchJobSeekers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/user");
      setJobSeekers(response.data);
    } catch (err) {
      setError("Failed to fetch job seekers.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/user/${id}`);
      setJobSeekers(jobSeekers.filter((seeker) => seeker._id !== id));
    } catch (err) {
      setError("Failed to delete job seeker.");
    }
  };

  const handleEdit = (seeker) => {
    setEditSeeker(seeker._id);
    setUpdatedData(seeker);
  };

  const handleChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/user/${id}`, updatedData);
      setJobSeekers(jobSeekers.map((seeker) => (seeker._id === id ? updatedData : seeker)));
      setEditSeeker(null);
    } catch (err) {
      setError("Failed to update job seeker.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">All Job Seekers</h2>

      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 shadow-md">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="border border-gray-300 p-3">Name</th>
                <th className="border border-gray-300 p-3">Skill</th>
                <th className="border border-gray-300 p-3">Location</th>
                <th className="border border-gray-300 p-3">Experience</th>
                <th className="border border-gray-300 p-3">CTC (LPA)</th>
                <th className="border border-gray-300 p-3">Notice Period</th>
                <th className="border border-gray-300 p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobSeekers.map((seeker) => (
                <tr key={seeker._id} className="hover:bg-gray-100">
                  {editSeeker === seeker._id ? (
                    <>
                      <td className="border border-gray-300 p-3">
                        <input type="text" name="name" value={updatedData.name} onChange={handleChange} className="border p-1 w-full" />
                      </td>
                      <td className="border border-gray-300 p-3">
                        <input type="text" name="skill" value={updatedData.skill} onChange={handleChange} className="border p-1 w-full" />
                      </td>
                      <td className="border border-gray-300 p-3">
                        <input type="text" name="location" value={updatedData.location} onChange={handleChange} className="border p-1 w-full" />
                      </td>
                      <td className="border border-gray-300 p-3">
                        <input type="number" name="experience" value={updatedData.experience} onChange={handleChange} className="border p-1 w-full" />
                      </td>
                      <td className="border border-gray-300 p-3">
                        <input type="number" name="ctc" value={updatedData.ctc} onChange={handleChange} className="border p-1 w-full" />
                      </td>
                      <td className="border border-gray-300 p-3">
                        <input type="number" name="noticePeriod" value={updatedData.noticePeriod} onChange={handleChange} className="border p-1 w-full" />
                      </td>
                      <td className="border border-gray-300 p-3">
                        <button className="bg-green-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleUpdate(seeker._id)}>Save</button>
                        <button className="bg-gray-500 text-white px-2 py-1 rounded" onClick={() => setEditSeeker(null)}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border border-gray-300 p-3">{seeker.name}</td>
                      <td className="border border-gray-300 p-3">{seeker.skill}</td>
                      <td className="border border-gray-300 p-3">{seeker.location}</td>
                      <td className="border border-gray-300 p-3">{seeker.experience} years</td>
                      <td className="border border-gray-300 p-3">{seeker.ctc} LPA</td>
                      <td className="border border-gray-300 p-3">{seeker.noticePeriod} days</td>
                      <td className="border border-gray-300 p-3">
                        <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleEdit(seeker)}>Edit</button>
                        <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(seeker._id)}>Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllJobSeeker;
