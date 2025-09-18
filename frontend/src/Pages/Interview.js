import axios from "axios";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

const Interview = () => {
  const { interviewid } = useParams();
  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [events, setEvents] = useState([]);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);
  const detectionInterval = useRef(null);
  const faceMissingStart = useRef(null);
  const faceModelRef = useRef(null);
  const objectModelRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        faceModelRef.current = await blazeface.load();
        objectModelRef.current = await cocoSsd.load();
        if (mounted) {
          setModelsLoaded(true);
          console.log("BlazeFace and COCO-SSD loaded");
        }
      } catch (err) {
        console.error("Model load error:", err);
        toast.error("Failed to load detection models");
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const turnOnCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      videoRef.current.srcObject = stream;

      videoRef.current.play().catch(()=>{});
      setCameraOn(true);
      toast.success("Camera is on");
    } catch (err) {
      toast.error("Please allow camera access");
      setCameraOn(false);
    }
  };

  const turnOffCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => { if (t.kind === "video") t.stop(); });
      videoRef.current.srcObject = null;
    }
    setCameraOn(false);
    toast.success("Camera is off");
  };

  const turnOnMic = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      if (videoRef.current?.srcObject) {
        const vs = videoRef.current.srcObject;
      
        vs.getAudioTracks().forEach((t) => t.stop());
        audioStream.getAudioTracks().forEach((t) => vs.addTrack(t));
      } else {
      
        videoRef.current.srcObject = audioStream;
      }
      setMicOn(true);
      toast.success("Microphone is on");
    } catch (err) {
      toast.error("Please allow microphone access");
      setMicOn(false);
    }
  };

  const turnOffMic = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => { if (t.kind === "audio") t.stop(); });
    }
    setMicOn(false);
    toast.success("Microphone is off");
  };

const detectEvents = async () => {
  try {
    const video = videoRef.current;
    if (!video || !modelsLoaded || !faceModelRef.current || !objectModelRef.current) return;
    if (video.readyState < 2) return;

    const now = new Date();
    const faces = await faceModelRef.current.estimateFaces(video, false);

    if (!faces || faces.length === 0) {
      if (!faceMissingStart.current) {
        faceMissingStart.current = Date.now();
      } else if (Date.now() - faceMissingStart.current > 10000) {
        setEvents((prev) => [
          ...prev,
          { time: now.toISOString(), type: "No face detected > 10s" },
        ]);
        faceMissingStart.current = null;
      }
    } else {
      faceMissingStart.current = null;
    }

    const predictions = await objectModelRef.current.detect(video);
    predictions.forEach((obj) => {
      if (!obj.class || !obj.score) return;
      if (obj.score < 0.6) return;
      const cls = obj.class.toLowerCase();

      if (cls.includes("cell phone") || cls === "phone") {
        setEvents((prev) => [
          ...prev,
          { time: now.toISOString(), type: "Mobile Phone detected" },
        ]);
      } else if (cls.includes("book")) {
        setEvents((prev) => [
          ...prev,
          { time: now.toISOString(), type: "Book / Notes detected" },
        ]);
      } else if (cls.includes("laptop") || cls.includes("keyboard") || cls.includes("mouse")) {
        setEvents((prev) => [
          ...prev,
          { time: now.toISOString(), type: "Extra electronic device detected" },
        ]);
      }
    });
    console.log("Faces:", faces.length, "Objects:", predictions.map(p => p.class));
  } catch (err) {
    console.error("Detection error:", err);
  }
};


  const startInterview = async () => {
    if (!cameraOn || !micOn) {
      toast.error("Camera and Microphone must be on to start interview");
      return;
    }
    if (!modelsLoaded) {
      toast.error("Detection models not loaded yet");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:4001/api/v1/interview-route/start/Interview",
        { InterviewId: interviewid }
      );

      if (res.data.flag === 1 && res.status === 200) {
        // reuse existing stream from videoRef if available
        let stream = videoRef.current?.srcObject;
        if (!stream) {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          videoRef.current.srcObject = stream;
        }

        // reset recordedChunks for fresh recording
        recordedChunks.current = [];

        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "video/webm" });
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) recordedChunks.current.push(event.data);
        };
        mediaRecorderRef.current.start(1000); // optional timeslice

        setIsInterviewStarted(true);

        detectionInterval.current = setInterval(detectEvents, 4000); // check every 2s

        toast.success("Interview started");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error starting interview");
    }
  };

  const endInterview = async () => {
    const tid = toast.loading("kindly wait for keeping log of video");
    clearInterval(detectionInterval.current);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      const stopped = new Promise((resolve) => {
        mediaRecorderRef.current.onstop = resolve;
      });
      mediaRecorderRef.current.stop();
      await stopped;
    }

    const blob = new Blob(recordedChunks.current, { type: "video/webm" });
    console.log("Blob size before upload:", blob.size);
    if (blob.size === 0) {
      toast.error("Recording failed, file is empty");
      return;
    }

    const file = new File([blob], "interview.webm", { type: "video/webm" });
    const formData = new FormData();
    formData.append("video", file);
    formData.append("InterviewId", interviewid);
    formData.append("events", JSON.stringify(events)); 

    try {
      const res = await axios.post(
        "http://localhost:4001/api/v1/interview-route/complete/Interview",
        formData
      );

      if (res.data.flag === 1) {
        toast.success("Interview completed successfully!");
        turnOffCamera();
        turnOffMic();
        toast.dismiss(tid);
        const Id = localStorage.getItem("Id");
        navigate(`/allInterviews/${Id}`);
      } else {
        toast.error(res.data.flag_message || "Server rejected upload");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.flag_message || "Something went wrong");
    }

    // reset
    setIsInterviewStarted(false);
    setEvents([]);
    recordedChunks.current = [];

    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraOn(false);
    setMicOn(false);
  };


  useEffect(() => {
    return () => {
      clearInterval(detectionInterval.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        try { mediaRecorderRef.current.stop(); } catch {}
      }
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return (
    <div className="p-6">
      {!isInterviewStarted && (
        <div className="flex gap-4 mb-4">
          <button
            onClick={cameraOn ? turnOffCamera : turnOnCamera}
            className={`px-3 py-1 rounded ${cameraOn ? "bg-red-500 text-white" : "bg-gray-300"}`}
          >
            {cameraOn ? "Turn Off Camera" : "Turn On Camera"}
          </button>

          <button
            onClick={micOn ? turnOffMic : turnOnMic}
            className={`px-3 py-1 rounded ${micOn ? "bg-red-500 text-white" : "bg-gray-300"}`}
          >
            {micOn ? "Turn Off Microphone" : "Turn On Microphone"}
          </button>
        </div>
      )}

      <button
        onClick={isInterviewStarted ? endInterview : startInterview}
        className={`px-4 py-2 rounded ${isInterviewStarted ? "bg-red-500 text-white" : "bg-blue-500 text-white"}`}
      >
        {isInterviewStarted ? "End Interview" : "Start Interview"}
      </button>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted 
        className="mt-4 border rounded w-full max-w-lg"
      />

      {events.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold">Detected Events:</h3>
          <ul className="list-disc ml-5">
            {events.map((e, i) => (
              <li key={i}>
                {e.time}: {e.type}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Interview;
