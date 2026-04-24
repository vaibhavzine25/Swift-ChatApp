const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");

const profileController = async (req, res) => {
  const token = req.cookies?.authToken;
  if (token) {
    jwt.verify(token, process.env.JWTPRIVATEKEY, {}, async (err, userData) => {
      if (err) throw err;
      const user = await User.findOne({ _id: userData._id });
      res.json(user);
    });
  } else {
    res.status(401).json("no token");
  }
};

const profileUpdate = async (req, res) => {
  const token = req.cookies?.authToken;
  let authUserId = null;
  const isProduction = process.env.NODE_ENV === "production";

  if (token) {
    try {
      const userData = jwt.verify(token, process.env.JWTPRIVATEKEY);
      authUserId = userData._id;
    } catch (err) {
      return res.status(401).json("invalid token");
    }
  } else {
    return res.status(401).json("no token");
  }

  const { firstName, lastName, avatarLink } = req.body;
  const user = await User.findById(authUserId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.firstName = firstName ?? user.firstName;
  user.lastName = lastName ?? user.lastName;
  user.avatarLink = avatarLink ?? user.avatarLink;
  await user.save();

  const newToken = user.generateAuthToken();

  return res
    .status(200)
    .cookie("authToken", newToken, {
      httpOnly: false,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
      path: "/",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })
    .json(user);
};

module.exports = { profileController, profileUpdate };
