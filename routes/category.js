const router = require("express").Router();
const { catchErrors } = require("../handlers/errorHandlers");

const categoryController = require("../controllers/categoryController");
const auth = require("../middlewares/auth");

router.get("/all", catchErrors(categoryController.getAllCategories));
router.post("/create", auth, catchErrors(categoryController.createCategory));
router.delete(
    "/delete/:id",
    auth,
    catchErrors(categoryController.deleteCategoryById)
);

module.exports = router;
