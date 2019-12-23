let multer = require("multer"),
    fs = require("fs"),
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

  module.exports = {
    uploadfile: uploadCustomerFile
  }