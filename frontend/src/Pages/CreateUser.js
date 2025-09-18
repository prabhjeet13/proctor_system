import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const CreateUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://proctor-system.onrender.com/api/v1/user-route/create/user", {
        name,
        email,
      });
      console.log(response);
      if(response.data.flag === 1 && response.status === 201)
      {
         toast.success(response.data.flag_message);
         navigate("/check/User")
      }

    } catch (err) {
        toast.error(err.response.data.flag_message || 'something went wrong');
    }
  };

  const handleLoginRedirect = () => {
    navigate("/check/User")
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-80"
      >
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="bg-green-500 text-white font-semibold py-2 rounded hover:bg-green-600 transition"
        >
          Create User
        </button>
      </form>

      <span
        onClick={handleLoginRedirect}
        className="mt-4 text-blue-500 cursor-pointer hover:underline"
      >
        Already have an account? Login
      </span>
    </div>
  );
};

export default CreateUser;
