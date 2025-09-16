const User = require('../models/User');
const Interview = require('../models/Interview');
const Event = require('../models/Event');

exports.createEvent = async (req,res) => {
    try {
        const {type,description,InterviewId} = req.body;

        const newEvent = await Event.create({
                type: type,
                description: description,                
        });

        await Interview.findByIdAndUpdate(
                {_id: InterviewId},
                {
                    $push: {
                        events: newEvent?._id
                    }
                },
                {new:true}
        );

        return res.status(201).json({
            flag: 1,
            flag_message: 'event stored'
        })

    }catch(err) {
        return res.status(500).json({
                flag: 0,
                flag_message: err.message || 'something went wrong',
        });
    }
}

