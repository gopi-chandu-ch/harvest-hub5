const mongoose = require("mongoose");

const Consumermodel = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    vegetables : {
        type : String,
        required : true
    },
    fruits : {
        type : String,
        required : true
    }
})
module.exports = mongoose.model("consumer_Details",Consumermodel);