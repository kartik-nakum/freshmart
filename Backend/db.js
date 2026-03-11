// const mongoose = require("mongoose");

// const connectDB = async () => {
//    try {

//         await mongoose.connect("mongodb://localhost:27017/vegetableMarket");
//         console.log("MongoDB Connected");
//        }catch (error) {

//        console.error("MongoDB Error:", error.message);
//        process.exit(1);
//        }
// };

// module.exports = connectDB;


const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        
        const atlasUrl = "mongodb://kartik:Kartik1@ac-k6iw2vt-shard-00-00.5gdfgyo.mongodb.net:27017,ac-k6iw2vt-shard-00-01.5gdfgyo.mongodb.net:27017,ac-k6iw2vt-shard-00-02.5gdfgyo.mongodb.net:27017/freshmart?ssl=true&replicaSet=atlas-1330yx-shard-0&authSource=admin&appName=Cluster0";

        await mongoose.connect(atlasUrl);
        console.log("✅ MongoDB Atlas Connected with Standard Connection!");
    } catch (error) {
        console.error("❌ MongoDB Error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;

