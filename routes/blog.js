const router = require("express").Router();
const { catchErrors } = require("../handlers/errorHandlers");

const blogController = require("../controllers/blogController");
const { upload } = require("../handlers/uploadHandler");
const auth = require("../middlewares/auth");

router.get("/all", catchErrors(blogController.getAllBlogs));
router.get("/category/:id", catchErrors(blogController.getBlogByCategory));
router.post("/create", auth, catchErrors(blogController.createBlog));
router.put("/edit/:id", auth, catchErrors(blogController.updateBlogById));
router.delete("/delete/:id", auth, catchErrors(blogController.deleteBlogById));
router.post("/image/upload", upload);

module.exports = router;
