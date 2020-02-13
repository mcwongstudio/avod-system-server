const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// 实例化数据模板
const CourseSchema = new Schema({
    cid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        // required: true
    },
    style: {
        type: String,
        // required: true
    },
    content: {
        type: Array,
        // required: true
    },
    tid: {
        type: String,
        // required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
        // required: true
    },
    desc: {
        type: String,
        // required: true
    },
    viewingtimes: {
        type: Number,
        default: 0
    },
    usable: {
        type: Boolean,
        default: false
    }
    
});


module.exports = Course = mongoose.model("course", CourseSchema, "course");