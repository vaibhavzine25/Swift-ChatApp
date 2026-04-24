const mongoose = require("mongoose");

module.exports = async () =>{
    try {
await mongoose.connect(process.env.Mongo_URL);
        console.log("DB Connected Successfully")
    } catch(error){
        console.log(error);
        console.log("Could not connect to DB");
    }
}