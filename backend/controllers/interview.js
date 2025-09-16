const User = require('../models/User');
const Interview = require('../models/Interview');
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

       const newUser = await User.create({
                  name: name,
                  email: email,
                  role: 'interviewee'          
        });

        if(newUser)
        {
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

        const userDetails = await User.findById({_Id: userId})
                                     .populate({
                                       path: "interviews",   
                                       populate: {
                                         path: "events",     
                                         model: "Event"
                                       }
                                    })
                                    .exec();


        return res.status(200).json({
            flag : 1,
            data : userDetails 
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
            start_time: Date.now
        },{new:true});

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

exports.completeInterview = async (req,res) => {
    try {

        const {InterviewId} = req.body;

        const {video} = req.files.video;

        if(!video || !InterviewId)
        {
            return res.status(404).json({
                flag: 0,
                flag_message: 'give all info',
            });
        }

        const videoUrl = await uploadImageToCloudinary(video,process.env.FOLDER_NAME)

        await Interview.findByIdAndUpdate({_id:InterviewId},{
            recording : videoUrl.secure_url,
            isCompeleted : true,
            end_time: Date.now
        },{new:true});

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
                flag_message: 'userName is missing',
            });
        }

        const intDetails = await Interview.findById({_Id: InterviewId})
                                     .populate("events")
                                     .exec();

        return res.status(200).json({
            flag : 1,
            data : intDetails 
        })

    }catch(err) {
        return res.status(500).json({
                flag: 0,
                flag_message: err.message || 'something went wrong',
        });
    }
}


