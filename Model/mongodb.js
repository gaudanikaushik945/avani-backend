const mongoose = require("mongoose")
require("dotenv").config()



mongoose.connect("mongodb+srv://kaushikgaudani945:X4YfqjM4xQtSGtKl@cluster0.b9cns.mongodb.net/gpstracker?retryWrites=true&w=majority", 
   { serverSelectionTimeoutMS: 1000,  // 30 seconds for server selection
    socketTimeoutMS: 1000,  }
)
.then(() => {
    console.log(`===== mongodb database connection successfully ======== ${"mongodb+srv://kaushikgaudani945:X4YfqjM4xQtSGtKl@cluster0.b9cns.mongodb.net/gpstracker"}` );
}).catch((error) => {
    console.log("===== error =======", error);   
})



module.exports = mongoose


 

