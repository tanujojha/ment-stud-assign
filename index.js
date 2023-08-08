import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import studentRoute from "./routes/student.js";
import mentorRoute from "./routes/mentor.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000

// middlewares
app.use(express.json());
app.use(cors())


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


// View Postman published Doc
app.get("/", async(req, res)=>{
    res.status(200).send({
        status: "Success",
        message: "Click on the URL to view the Postman published documentation",
        url: "https://documenter.getpostman.com/view/19201756/2s9Xxzut7W",
    })
})

app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}` );
})