let nodemailer = require("nodemailer"),
    pdf = require('html-pdf'),
    xlsx = require("node-xlsx");

// 开启一个SMTP连接
let transporter = nodemailer.createTransport({
    host: "smtp.exmail.qq.com",
    // service: "qq", // 需要到qq邮箱设置开通SMTP, 查看支持的邮件服务商列表 https://nodemailer.com/smtp/well-known/
    port: 465, // SMTP 端口
    secureConnection: true, // 使用了SSL
    secure: true, // true for 465, false for other ports
    auth: {
        user: "sale@sharingfreight.com",
        pass: "B4sCTkePs3ZxJR3G" // 这里密码不是qq密码，是你设置的smtp授权码
    }
});

// 填写邮件信息
let mailOptions = {
    from: '"客户服务" <sale@sharingfreight.com>', // 发件人
    to: "whutzn@foxmail.com", // 收件人
    subject: "测试邮件", // 标题
    // 发送text或者html格式
    text: "", // plain text body 文本格式的内容
    html: "<br>这是一个测试邮件</br>", // html body HTML格式的内容
    attachments: [{
        filename: "answer.doc",
        path: "./public/files/answer.doc"
    }]
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
    let account = req.query.account || req.body.account || "",
        id = req.query.id || req.body.id || "",
        html = req.query.html || req.body.html || "",
        name = req.query.name || req.body.name || "";

    var options = { format: 'A4' };
    pdf.create(html, options).toFile('./public/files/' + name + '.pdf', function(err, res1) {
        if (err) return console.log(err);
        let mailOptions = {
            from: '"客户服务" <sale@sharingfreight.com>', // 发件人
            to: account, // 收件人
            subject: "测试报价单邮件", // 标题
            // 发送text或者html格式
            text: "", // plain text body 文本格式的内容
            html: "<br>报价单请查收</br>", // html body HTML格式的内容
            attachments: [{
                filename: name + '.pdf',
                path: './public/files/' + name + '.pdf'
            }]
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("send mail1 error", error);
            } else {
                req.getConnection(function(err, conn) {
                    if (err) return next(err);

                    var sql = "UPDATE customer_order SET `status` = 3 WHERE id = ?";

                    conn.query(sql, [id], function(err, rows) {
                        if (err) {
                            res.send(
                                JSON.stringify({
                                    code: 1,
                                    desc: "send mail1 error"
                                })
                            );
                        } else
                            res.send(
                                JSON.stringify({
                                    code: 0,
                                    desc: 'send success'
                                })
                            );
                    });
                });
            }
        });
    });
}

function airRead(curData, element) {
    curData.push(element[0]);
    curData.push(element[1]);
    element[4] += '';
    element[12] += '';
    if (element[4].indexOf(" ") >= 0) {
        curData.push(element[4].split(/ (.*)/)[0]);
        curData.push(element[4].split(/ (.*)/)[1]);
    } else {
        curData.push(element[4]);
        curData.push(element[4]);
    }

    curData.push(element[2]);
    curData.push(element[3]);
    if (element[12].indexOf(" ") >= 0) {
        curData.push(element[12].split(/ (.*)/)[0]);
        curData.push(element[12].split(/ (.*)/)[1]);
    } else {
        curData.push(element[12]);
        curData.push(element[12]);
    }
    curData.push(element[10]);
    curData.push(element[11]);
    let dep = [],
        des = [],
        air = [];
    dep.push(typeof(element[5]) == "null" ? '0' : element[5]);
    dep.push(typeof(element[6]) == "null" ? '0' : element[6]);
    dep.push(typeof(element[7]) == "null" ? '0' : element[7]);
    dep.push(typeof(element[8]) == "null" ? '0' : element[8]);
    dep.push(typeof(element[9]) == "null" ? '0' : element[9]);
    des.push(typeof(element[23]) == "null" ? '0' : element[23]);
    des.push(typeof(element[24]) == "null" ? '0' : element[24]);
    des.push(typeof(element[25]) == "null" ? '0' : element[25]);
    for (let index = 13; index < 22; index++) {
        air.push(typeof(element[index]) == "null" ? '0' : element[index]);
    }
    curData.push(dep.join(','));
    curData.push(des.join(','));
    curData.push(air.join(','));
}

function airRead1(curData, element) {
    curData.push(element[1]);
    curData.push(element[2]);
    curData.push(element[3]);
    curData.push(element[4]);

    let doc = [],
        nondoc = [];

    for (let index = 5; index < 10; index++) {
        if (!isNaN(element[index])) element[index] = element[index].toFixed(2);
        doc.push(typeof(element[index]) == "null" ? '0' : element[index]);
    }

    for (let index = 10; index < 55; index++) {
        if (!isNaN(element[index])) element[index] = element[index].toFixed(2);
        nondoc.push(typeof(element[index]) == "null" ? '0' : element[index]);
    }
    curData.push(doc.join(','));
    curData.push(nondoc.join(','));
}

function airRead2(curData, element) {
    if (element.length < 15) {
        let arrLength = 15 - element.length;
        for (let i = 0; i < arrLength; i++) element.push('');
    }
    curData.push(element[0]);
    curData.push(element[1] || '');
    curData.push(element[2] || '');
    curData.push(element[3] || '');
    curData.push(element[4] || '');
    curData.push(element[5] || '');

    let charge = [],
        charge1 = [],
        charge2 = [];

    for (let index = 6; index < 9; index++) {
        if (element[index] == '') {
            charge.push(element[index]);
        } else {
            if (!isNaN(element[index])) element[index] = element[index].toFixed(2);
            charge.push(typeof(element[index]) == "null" ? '0' : element[index]);
        }
    }

    for (let index = 9; index < 12; index++) {
        if (element[index] == '') {
            charge1.push(element[index]);
        } else {
            if (!isNaN(element[index])) element[index] = element[index].toFixed(2);
            charge1.push(typeof(element[index]) == "null" ? '0' : element[index]);
        }
    }

    for (let index = 12; index < 14; index++) {
        if (element[index] == '') {
            charge2.push(element[index]);
        } else {
            if (!isNaN(element[index])) element[index] = element[index].toFixed(2);
            charge2.push(typeof(element[index]) == "null" ? '0' : element[index]);
        }
    }
    curData.push(charge.join(','));
    curData.push(charge1.join(','));
    curData.push(charge2.join(','));
    curData.push(element[14] || '');
    curData.push(element[15] || '');
}

function airRead3(curData, element) {
    curData.push(0);
    if (element.length < 17) {
        let arrLength = 17 - element.length;
        for (let i = 0; i < arrLength; i++) element.push('');
    }

    for (let index = 5; index < 9; index++) {
        curData.push(element[index] || '');
    }
    curData.push(typeof(element[15]) == "null" ? '0' : element[15]);
    curData.push(typeof(element[16]) == "null" ? '0' : element[16]);
    curData.push(element[9] || '');
    let fee = [];
    for (let index = 10; index < 13; index++) {
        fee.push(typeof(element[index]) == "null" ? '0' : element[index]);
    }
    curData.push(fee.join(','));
    curData.push(element[13] || '');
    curData.push(element[14] || '');
    curData.push(element[3] || '');
    curData.push(element[4] || '');

}

function airRead4(curData, element) {
    curData.push(0);
    if (element.length < 17) {
        let arrLength = 17 - element.length;
        for (let i = 0; i < arrLength; i++) element.push('');
    }

    for (let index = 5; index < 9; index++) {
        curData.push(typeof(element[index]) == "null" ? '0' : element[index]);
    }
    curData.push(typeof(element[15]) == "null" ? '0' : element[15]);
    curData.push(typeof(element[16]) == "null" ? '0' : element[16]);
    curData.push(element[9] || '');
    curData.push(element[11] || '');
    curData.push(element[13] || '');
    curData.push(element[14] || '');
    curData.push(element[3] || '');
    curData.push(element[4] || '');
    curData.push(element[10] || '');
    curData.push(element[12] || '');
}

function readExcel(req, res, next) {
    let filename = req.query.filename || req.body.filename || "",
        type = req.query.type || req.body.type,
        sheets = xlsx.parse("./public/customer/" + filename);
    var queryData = [];
    var curId = 0,
        startIndex = 2;
    if (type == 2) startIndex = 3;
    else if (type == 4) startIndex = 0;
    else if (type == 5) startIndex = 0;
    // 遍历 sheet
    sheets[0].data.forEach(element => {
        // console.log(element);
        if (curId > startIndex) {
            var curData = [];
            if (type == 1) airRead(curData, element);
            else if (type == 2) airRead1(curData, element);
            else if (type == 3) airRead2(curData, element);
            else if (type == 5) airRead3(curData, element);
            else if (type == 4) airRead4(curData, element);
            queryData.push(curData);
            // console.log(curId, curData);
        }
        curId++;
    });
    req.getConnection(function(err, conn) {
        if (err) return next(err);
        let addSQL =
            "INSERT INTO `word2.0`.`air_trans_query`(`airline`, `airline_code`, `dep_airport_cn`, `dep_airport_en`, `dep_airport_code`, `dep_airport_country`, `des_airport_cn`, `des_airport_en`, `des_airport_code`, `des_airport_country`, `dep_charges`, `des_charges`, `air_freight`) VALUES ?";

        if (type == 2) addSQL = "INSERT INTO delivery_trans_query(zone,zone_code,country_cn,country_en,doc_charge,nondoc_charge) VALUES ?";
        else if (type == 3) addSQL = "INSERT INTO train_trans_query(`start`,`stop`,transit,`end`,platform_code,trans_time,charge,charge1,charge2,charge_other,remark) VALUES ?";
        else if (type == 4) addSQL = "INSERT INTO ship1_trans_query VALUES ?";
        else if (type == 5) addSQL = "INSERT INTO ship_trans_query VALUES ?";

        conn.query(addSQL, [queryData], function(err, rows) {
            if (err) {
                console.error("query error" + err);
                res.send({
                    code: 1,
                    desc: "database error"
                });
            } else {
                // res.send({
                //     code: 0,
                //     desc: "ok"
                // });
                console.log(filename + " read success");
            }
        });
    });
}

function verifyCode(req, res, next) {
    let account = req.query.account || req.body.account || "",
        mode = req.query.mode || req.body.mode || 0, //1 为注册 2为找回密码
        sql = "SELECT account FROM `customer` WHERE account = ?",
        code = generateShareCode();

    let codemailOptions = {
        from: '"客户服务" <sale@sharingfreight.com>', // 发件人
        to: account, // 收件人
        subject: "测试邮件", // 标题
        // 发送text或者html格式
        text: "", // plain text body 文本格式的内容
        html: `<br>请尽快输入验证码：</br> <p> ${code} </p>` // html body HTML格式的内容
    };
    req.getConnection(function(err, conn) {
        if (err) {
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
            } else if (rows[0].password != password) {
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

function fixpwd(req, res, next) {
    let phone = req.query.account || req.body.account || "",
        password = req.query.password || req.body.password || "";

    if (password == "") {
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

        var sql = "UPDATE customer SET `password` = ? WHERE account = ?";

        conn.query(sql, [password, phone], function(err, rows) {
            if (err) {
                res.send(
                    JSON.stringify({
                        code: 1,
                        desc: "set pwd error"
                    })
                );
                return next("login error" + err);
            } else
                res.send(
                    JSON.stringify({
                        code: 0,
                        desc: "set pwd success"
                    })
                );
        });
    });
}

module.exports = {
    login: login,
    register: register,
    getcode: verifyCode,
    fixpwd: fixpwd,
    sendmail: sendCutomMail,
    readfile: readExcel
};