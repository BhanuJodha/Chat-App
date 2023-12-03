const mongoose = require("mongoose");
const URI = process.env.MONGODB_URI;

module.exports = async () => {
    try {
        await mongoose.connect(URI+"/chat-app");
        console.log("Connection to mongodb was successfull")
    } catch (err) {
        console.error("Error in connecting to database", err)
    }
}
