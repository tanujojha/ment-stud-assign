import express from "express";
import Mentor from "../models/mentor.js";
import Student from "../models/student.js";


const router = express.Router();

const mentorData = [
    {
        name: "Jack",
        course: "MERN",
    },
    {
        name: "Bruce",
        course: "Data Science",
    },
    {
        name: "Elliot",
        course: "AI and ML",
    },
];


// fetch mentors
router.get("/mentors", async(req, res)=>{
    try {
        const data = await Mentor.find();
        if(!data){
            return res.json("no mentor found")
        }

        return res.status(200).json({message: "successfull", mentors: data})
    } catch (error) {
        console.log(error);
        res.status(500).json("server error can not fetch mentors")
    }
});


// create a mentor
router.post("/mentor", async(req, res)=>{
    try {
        const mentor = new Mentor({
            name: req.body.name,
            course: req.body.course,
        });

        const data = await mentor.save();
        if(!data){
            return res.json("can not create mentor")
        }
        console.log(data);

        return res.status(200).json({message: "successfull", mentor: data})
        
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
});


// create/post mentors in bulk
router.post("/mentors", async(req, res)=>{
    try {
        const data = await Mentor.insertMany(mentorData);
        if(!data){
            return res.json("can not insert mentors")
        }
        return res.status(200).json({message: "successfull", mentor: data})
        
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
});


// Assign mentees
router.put("/mentees/:id", async(req, res)=>{
    const mentorId = req.params.id;
    const studentIds = req.body.studentIds; // contains an array of student ids
    if(studentIds.length < 2){
        return res.status(400).json({message: "Error: Please assign more than one mentee."})
    }
    try {
        // Assign mentees to a mentor
        const updatedMentor = await Mentor.findByIdAndUpdate(mentorId, {$set: {mentees: studentIds}}, {new: true});
        // const updatedMentor = await Mentor.findByIdAndUpdate(mentorId, {$set: {mentees: []}}, {new: true});
        if(!updatedMentor){
            return res.json("No such Mentor foudn and unable assigne mentees")
        }

        // updating status and currentMentor of the students who were assigned a mentor
        const updatedStudents = await Student.updateMany({_id: {$in: studentIds}}, {$set: {status: 1, currentMentor: mentorId}}, {new: true});

        if(updatedStudents.nModified > 0 && updatedStudents.nModified !== studentIds.length){
            return res.status(200).json({message: "success, only a few mentees were assigned", updatedMentor, updatedStudents})
        }
                
        res.status(200).json({message: "success", updatedMentor, updatedStudents})

    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
});


// fetch all the mentees of a mentor
router.get("/mentees/:id", async(req, res)=>{
    const mentorId = req.params.id

    try {

        const mentor = await Mentor.findById(mentorId, "mentees");

        if(!mentor){
            return res.status(400).send("no such mentor found");
        }else if(mentor.mentees.length < 1){
            return res.status(200).json({message: "The Mentor has no mentees", mentor});
        }

        const mentees = await Student.find({_id: {$in: mentor.mentees}});

        res.status(200).json({message: "success", mentees});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server Error", error})
    }

});



export default router