let multer = require("multer"),
  fs = require("fs"),
  nodemailer = require("nodemailer"),
  xlsx = require("node-xlsx"),
  storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, "./public/store");
    },
    filename: function(req, file, cb) {
      let str = file.originalname.split(".");
      cb(null, Date.now() + "." + str[1]);
    }
  }),
  upload = multer({ storage: storage });
// 开启一个SMTP连接
let transporter = nodemailer.createTransport({
  host: "smtp.exmail.qq.com",
  // service: "qq", // 需要到qq邮箱设置开通SMTP, 查看支持的邮件服务商列表 https://nodemailer.com/smtp/well-known/
  port: 465, // SMTP 端口
  secureConnection: true, // 使用了SSL
  secure: true, // true for 465, false for other ports
  auth: {
    user: "service@sharingfreight.com",
    pass: "eTPmbZGkNDvhQzUF" // 这里密码不是qq密码，是你设置的smtp授权码
  }
});

// 填写邮件信息
let mailOptions = {
  from: '"客户服务" <service@sharingfreight.com>', // 发件人
  to: "whutzn@foxmail.com", // 收件人
  subject: "测试邮件", // 标题
  // 发送text或者html格式
  text: "", // plain text body 文本格式的内容
  html: "<br>这是一个测试邮件</br>", // html body HTML格式的内容
  attachments: [
    {
      filename: "answer.doc",
      path: "./public/files/answer.doc"
    }
  ]
};

// 使用前面创建的传输器来发送邮件
let send = function(subject, content, flag) {
  if (subject && content) {
    mailOptions.subject = subject;
    if (flag === "html") {
      mailOptions.html = content;
    } else {
      // 默认不传flag发送text
      mailOptions.text = content;
    }
    transporter.sendMail(mailOptions, (error, info) => {
      mailOptions.text = "";
      mailOptions.html = "";
      console.log(`Message: ${info.messageId}`);
      console.log(`sent: ${info.response}`);
    });
  }
};

function sendCutomMail(req, res, next) {
  send("这是邮件标题", "<b>这是邮件内容-html</b>", "html");
  res.send({
    code: 0,
    desc: "send ok!"
  });
}

function readExcel(req, res, next) {
  var sheets = xlsx.parse("./public/files/data.xlsx");

  // 遍历 sheet
  sheets.forEach(function(sheet) {
    console.log(sheet["name"]);
    // 读取每行内容
    for (var rowId in sheet["data"]) {
      console.log(rowId);
      var row = sheet["data"][rowId];
      console.log(row);
    }
  });
  res.send({
    code: 0,
    desc: "read ok!"
  });
}

function uploadStoreFile(req, res, next) {
  upload.single("file")(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      console.log("upload store file1", err);
      res.send({
        code: 1,
        desc: err
      });
    } else if (err) {
      console.log("upload store file2", err);
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
        "INSERT INTO storefiles(filename, encoding, mimetype, size, filepath, addTime) VALUES ( ? )";

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
            desc: rows.insertId
          });
        }
      });
    });
  });
}

function verifyCode(req, res, next) {
  let account = req.query.account || req.body.account || "",
    mode = req.query.mode || req.body.mode || 0, //1 为注册 2为找回密码
    sql = "SELECT account FROM `customer` WHERE account = ?",
    code = generateShareCode();

  let codemailOptions = {
    from: '"客户服务" <service@sharingfreight.com>', // 发件人
    to: account, // 收件人
    subject: "测试邮件", // 标题
    // 发送text或者html格式
    text: "", // plain text body 文本格式的内容
    html: `<br>请尽快输入验证码：</br> <p> ${code} </p>` // html body HTML格式的内容
  };
  req.getConnection(function(err, conn) {
    if(err) {
      console.log("db error", err);
      return next("db error" + err);
    }
    conn.query(sql, [account], function(err, rows) {
      if (err) {
        console.log("register1 error", err);
        return next("register1 error" + err);
      }

      if (rows.length != 0) {
        if (mode == 1) {
          res.send(
            JSON.stringify({
              code: 2,
              desc: "already register!"
            })
          );
        } else if (mode == 2) {
          codemailOptions.subject = "找回密码";
          transporter.sendMail(codemailOptions, (error, info) => {
            if (error) {
              console.log("send mail error", error);
            } else
              res.send(
                JSON.stringify({
                  code: 0,
                  desc: code
                })
              );
          });
        }
      } else {
        if (mode == 1) {
          codemailOptions.subject = "欢迎注册";
          transporter.sendMail(codemailOptions, (error, info) => {
            if (error) {
              console.log("send mail error", error);
            } else
              res.send(
                JSON.stringify({
                  code: 0,
                  desc: code
                })
              );
          });
        } else if (mode == 2) {
          res.send(
            JSON.stringify({
              code: 1,
              desc: "no user!"
            })
          );
        }
      }
    });
  });
}

function register(req, res, next) {
  let account = req.query.account || req.body.account || "",
    password = req.query.password || req.body.password || "",
    phone = req.query.phone || req.body.phone || "";

  req.getConnection(function(err, conn) {
    if (err) return next(err);

    let sql = "SELECT account FROM `customer` WHERE account = ?";

    conn.query(sql, [account], function(err, rows) {
      if (err) {
        console.log("register1 error", err);
        return next("register1 error" + err);
      }

      if (rows.length != 0) {
        res.send(
          JSON.stringify({
            code: 2,
            desc: "already register!"
          })
        );
      } else {
        let sql1 =
          "INSERT INTO customer(account,`password`,phone,update_time) VALUES(?,?,?,NOW());";
        conn.query(sql1, [account, password, phone], function(err, rows) {
          if (err) {
            console.log("register2 error", err);
            return next("register2 error" + err);
          }
          res.send(
            JSON.stringify({
              code: 0,
              desc: "register success!"
            })
          );
        });
      }
    });
  });
}

function login(req, res, next) {
  let phone = req.query.account || req.body.account || "",
    password = req.query.password || req.body.password || "";

  if (phone == "" || password == "") {
    res.send(
      JSON.stringify({
        code: 3,
        desc: "invalid input"
      })
    );
    return;
  }

  req.getConnection(function(err, conn) {
    if (err) return next(err);

    let sql = "SELECT * FROM `customer` WHERE account = ? ";

    conn.query(sql, [phone], function(err, rows) {
      if (err) return next("login error" + err);

      if (rows.length == 0) {
        res.send(
          JSON.stringify({
            code: 2,
            desc: "no user"
          })
        );
      } else if (rows[0].pwd != password) {
        res.send(
          JSON.stringify({
            code: 1,
            desc: "wrong password"
          })
        );
      } else {
        res.send(
          JSON.stringify({
            code: 0,
            desc: rows
          })
        );
      }
    });
  });
}

function generateShareCode() {
  var d = new Date().getTime();
  var uuid = "xxxxxx".replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

module.exports = {
  uploadstorefile: uploadStoreFile,
  login: login,
  register: register,
  getcode: verifyCode,
  sendmail: sendCutomMail,
  readfile: readExcel
};
