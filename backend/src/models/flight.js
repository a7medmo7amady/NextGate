const mongoose = require("mongoose")

const flightSchema = new mongoose.Schema({
    flightNumber : {type:string, require:true, unique:true },
    from : {type: string},
    to : {type: string},
    date : {type: date},
    price : {type: int},
    AvailableSeats: {type: int},
    seats:{type:int},
});
const Flight = mongoose.model("Flight", flightSchema)

model.export = Flight