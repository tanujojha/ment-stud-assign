import express from "express";
import Student from "../models/student.js";
import Mentor from "../models/mentor.js";

const router = express.Router();

const studentData = [
    {
        name: "Tom",
        course: "MERN",
        currentMentor: null,
        
    },
    {
        name: "Dick",
        course: "AI and ML",
        currentMentor: null,
        
    },
    {
        name: "Haryy",
        course: "Data Science",
        currentMentor: null,
        
    },
]

// fetch all students or with some filter query
// eg: status=1, the url would be: localhost:5000/api/students?status=1

router.get("/students", async(req, res)=>{
    let query = {};
    query = req.query;

    try {
        const data = await Student.find(query);
        if(!data){
            return res.json("no student found")
        }

        return res.status(200).json({message: "successfull", students: data})
    } catch (error) {
        console.log(error);
        res.status(500).json("server error can not fetch students")
    }
});


// Create a student
router.post("/student", async(req, res)=>{
    try {
        const student = new Student({
            name: req.body.name,
            course: req.body.course,
            currentMentor: req.body.currentMentor, 
        });

        const data = await student.save();
        if(!data){
            return res.json("can not create student")
        }
        // console.log(data);

        return res.status(200).json({message: "successfull", student: data})
        
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
});


// create/post students in bulk
router.post("/students", async(req, res)=>{
    try {
        const data = await Student.insertMany(studentData);
        if(!data){
            return res.json("can not insert students")
        }
        return res.status(200).json({message: "successfull", students: data})
        
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
});


// Assign/Change a mentor for a particular student.
router.put("/mentor/:id", async(req, res)=>{
    const studentId = req.params.id;
    const mentorId = req.body.mentorId;

    try {
        // find a student with the id
        const student = await Student.findById(studentId);
        
        if(!student){
            return res.status(400).json({message: "No student found", student})
        }else if(student.status === 0){
            const updatedStudent = await Student.findByIdAndUpdate(studentId, {currentMentor: mentorId}, {new: true});
            return res.status(200).json({message: "success", updatedStudent})
        }else if(student.status === 1){
            const updatedStudent = await Student.findByIdAndUpdate(studentId, {currentMentor: mentorId, $push: {prevMentors: student.currentMentor}}, {new: true});
            return res.status(200).json({message: "success", updatedStudent})
        }       

        
    } catch (error) {
        res.status(200).json({message: "Error", error});
        console.log(error);
    }
});


// fetch previously assigned mentor
router.get("/prevmentor/:id", async(req, res)=>{
    const studentId = req.params.id;

    try {
        const student = await Student.findById(studentId);

        if(!student){
            return res.status(400).json({message: "No student found", student});
        }else if(student.prevMentors.length < 1){
            return res.status(200).json({message: "No Preveous Mentor of the Student", student})
        }

        const prevMentorId = student.prevMentors[student.prevMentors.length-1];
        console.log(prevMentorId);

        const prevMentor = await Mentor.findById(prevMentorId);

        res.status(200).json({message: "success", prevMentor})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error", error})
    }
});


export default router