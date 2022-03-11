const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: "Title is required!",
        },
        description: {
            type: String,
        },
        image: [{}],
        category: {
            type: [
                {
                    type: mongoose.Schema.ObjectId,
                    ref: "Category",
                },
            ],
        },
        featured: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
