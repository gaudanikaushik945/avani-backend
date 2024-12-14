const mongoose = require("mongoose")
require("dotenv").config()



mongoose.connect("mongodb+srv://kaushikgaudani945:X4YfqjM4xQtSGtKl@cluster0.b9cns.mongodb.net/gpstracker", 
)
.then(() => {
    console.log(`===== mongodb database connection successfully ======== ${"mongodb+srv://kaushikgaudani945:X4YfqjM4xQtSGtKl@cluster0.b9cns.mongodb.net/gpstracker"}` );
}).catch((error) => {
    console.log("===== error =======", error);   
})



module.exports = mongoose


 

