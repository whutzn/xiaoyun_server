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
router.post("/deliveryquery", queryRoute.delievryquery);
router.post("/trainquery", queryRoute.trainquery);
router.post("/shipquery", queryRoute.shipquery);
router.post("/shipquery1", queryRoute.shipquery1);
router.post("/uploadquery", queryRoute.uploadquery);

router.post("/querylist", queryRoute.querylist);
router.post("/removelist", queryRoute.removelist);
router.post("/updatelist", queryRoute.updatelist);
router.post("/setordertype", queryRoute.setordertype);
router.post("/getorder", queryRoute.getorder);

router.post("/getdeliverycity", queryRoute.getdeliverycity);

router.post("/uploadfile", fileRoute.uploadfile);
router.post("/uploadqiniu", fileRoute.uploadqiniu);
router.post("/getqiniu", fileRoute.getqiniu);
router.post("/downloadfile", fileRoute.downloadfile);

router.post("/info/get", infoRoute.getinfo);
router.post("/info/set", infoRoute.setinfo);
router.post("/adminlogin", infoRoute.adminLogin);
router.post("/ad/get", infoRoute.getAd);
router.post("/ad/add", infoRoute.addAd);
router.post("/ad/remove", infoRoute.removeAd);

router.post("/readorder", queryRoute.readOrder);

router.post("/getexchange", queryRoute.getExchange);
router.post("/setexchange", queryRoute.setExchange);
router.post("/getcity", queryRoute.getCity);

module.exports = router;