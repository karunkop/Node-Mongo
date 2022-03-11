const mongoose = require("mongoose");
const User = mongoose.model("User");
const sha256 = require("js-sha256");
const jwt = require("jwt-then");
const nodemailer = require("nodemailer");
const { myAccessToken } = require("../oauth");

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com/;

    if (!emailRegex.test(email))
        throw "Email is not supported from your domain.";
    if (password.length < 6)
        throw "Password must be atleast 6 characters long.";

    const userExists = await User.findOne({
        email,
    });

    if (userExists) throw "User with same email already exits.";

    const user = new User({
        name,
        email,
        password: sha256(password + process.env.SALT),
    });

    await user.save();

    res.json({
        message: "User [" + name + "] registered successfully!",
    });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({
        email,
        password: sha256(password + process.env.SALT),
    });

    if (!user) throw "Email and Password did not match.";

    const token = await jwt.sign({ id: user._id }, process.env.SECRET);

    res.json({
        message: "User logged in successfully!",
        username: user.name,
        userId: user._id,
        token,
    });
};

exports.recovery = async (req, res) => {
    const { email } = req.body;
    console.log('email :', email);
    const user = await User.findOne({ email });

    if (!user) throw "No such user exists!";

    let uniqueCode = Math.floor(1000 + Math.random() * 9000);
    await User.updateOne({ email }, { code: uniqueCode });

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: "karun@kalysys.com.au", //your gmail account you used to set the project up in google cloud console"
            clientId:
                " 274662428150-vbaa0em7odek8tl297ing2vjq0pbpoi4.apps.googleusercontent.com",
            clientSecret: "viS4QgoypZg5S7SRZNoD2ixr",
            refreshToken:
                "1//04i1I2tzb464LCgYIARAAGAQSNwF-L9IrDNd_UM7HQnu81EEcduSxAVMWS5ee-WBjoHaDXDVhLinz3p-9HbLdebLiwBRG2eczQOA",
            accessToken: myAccessToken, //access token variable we defined earlier
        },
    });

    // send mail with defined transport object
    await transporter.sendMail({
        from: `"KADMIN 👻" <karun@kalysys.com.au>`, // sender address
        to: `${email}`, // list of receivers
        subject: "Password Recovery Code", // Subject line
        text: "ok",
        html: `<p>Use this code to verify. <b>${uniqueCode}</b></p>`, // html body
    });

    res.json({ mssg: `An email has been sent to ${email}` });
};

exports.updatePassword = async (req, res) => {
    const { password, email } = req.body;
    await User.findOneAndUpdate(
        { email },
        { password: sha256(password + process.env.SALT), code: "" }
    );
    res.json({ mssg: "Password Successfully Updated!" });
};
