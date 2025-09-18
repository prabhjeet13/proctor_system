const User = require('../models/User');
const Interview = require('../models/Interview');
const Event = require('../models/Event');
const { uploadImageToCloudinary } = require('../utils/cloudinary');

exports.sentInvite = async (req,res) => {
    try {
        const {name,email,Interviewer,duration,timmings} = req.body;

        if(!name || !email || !Interviewer || !timmings || !duration)
        {
            return res.status(404).json({
                flag: 0,
                flag_message: 'enter all info',
            });
        }

        let newUser = await User.findOne({ email: email });

        if(!newUser) {
            newUser = await User.create({
                name: name,
                email: email,
                role: 'interviewee'
            });        
        }

        if(newUser)
        {
            
          const existingInterview = await Interview.findOne({
             interviewee: newUser._id,
            timmings: timmings   
            });

           if(existingInterview) {
                    return res.status(409).json({
                        flag: 0,
                        flag_message: 'Interviewee already has an interview at this time'
                    });
            }
        
            const IntDetail = await Interview.create({
                 interviewer: Interviewer,
                 interviewee : newUser?._id,
                 duration: duration,
                 timmings: timmings
              })
           
            newUser?.interviews.push(IntDetail._id);
            await newUser.save();
            
            await User.findByIdAndUpdate({_id: Interviewer},{
                $push: {
                    interviews: IntDetail?._id
                }
            },{new : true})
        }

        return res.status(201).json({
            flag: 1,
            flag_message: 'interview Details stored'
        })

    }catch(err) {
        return res.status(500).json({
                flag: 0,
                flag_message: err.message || 'something went wrong',
        });
    }
}

exports.getAllInterviews = async (req,res) => {
    try {

        const {userId} = req.body;

        if(!userId)
        {
            return res.status(404).json({
                flag: 0,
                flag_message: 'userId is missing',
            });
        }

        const userDetails = await User.findById({ _id: userId })
        .populate({
            path: "interviews",
            populate: [ { path: "interviewer"},{ path: "interviewee"}]
        })


        return res.status(200).json({
            flag : 1,
            userdata : userDetails 
        })

    }catch(err) {
        return res.status(500).json({
                flag: 0,
                flag_message: err.message || 'something went wrong',
        });
    }
}

exports.start_interview = async (req,res) => {
    try {

        const {InterviewId} = req.body;

        if(!InterviewId)
        {
            return res.status(404).json({
                flag: 0,
                flag_message: 'give all info',
            });
        }


        await Interview.findByIdAndUpdate({_id:InterviewId},{
            start_time: Date.now()
        },{new:true});

        return res.status(200).json({
            flag : 1,
            flag_message: 'interview start successfully'
        })

    }catch(err) {
        return res.status(500).json({
                flag: 0,
                flag_message: err.message || 'something went wrong',
        });
    }
}

exports.completeInterview = async (req,res) => {
    try {

        const {InterviewId,events} = req.body;

        const video = req.file;
        if(!video || !InterviewId)
        {
            return res.status(404).json({
                flag: 0,
                flag_message: 'give all info',
            });
        }

        console.log(events);
        const eventArray = JSON.parse(events);
        
        const videoUrl = await uploadImageToCloudinary(video.path,process.env.FOLDER_NAME)

        const InterviewData = await Interview.findByIdAndUpdate({_id:InterviewId},{
            recording : videoUrl.secure_url,
            isCompeleted : true,
            end_time: Date.now(),
            finalScore: 100 - (eventArray.length || 0)
        },{new:true});

        for(let event of eventArray)
        {
            try{
                const res = await Event.create({
                          time: event?.time,
                          type: event?.type || 'something detected'
                })
                InterviewData.events.push(res._id);    
            }catch(Err)
            {
                console.error(Err.message);
            }
        }
        await InterviewData.save();

        return res.status(200).json({
            flag : 1,
            flag_message: 'video stored successfully'
        })

    }catch(err) {
        return res.status(500).json({
                flag: 0,
                flag_message: err.message || 'something went wrong',
        });
    }
}


exports.getInterviewData = async (req,res) => {
    try {
        const {InterviewId} = req.body;

        if(!InterviewId)
        {
            return res.status(404).json({
                flag: 0,
                flag_message: 'InterviewId is missing',
            });
        }

            const intDetails = await Interview.findById(InterviewId)
            .populate("events") 
            .populate("interviewer") 
            .populate("interviewee") 
            .exec();

        return res.status(200).json({
            flag : 1,
            interview : intDetails 
        })

    }catch(err) {
        return res.status(500).json({
                flag: 0,
                flag_message: err.message || 'something went wrong',
        });
    }
}


