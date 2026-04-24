const bcrypt = require("bcrypt");
const { User, validateLogin } = require("../models/userModel.js");

const loginController = async (req, res) => {
    try {
        const isProduction = process.env.NODE_ENV === "production";
        const { error } = validateLogin(req.body);

        if(error){
            return res.status(400).send({ message: error.details[0].message});
        }

        // Find the user by email
        const user = await User.findOne({ email: req.body.email });

        if(!user){
            return res.status(401).send({ message: "Invalid Email" });
        }

        // Check if email is verified
        if(!user.verified){
            return res.status(401).send({ message: "Please verify your email before logging in" });
        }

        // Check password validity using bycrpt
        const validPassword = await bcrypt.compare(
           req.body.password,
           user.password
        );
        if( !validPassword){
            return res.status(401).send({message: "Invalid Password"});
        }

        // Generate Authentication token and send successful login response
        const token = user.generateAuthToken();
        res
          .status(200)
          .cookie("authToken", token, {
            httpOnly: false,
            sameSite: isProduction ? "none" : "lax",
            secure: isProduction,
            path: "/",
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          })
          .send({ message: "Login Successful", status: 200 });
          return;
    } catch (error){
        console.error("Error in loginController:", error);
        res.status(500).send({ message: "Internal Server Error"});
    }
};

module.exports = loginController;
