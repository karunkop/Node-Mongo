const mongoose = require("mongoose");
const Blog = mongoose.model("Blog");
const fs = require("fs");

exports.createBlog = async (req, res) => {
    const { title, description, categories, image, featured } = req.body;

    // const featuredBlog = await Blog.findOne({
    //     featured: true,
    //     category: [...JSON.parse(categories)],
    // });

    // if (featuredBlog && featuredBlog._id) {
    //     return res.status(400).json({
    //         mssg: "A featured image for this category already exists!",
    //     });
    // }

    const blog = new Blog({
        title,
        description,
        image,
        featured,
        category: JSON.parse(categories),
    });

    await blog.save();

    res.json({
        mssg: "Blog Successfully Created!",
        path: image,
    });
};

exports.getBlogByCategory = async (req, res) => {
    try {
        const { id: category } = req.params;

        const blog = await Blog.find({ category: [`${category}`] });

        if (!blog) throw "No such blog exists!";

        res.json({ data: blog, totalEntries: blog.length });
    } catch (error) {
        console.log("error :", error);
        res.status(400).json({
            mssg: error,
        });
    }
};

exports.getAllBlogs = async (req, res) => {
    // const { page } = req.query;
    // const limit = 10;
    const allBlogs = await Blog.find({}).populate("category", "_id label");
    // .skip((page - 1) * 6)
    // .limit(6);

    const count = await Blog.where({}).countDocuments();
    // const blogs = await Blog.aggregate([
    //     { $match: {} },
    //     {
    //         $facet: {
    //             data: [
    //                 { $skip: (page - 1) * limit },
    //                 { $limit: limit },
    //                 {
    //                     $lookup: {
    //                         from: "categories",
    //                         localField: "category",
    //                         foreignField: "_id",
    //                         as: "category",
    //                     },
    //                 },
    //             ],

    //             total: [{ $count: "count" }],
    //         },
    //     },
    // ]);
    res.json({ data: allBlogs, totalEntries: count });
};

exports.updateBlogById = async (req, res) => {
    const { title, description, categories, image, featured } = req.body;
    const { id: _id } = req.params;

    // if (featured) {
    //     const featuredBlog = await Blog.findOne({
    //         featured: true,
    //         category: [...JSON.parse(categories)],
    //     });

    //     if (featuredBlog && featuredBlog._id) {
    //         throw "A featured image for this category already exists!";
    //     }
    // }

    const updatedBLog = await Blog.findOneAndUpdate(
        { _id },
        {
            title,
            description,
            image,
            featured,
            category: JSON.parse(categories),
        },
        { new: true }
    );

    res.json({ mssg: "Blog Successfully Updated!", data: updatedBLog });
};

exports.deleteBlogById = async (req, res) => {
    try {
        const { id: _id } = req.params;

        const blog = await Blog.findOne({ _id });

        const path = "./public";

        await blog.image.forEach((image) => {
            fs.unlink(path + image.url, (err) => {
                if (err) throw err;
                console.log("Files deleted");
            });
        });

        const deletedBlog = await Blog.findOneAndDelete({ _id });

        res.json({ mssg: "Blog Successfully Deleted", deletedBlog });
    } catch (err) {
        console.log("err :", err);
        res.status(500).json("FATAL_ERROR");
    }
};
