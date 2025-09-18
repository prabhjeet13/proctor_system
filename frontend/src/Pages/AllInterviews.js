import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const AllInterviews = () => {
  const { userid } = useParams(); 
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [role, setRole] = useState(null);

  useEffect(() => {
   
    const storedRole = localStorage.getItem("Role");
    if (storedRole) {
      setRole(storedRole);
    }

    const fetchInterviews = async () => {
      try {
        const res = await axios.post(
          "http://localhost:4001/api/v1/interview-route/get/all/interviews",
          { userId: userid }
        );

        if (res.data.flag === 1 && res.status === 200) {
          setInterviews(res.data.userdata.interviews || []); 
        } 
      } catch (err) {
        toast.error(err.response?.data?.flag_message || "something went wrong");
      } 
    };

    fetchInterviews();
  }, [userid]);

  const handleSendInvite = () => {
    navigate(`/send-invite/${userid}`); 
  };

  const handleCardClick = (interview) => {
    const now = new Date();
    const interviewTime = new Date(interview.timmings);
    if (interview.isCompeleted) {
       navigate(`/logs/${interview._id}`);
    }else if(interviewTime <= now){
        const diff = Math.floor((now - interviewTime)/(1000*60));
        if(diff > 10 && role === 'interviewee')
        {
                   toast.error('You are late!');
        } else {
                navigate(`/interview/enter/${interview._id}`);
        }
    }else {
       toast.error('interview yet to start');
    }
  };

  return (
    <div className="p-6 border rounded-md shadow-md w-full bg-white">
      <div className="flex justify-between items-center mb-6 gap-10">
        <h2 className="text-2xl font-bold text-gray-800">Interview List</h2>

        {role === "interviewer" && (
          <button
            onClick={handleSendInvite}
            className="bg-blue-500 text-white font-semibold py-1 px-3 text-sm rounded hover:bg-blue-600 transition"
          >
            ADD
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {interviews.length > 0 ? (
          interviews.map((interview) => (
            <div
              key={interview._id}
              onClick={() => handleCardClick(interview)}
              className="border p-4 rounded-lg shadow hover:shadow-lg transition duration-200 bg-gray-50 cursor-pointer"
            >
              <p className="mb-1">
                <strong>Interviewer:</strong> {interview.interviewer.name}
              </p>
              <p className="mb-1">
                <strong>Interviewee:</strong> {interview.interviewee.name}
              </p>
              <p className="mb-1">
                <strong>Duration:</strong> {interview.duration} mins 
              </p>
              <p className="mb-1">
                <strong>Timings:</strong>{" "}
                {new Date(interview.timmings).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No interviews found</p>
        )}
      </div>
    </div>
  );
};

export default AllInterviews;
