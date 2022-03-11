const path = require("path");
const util = require("util");

exports.upload = async (req, res) => {
    try {
        const file = req.files.file;
        const fileName = file.name;
        const size = file.data.length;
        const extension = path.extname(fileName);

        const allowedExtensions = /png|jpeg|jpg|gif/;

        if (!allowedExtensions.test(extension)) throw "Unsupported extension!";
        if (size > 50000000) throw "File must be less than 50MB";

        // const md5 = file.md5;
        const URL = "/uploads/" + Date.now() + fileName;

        await util.promisify(file.mv)("./public" + URL);
        res.status(200).json({ imageUrl: URL });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err,
        });
    }
};
