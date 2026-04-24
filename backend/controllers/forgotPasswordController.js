const crypto = require("crypto");
const { User } = require("../models/userModel");
const ResetToken = require("../models/resetTokenModel");
const sendEmail = require("../utils/sendEmail");

const forgotPasswordController = async (req, res) => {
  const { email } = req.body || {};

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message: "If an account with that email exists, a reset link has been sent.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await ResetToken.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        token,
        createdAt: new Date(),
        expiresAt,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const url = `${process.env.BASE_URL}/reset-password/${user._id}/${token}`;
    await sendEmail(user.email, "Reset Password", url);

    return res.status(200).json({
      message: "If an account with that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Error in forgotPasswordController:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = forgotPasswordController;
