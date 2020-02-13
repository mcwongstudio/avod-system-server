const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// 实例化数据模板
const UserSchema = new Schema({
    uid: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    sno: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    major: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
    },
    task: {
        type: Array,
        default: []
    },
    date: {
        type: Date,
        default: Date.now
    },
    admin: {
        type: Boolean,
        default: false
    }
});


module.exports = User = mongoose.model("users", UserSchema);

