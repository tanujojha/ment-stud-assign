import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    course: {
        type: String,
        default: null,
    },
    status:{
        type: Number,
        required: true,
        default: 0
    },
    currentMentor: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: "Mentor",
        index: true,
    },
    prevMentors: {
        type: Array,
        default: []
    }
}, {timestamps: true}
);

const Student = mongoose.model("Student", studentSchema);

export default Student