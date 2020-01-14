let multer = require("multer"),
    axios = require("axios"),
    fs = require("fs"),
    qiniu = require("qiniu"),
    pdf = require('html-pdf'),
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

let FILE_TYPE = ['空运', '快递', '铁路', '海运拼箱', '海运整箱'],
    TABLE_NAME = ['air_trans_query', 'delivery_trans_query', 'train_trans_query', 'ship1_trans_query', 'ship_trans_query'];

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
            key = req.file.filename,
            type = req.query.type || req.body.type || '';
        // 文件上传
        formUploader.putFile(uploadToken, FILE_TYPE[type - 1] + key, localFile, putExtra, function(respErr,
            respBody, respInfo) {
            if (respErr) {
                throw respErr;
            }
            if (respInfo.statusCode == 200) {
                console.log(respBody);
                req.getConnection(function(err, conn) {
                    if (err) return next(err);
                    let clearSql = "TRUNCATE " + TABLE_NAME[type - 1];

                    let addSQL = "INSERT INTO customer_upload(`name`,type,addTime) VALUES(?,?,NOW());";

                    conn.query(clearSql, [], function(err1, rows1) {
                        if (err1) {
                            console.error("clear error" + err1);
                            res.send({
                                code: 1,
                                desc: "clear error"
                            });
                        } else {
                            let addSQL = "INSERT INTO customer_upload(`name`,type,addTime) VALUES(?,?,NOW());";

                            conn.query(addSQL, [FILE_TYPE[type - 1] + key, type], function(err, rows) {
                                if (err) {
                                    console.error("query error" + err);
                                    res.send({
                                        code: 1,
                                        desc: "database error"
                                    });
                                } else {
                                    res.send({ code: 0, "desc": "ok" });
                                    axios.post("http://localhost:3000/admin/customer/readfile", {
                                        filename: key,
                                        type: type
                                    }).catch((error) => {
                                        console.log("error: " + error.message);
                                    });
                                }
                            });
                        }
                    });
                });
            } else {
                console.log(respInfo.statusCode);
                console.log(respBody);
            }
        });
    });
}

let getFile = (req, res, next) => {
    let type = req.query.type || req.body.type || "";

    req.getConnection(function(err, conn) {
        if (err) return next(err);

        let sql = "SELECT * FROM customer_upload WHERE type = ?";

        conn.query(sql, [type], function(err, rows) {
            if (err) {
                res.send(
                    JSON.stringify({
                        code: 1,
                        desc: "qiniu query error"
                    })
                );
            } else
                res.send(
                    JSON.stringify({
                        code: 0,
                        desc: rows
                    })
                );
        });
    });
}

let downloadFile = (req, res, next) => {
    let fileName = req.query.fileName || req.body.fileName || "";
    if (fileName == "") {
        res.send(
            JSON.stringify({
                code: 0,
                desc: 'invalid input'
            })
        );
        return;
    }
    let accessKey = 'w2KFQdp7UqbTlwW8SNtA-ocr353c5L4rnpx4D5yN',
        secretKey = 'JciOohK_OJwSiGZBTwUmSUpw1aRNwgKS2Byi-uGP',
        mac = new qiniu.auth.digest.Mac(accessKey, secretKey),
        config = new qiniu.conf.Config();

    let bucketManager = new qiniu.rs.BucketManager(mac, config),
        privateBucketDomain = 'http://q32mff2hm.bkt.clouddn.com',
        deadline = parseInt(Date.now() / 1000) + 3600, // 1小时过期
        privateDownloadUrl = bucketManager.privateDownloadUrl(privateBucketDomain, fileName, deadline);
    res.send(
        JSON.stringify({
            code: 0,
            desc: privateDownloadUrl
        })
    );
}

let createPdf = (req, res, next) => {

    var html = fs.readFileSync('./public/files/index.html', 'utf8');
    var options = { format: 'A4' };
    pdf.create(html, options).toFile('./public/businesscard.pdf', function(err, res1) {
        if (err) return console.log(err);
        console.log(res1); // { filename: '/app/businesscard.pdf' }
        res.send(
            JSON.stringify({
                code: 0,
                desc: res1
            })
        );
    });
}

module.exports = {
    uploadfile: uploadCustomerFile,
    uploadqiniu: submitFile,
    getqiniu: getFile,
    downloadfile: downloadFile,
    createpdf: createPdf
}