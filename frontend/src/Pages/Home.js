import React from 'react'
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [role,setrole]  = useState('interviewer');
   const navigate = useNavigate();
   const continueBtn = () => {
       if(role === "interviewer")
       {
           navigate('/interviewer/form');
       }else {
           navigate('/check/User');
       }
   } 
  return (
    <div className="flex flex-col items-center p-1 gap-1">
    <h1 className="text-black text-2xl font-bold">Interview Time !!!</h1>
        <div className="flex justify-evenly gap-10 mt-8 cursor-pointer">
            <div onClick={ () => setrole('interviewer')} className={`flex flex-col rounded-md ${role === "interviewer" ? "border-2 border-green-500 p-5"  : "border-2 border-black p-5"}`}>
                     <p className="text-grayDark text-lg font-bold" > I'am a Interviewer</p>
            </div>
            <div onClick={() => setrole('interviewee')} className={`flex flex-col rounded-md ${role === "interviewee" ? "border-2 border-green-500 p-5"  : "border-2 border-black p-5"}`}>
                    <p className="text-grayDark text-lg font-bold">I'am a Interviewee</p>
            </div>
        </div>
        <p onClick={continueBtn} className="text-center border-2 border-black bg-green-500 text-white font-bold rounded-full w-32 mt-8 p-3 cursor-pointer transition-all duration-200 hover:scale-90">Continue</p>
    </div>
  )
}

export default Home