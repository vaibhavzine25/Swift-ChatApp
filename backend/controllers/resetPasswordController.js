const bcrypt = require("bcrypt");
const { User, validatePasswordReset } = require("../models/userModel");
const ResetToken = require("../models/resetTokenModel");

const resetPasswordController = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body || {};

  const { error } = validatePasswordReset({ password });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset link" });
    }

    const resetToken = await ResetToken.findOne({
      userId: user._id,
      token,
    });

    if (!resetToken || resetToken.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired reset link" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    await ResetToken.deleteOne({ _id: resetToken._id });

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error in resetPasswordController:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = resetPasswordController;
