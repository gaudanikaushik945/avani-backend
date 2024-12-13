const { json } = require("body-parser")
const Driver = require("../Model/driver")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()



exports.registerDriver = async(req, res) => {
    try {
        console.log("+++++++++++++++++mobileNumber++++++++++++++++++++++++++");
        
        // const findDriver = await Driver.findOne({mobileNumber: req.body.mobileNumber})
        // console.log("+++++++++++ findDriver ++++++++++++++++", findDriver);
        // if (findDriver) {
        //     return res.status(400),json({
        //         data: false,
        //         message: "Driver is already registered with this mobile number."
        //     })
        // }

        // if (!location || !location.lat || !location.lon) {
        //     return res.status(400).json({ message: "Location (lat and lon) is required." });
        //   }

        const securePassword = await bcrypt.hash(req.body.password, 10);
        console.log("------ securePassword ----------", securePassword);

        
        const diverData = {
            driverName: req.body.driverName,
            mobileNumber: req.body.mobileNumber,
            password: securePassword,
            carModel: req.body.carModel,
            rcBookNumber: req.body.rcBookNumber,
            isActive: req.body.isActive,
            location: {
                latitude: req.body.location.latitude,  
                longitude: req.body.location.longitude, 
            },
          };



        const storeDriverData = await Driver.create(diverData)
        console.log("----- storeDriverData --------", storeDriverData);


        return res.status(201).json({
            driverData: storeDriverData,
            message : "diver register successfully"
        })
        
        
    } catch (error) {
        console.log("===== error =====", error);
        return res.status(500).json({
            data: false,
            message: "An unexpected error occurred while registering the driver. Please try again later."
        })
        
    }
}





exports.loginDriver = async(req, res) => {
    try {
        const findDriver = await Driver.findOne({mobileNumber: req.body.mobileNumber})
        console.log("+++++++++++ findDriver ++++++++++++++++", findDriver);
        if (!findDriver) {
            return res.status(404),json({
                data: false,
                message: "Driver not found with this mobile number."
            })
        }

        const passwordMatch = await bcrypt.compare(req.body.password, findDriver.password)
        console.log("============ passwordMatch ===============", passwordMatch);
        if (!passwordMatch) {
            return res.status(400).json({
                data: false,
                message: "Incorrect password."
            }); 
        }


        const driverToken = jwt.sign({driverId: findDriver._id, mobileNumber: findDriver.mobileNumber}, "process.env.JWT_SECRET",  { expiresIn: "24h" })
        console.log("----------- driverToken ---------------------", driverToken);
       
        findDriver.token = driverToken;
        await findDriver.save()
        return res.status(201).json({
            user: findDriver,
            token:driverToken ,
            message: "Driver login successfully"
        })

    } catch (error) {
        console.log("==== error =====", error);
        return res.status(500).json({
            data: false,
            message: "An unexpected error occurred while registering the driver. Please try again later."
        })
    }
}




exports.getAllDriver = async(req, res) => {
    try {
        const getAllDriver = await Driver.find()

        return res.status(201).json({
            data:getAllDriver,
            message: "Driver login successfully"
        })
    } catch (error) {
        console.log("==== error =====", error);
        return res.status(500).json({
            data: false,
            message: "An unexpected error occurred while registering the driver. Please try again later."
        })
    }
}

















exports.driverUpdateLocation = async(driverId, latitude, longitude) => {
    try {

        // console.log("======latitude===",latitude );

        // console.log("===== longitude ======", longitude)
        
        
      
        
    
        
        // console.log("++++++++++++++ data +++++++++++++++++", data)
        
      
        const addedLocation = await Location.update(driverId,{"location.latitude": latitude, "location.longitude": longitude});
        console.log("addedLocation ===============:", addedLocation);

        return { success: true, data: addedLocation };
    } catch (error) {
        console.error("Error adding location:==========", error);
        return { success: false, message: error.message };
    }
};










