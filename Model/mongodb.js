const mongoose = require("mongoose")
require("dotenv").config()



mongoose.connect("mongodb+srv://kaushikgaudani945:X4YfqjM4xQtSGtKl@cluster0.b9cns.mongodb.net/gpstracker?retryWrites=true&w=majority", 
   { useUnifiedTopology: true}
)
.then(() => {
    console.log(`===== mongodb database connection successfully ======== ${"mongodb+srv://kaushikgaudani945:X4YfqjM4xQtSGtKl@cluster0.b9cns.mongodb.net/gpstracker"}` );
}).catch((error) => {
    console.log("===== error =======", error);   
})
mongoose.set('debug+++++++++++++++++++++++++++', true);



module.exports = mongoose


 

