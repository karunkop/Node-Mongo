const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = async (req, res, next) => {
    const { code, email } = req.body;
    const user = await User.findOne({ email });
    if (user.code == code) {
        next();
    } else {
        res.status(401).json({
            message: "Forbidden 🚫🚫🚫. Invalid Code!",
        });
    }
};
