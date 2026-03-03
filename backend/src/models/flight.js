const mongoose = require("mongoose")

const flightSchema = new mongoose.Schema({
    flightNumber : {type:String, required:true, unique:true },
    from : {type: String , required:true},
    to : {type: String, required:true},
    date : {type: Date, required:true},
    price : {type: Number, required:true},
    AvailableSeats: {type: Number, required:true},
    seats:{type:Number,  required:true},},{
        timestamps: true
    
});
const Flight = mongoose.model("Flight", flightSchema)

module.exports = Flight