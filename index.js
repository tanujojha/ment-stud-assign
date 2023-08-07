import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import studentRoute from "./routes/student.js";
import mentorRoute from "./routes/mentor.js";

const app = express();
const PORT = process.env.PORT || 5000

// middlewares
app.use(express.json());


// connect to DB 
const connectDB = async()=>{
    const mongoURI = process.env.MONGODB_ATLAS_URI;
    try {
        const res = await mongoose.connect(mongoURI);
        // console.log(typeof res.connection.readyState);
        if(res.connection.readyState === 1){
            console.log("MongoDB connected");
        }else{
            console.log(res.connection.readyState);
        }

    } catch (error) {
        console.log(error);
    }
};
connectDB();

//routes
app.use("/api", mentorRoute);
app.use("/api", studentRoute);

app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}` );
})