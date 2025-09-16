const User = require('../models/User');

exports.createUser = async (req,res) => {
    try {
        const {name,email} = req.body;

        if(!name || !email)
        {
            return res.status(404).json({
                flag: 0,
                flag_message: 'enter all info',
            });
        }

        const userResponse = await User.findOne({email: email});

        if(userResponse)
        {
            return res.status(409).json({
                flag: 0,
                flag_message: 'Email already exists',
            });
        }
        
        await User.create({
                  name: name,
                  email: email,
                  role: 'interviewer'          
        });

        return res.status(201).json({
            flag: 1,
            flag_message: 'new user created'
        })

    }catch(err) {
        return res.status(500).json({
                flag: 0,
                flag_message: err.message || 'something went wrong',
        });
    }
}

exports.checkUser = async (req,res) => {
    try {
        const {userName} = req.body;

        if(!userName)
        {
            return res.status(404).json({
                flag: 0,
                flag_message: 'userName is missing',
            });
        }

        const userResponse = await User.findOne({email: userName});

        if(!userResponse)
        {
            return res.status(401).json({
                flag: 0,
                flag_message: 'no user found',
            });
        }


        return res.status(200).json({
            flag : 1,
            flag_message : {
                id: userResponse?._id,
                name: userResponse?.name,
                role: userResponse?.role,
                email: userResponse?.email
            }
        })

    }catch(err) {
        return res.status(500).json({
                flag: 0,
                flag_message: err.message || 'something went wrong',
        });
    }
}

