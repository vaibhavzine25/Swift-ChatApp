const bcrypt = require("bcrypt");
const { User, validateRegister } = require("../models/userModel.js");
const Token = require("../models/tokenModel.js");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");

const registerController = async (req, res) =>{
    try{
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).send({ message: "Request body is required" });
        }

        const { error } = validateRegister(req.body);

    if(error){
        return res.status(400).send({ message: error.details[0].message});
    }

    // Check if the user with the given email already exists
    let user = await User.findOne( { email: req.body.email });

    if(user && user.verified) {
        return res
        .status(409)
        .send({ message: "User with given email already exists" })
    }

    if(user && user.verificationLinkSent){
        return res
        .status(400)
        .send({
            message: "A verification link has been already sent to this Email"
        });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Save the user with hash password
    user = await new User({...req.body, password: hashedPassword}).save();
    
    //Generate a verification token and send an email
    const token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(16).toString("hex"),
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000,
    }).save();

    // Send verification email
    const url = `${process.env.BASE_URL}/users/${user._id}/verify/${token.token}`;
    await sendEmail(user.email, "Verify Email", url);

    user.verificationLinkSent = true;
    await user.save();
    res
      .status(201)
      .send({ message: `Verification Email Sent to ${user.email}` });
} catch(error){
    console.log("Error in registerController:", error);
    res.status(500).send({ message: "Internal Server Error" });
 }
};

module.exports = registerController;
