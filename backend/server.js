const express = require('express');
const app = express();
require('dotenv').config();
const {dbConnect} = require('./config/dbConnect');
const port = process.env.PORT || 4000;
const {cloudinaryConnect} = require('./config/cloudinary');
const userRoutes = require('./routes/User');
const intRoutes = require('./routes/Interview');
const eventRoutes = require('./routes/Event');
const cors = require('cors');

app.use(cors({
    origin: "https://proctor-system.vercel.app", 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(express.json());
app.use('/api/v1/user-route',userRoutes);
app.use('/api/v1/interview-route',intRoutes);
app.use('/api/v1/event-route',eventRoutes);


app.listen(port, () => {
    console.log(`listeing on port: ${port}`);
})

cloudinaryConnect();
dbConnect();

