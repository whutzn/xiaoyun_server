let express = require("express"),
    customerRoute = require("../controller/customer"),
    router = express.Router();

router.post("/uploadfile", customerRoute.uploadstorefile);
router.post("/login", customerRoute.login);
router.post("/register", customerRoute.register);
router.post("/getcode", customerRoute.getcode);

router.post("/sendmail", customerRoute.sendmail);
router.post("/readfile", customerRoute.readfile);

module.exports = router;