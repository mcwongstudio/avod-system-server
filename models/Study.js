const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// 实例化数据模板
const StudySchema = new Schema({
    sid:{
        type: String,
        required: true
    },
    uid: {
        type: String,
        required: true
    },
    cid: {
        type: String,
        required: true
    },
    starttime: {
        type: Date,
        default: Date.now
    },
    endtime: {
        type: Date
    }
})

module.exports = Study = mongoose.model("study", StudySchema, "study");