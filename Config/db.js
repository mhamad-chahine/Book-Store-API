const mongoose = require("mongoose");

async function connectToDb(){

    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connect To MongoDB...")
    } catch (error) {
        console.log("Connection failed To MongoDb!", error);
    }       
}

module.exports = {
    connectToDb
}