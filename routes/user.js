const router = require("express").Router();
const { catchErrors } = require("../handlers/errorHandlers");
const userController = require("../controllers/userController");
const verify = require("../middlewares/verify");

router.post("/login", catchErrors(userController.login));
router.post("/register", catchErrors(userController.register));
router.post("/recovery", catchErrors(userController.recovery));
router.post(
    "/reset-password",
    verify,
    catchErrors(userController.updatePassword)
);

module.exports = router;
