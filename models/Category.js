const mongoose = require("mongoose");
// const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
    {
        label: {
            type: String,
            required: true,
            unique: true,
        },
        // value: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

// categorySchema.pre("validate", function (next) {
//     if (this.label) {
//         this.value = slugify(this.label, { lower: true, strict: true });
//     }
//     next();
// });

module.exports = mongoose.model("Category", categorySchema);
