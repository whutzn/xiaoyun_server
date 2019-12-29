let express = require("express"),
    customerRoute = require("../controller/customer"),
    queryRoute = require("../controller/transQuery"),
    fileRoute = require("../controller/customerFile"),
    infoRoute = require("../controller/sysInfo"),
    router = express.Router();

router.post("/login", customerRoute.login);
router.post("/register", customerRoute.register);
router.post("/getcode", customerRoute.getcode);
router.post("/fixpwd", customerRoute.fixpwd);

router.post("/sendmail", customerRoute.sendmail);
router.post("/readfile", customerRoute.readfile);


router.post("/airquery", queryRoute.airquery);

router.post("/uploadfile", fileRoute.uploadfile);
router.post("/uploadqiniu", fileRoute.uploadqiniu);
router.post("/getqiniu", fileRoute.getqiniu);

router.post("/info/get", infoRoute.getinfo);
router.post("/info/set", infoRoute.setinfo);
router.post("/adminlogin", infoRoute.adminLogin);
router.post("/ad/get", infoRoute.getAd);
router.post("/ad/add", infoRoute.addAd);
router.post("/ad/remove", infoRoute.removeAd);

module.exports = router;