const mongoose = require("mongoose");
const Category = mongoose.model("Category");
const Blog = mongoose.model("Blog");

exports.createCategory = async (req, res) => {
    const { label } = req.body;

    const category = new Category({
        label,
    });

    await category.save();

    res.json({
        mssg: "Category Successfully Created!",
    });
};

exports.getAllCategories = async (req, res) => {
    const allCategories = await Category.find({});

    res.json(allCategories);
};

exports.deleteCategoryById = async (req, res) => {
    const { id: _id } = req.params;
    const relatedBlogs = await Blog.find({ category: _id });
    if (relatedBlogs) {
        let updatedItems = relatedBlogs.map((blog) => {
            let updatedBlogs = blog.category.filter(
                (category) => category != _id
            );
            return {
                ...blog._doc,
                category: updatedBlogs,
            };
        });
        updatedItems.forEach(async (item) => {
            await Blog.findOneAndUpdate(
                { _id: item._id },
                { category: item.category }
            );
        });
    }
    await Category.deleteOne({ _id });
    res.json({ mssg: "OK" });
};
