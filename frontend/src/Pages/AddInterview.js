import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const AddInterview = () => {
  const { userid } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    intervieweeName: "",
    intervieweeEmail: "",
    date: "",
    time: "",
    duration: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:4001/api/v1/interview-route/send/invite",
        {
          Interviewer: userid,
          name: formData.intervieweeName,
          email: formData.intervieweeEmail,
          timmings: new Date(`${formData.date}T${formData.time}`),
          duration: formData.duration,
        }
      );

      if (res.data.flag === 1 && res.status === 201) {
        toast.success("Interview added successfully!");
        navigate(`/allInterviews/${userid}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.flag_message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h2 className="text-xl font-bold mb-4">Add New Interview</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="intervieweeName"
          placeholder="Interviewee Name"
          value={formData.intervieweeName}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="email"
          name="intervieweeEmail"
          placeholder="Interviewee Email"
          value={formData.intervieweeEmail}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="number"
          name="duration"
          placeholder="Duration (in minutes)"
          value={formData.duration}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Add Interview
        </button>
      </form>
    </div>
  );
};

export default AddInterview;
