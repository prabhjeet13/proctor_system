import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const CheckUser = () => {
  const [email, setEmail] = useState(""); 
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4001/api/v1/user-route/check/user", {
        userName: email,
      });

      if(response.data.flag === 1 && response.status === 200)
      {
            const user = response.data.flag_message;
            if(user.role === "interviewer")
            {
                 localStorage.setItem("Id", user.id);
                 localStorage.setItem("Role", user.role);
            }else if(user.role === "interviewee"){
                localStorage.setItem("Id", user.id);
                localStorage.setItem("Role", user.role);
            }
            navigate(`/allInterviews/${user.id}`)
      }
    } catch (err) {
        toast.error(err.response.data.flag_message || 'something went wrong');
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-80"
      >
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
          className="bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default CheckUser;
