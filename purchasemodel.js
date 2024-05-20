const mongoose = require("mongoose");

const Purchasemodel = mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    cart : {
        type : String,
        required : true
    },
    quantity : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    }
})
module.exports = mongoose.model("orders",Purchasemodel);