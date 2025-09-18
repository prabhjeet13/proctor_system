import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
const Logs = () => {
  const { interviewid } = useParams();
  const [logs, setLogs] = useState([]);
  const [interview, setInterview] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.post(
          "http://localhost:4001/api/v1/interview-route/get/interviewlogs",
          { InterviewId: interviewid }
        );

        if (res.data.flag === 1 && res.status === 200) {
          setInterview(res.data.interview);
          setLogs(res.data.interview.events || []);
        }
      } catch (err) {
        toast.error(err.response?.data?.flag_message || "Something went wrong");
      }
    };

    fetchLogs();
  }, [interviewid]);

const downloadPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Interview Logs Report", 14, 15);

  if (interview) {
    doc.setFontSize(12);
    doc.text(`Interviewer: ${interview.interviewer?.name || "N/A"}`, 14, 30);
    doc.text(`Interviewee: ${interview.interviewee?.name || "N/A"}`, 14, 40);
    doc.text(`Duration: ${interview.duration || "N/A"} mins`, 14, 50);
    doc.text(
      `Timings: ${
        interview.timmings
          ? new Date(interview.timmings).toLocaleString()
          : "N/A"
      }`,
      14,
      60
    );
    doc.text(
      `Total Score: ${
        interview.finalScore !== undefined ? interview.finalScore : "Not Scored"
      }`,
      14,
      70
    );
  }

  if (logs.length > 0) {
    const tableData = logs.map((e, i) => [
      i + 1,
      e.type || "N/A",
      e.time ? new Date(e.time).toLocaleString() : "N/A",
    ]);

    autoTable(doc, {
      head: [["#", "Action", "Timestamp"]],
      body: tableData,
      startY: 90,
    });
  } else {
    doc.text("No events logged", 14, 90);
  }

  doc.save("InterviewLogs.pdf");
};
 

  return (
    <div className="p-6 bg-white rounded-md shadow-md w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Interview Logs</h2>

      
      <button
        onClick={downloadPDF}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
      >
        Download PDF
      </button>

      
      {interview && (
        <div className="mb-6 border rounded-md p-4 bg-gray-50 shadow-sm">
          <p className="mb-1">
            <strong>Interviewer:</strong> {interview.interviewer?.name}
          </p>
          <p className="mb-1">
            <strong>Interviewee:</strong> {interview.interviewee?.name}
          </p>
          <p className="mb-1">
            <strong>Duration:</strong> {interview.duration} mins
          </p>
          <p className="mb-1">
            <strong>Timings:</strong>{" "}
            {new Date(interview.timmings).toLocaleString()}
          </p>
          <p className="mb-1">
            <strong>Total Score:</strong>{" "}
            {interview.finalScore !== undefined
              ? interview.finalScore
              : "Not Scored"}
          </p>
        </div>
      )}

      {interview?.recording ? (
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">Interview Recording</h3>
          <video
            src={interview.recording}
            controls
            className="w-full max-w-2xl rounded-md shadow"
          />
        </div>
      ) : (
        <p className="text-gray-500 mb-6">No recording available</p>
      )}

      {/* Events Section */}
      <h3 className="font-semibold text-lg mb-2">Events</h3>
      <div className="space-y-3">
        {logs.length > 0 ? (
          logs.map((event, index) => (
            <div
              key={index}
              className="border rounded-md p-3 bg-gray-50 shadow-sm"
            >
              <p className="text-sm text-gray-700">
                <strong>Action:</strong> {event.type}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Timestamp:</strong>{" "}
                {new Date(event.time).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No events logged</p>
        )}
      </div>
    </div>
  );
};

export default Logs;
