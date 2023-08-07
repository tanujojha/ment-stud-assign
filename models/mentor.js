import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    course: {
        type: String,
        default: null,
    },
    mentees: {
        type: Array,
        default: [],
    }
}, {timestamps: true}

);

const Mentor = mongoose.model("Mentor", mentorSchema)

export default Mentor;