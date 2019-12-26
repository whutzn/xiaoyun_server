let multer = require("multer"),
    axios = require("axios"),
    fs = require("fs"),
    qiniu = require("qiniu"),
    storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, "./public/customer");
        },
        filename: function(req, file, cb) {
            let str = file.originalname.split(".");
            cb(null, Date.now() + "." + str[1]);
        }
    }),
    upload = multer({ storage: storage });

let uploadCustomerFile = (req, res, next) => {
    upload.single("file")(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            console.log("upload customer file1", err);
            res.send({
                code: 1,
                desc: err
            });
        } else if (err) {
            console.log("upload customer file2", err);
            res.send({
                code: 1,
                desc: err
            });
        }
        let metadata = [
            req.file.filename,
            req.file.encoding,
            req.file.mimetype,
            req.file.size,
            req.file.path,
            new Date()
        ];
        req.getConnection(function(err, conn) {
            if (err) return next(err);
            let addSQL =
                "INSERT INTO customer_file(filename, encoding, mimetype, size, filepath, addTime) VALUES ( ? )";

            conn.query(addSQL, [metadata], function(err, rows) {
                if (err) {
                    console.error("query error" + err);
                    res.send({
                        code: 1,
                        desc: "database error"
                    });
                } else {
                    res.send({
                        code: 0,
                        desc: req.file.filename
                    });
                }
            });
        });
    });
}

let submitFile = (req, res, next) => {
    let accessKey = 'w2KFQdp7UqbTlwW8SNtA-ocr353c5L4rnpx4D5yN',
        secretKey = 'JciOohK_OJwSiGZBTwUmSUpw1aRNwgKS2Byi-uGP',
        mac = new qiniu.auth.digest.Mac(accessKey, secretKey),
        options = {
            scope: 'xiaoyunfile',
        },
        putPolicy = new qiniu.rs.PutPolicy(options),
        uploadToken = putPolicy.uploadToken(mac),
        config = new qiniu.conf.Config();
    config.zone = qiniu.zone.Zone_z1;

    upload.single("file")(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            console.log("upload customer file1", err);
            res.send({
                code: 1,
                desc: err
            });
        } else if (err) {
            console.log("upload customer file2", err);
            res.send({
                code: 1,
                desc: err
            });
        }

        let localFile = "./public/customer/" + req.file.filename,
            formUploader = new qiniu.form_up.FormUploader(config),
            putExtra = new qiniu.form_up.PutExtra(),
            key = req.file.filename;
        // 文件上传
        formUploader.putFile(uploadToken, "空运" + key, localFile, putExtra, function(respErr,
            respBody, respInfo) {
            if (respErr) {
                throw respErr;
            }
            if (respInfo.statusCode == 200) {
                console.log(respBody);
                res.send({ code: 0, "msg": "ok" });
                axios.post("http://localhost:3000/admin/customer/readfile", {
                    filename: key
                });
            } else {
                console.log(respInfo.statusCode);
                console.log(respBody);
            }
        });
    });
}

module.exports = {
    uploadfile: uploadCustomerFile,
    uploadqiniu: submitFile
}