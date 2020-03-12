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
        user: "service@freightinquiry.com",
        pass: "BVt2g8zTgaYppiUx" // 这里密码不是qq密码，是你设置的smtp授权码
    }
});

let transporter1 = nodemailer.createTransport({
    host: "smtp.exmail.qq.com",
    // service: "qq", // 需要到qq邮箱设置开通SMTP, 查看支持的邮件服务商列表 https://nodemailer.com/smtp/well-known/
    port: 465, // SMTP 端口
    secureConnection: true, // 使用了SSL
    secure: true, // true for 465, false for other ports
    auth: {
        user: "sale@freightinquiry.com",
        pass: "LftPYCzig8zVLbM3" // 这里密码不是qq密码，是你设置的smtp授权码
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
        name = req.query.name || req.body.name || "",
        subject = req.query.subject || req.body.subject || "";

    var options = { format: 'A4' };
    pdf.create(html, options).toFile('./public/files/' + name + '.pdf', function(err, res1) {
        if (err) return console.log(err);
        let mailOptions = {
            from: '"客户服务" <sale@freightinquiry.com>', // 发件人
            to: account, // 收件人
            subject: subject, // 标题
            // 发送text或者html格式
            text: "", // plain text body 文本格式的内容
            html: `<p>Dear ${account}：</p>` +
                `<p>欢迎注册查运费账户，我们非常感谢您的信任，查运费系统作为全球领先的互联网国际物流询价报价平台，我们坚持免费服务原则。</p>` +
                `<p>针对您的询价信息，我们落实了各个环节的操作细节，请查阅附件报价。</p>` +
                `<p>强调说明：</p>` +
                `<p>1. 本报价所用贸易术语/报价条款/计费方式等基于国际通用标准；本公司拥有对报价的解释权；</p>` +
                `<p>2. 仓储费，海关查验费等不可预见费用实报实销；</p>` +
                `<p>3. 结算汇率以报价当日银行牌价为准；</p>` +
                `<p>4. 本报价仅供双方协商用，不作为双方交易合同，双方需要另外签署运输代理合同。</p>` +
                `<p>如果对以上报价有疑议，请随时和我们联系，我们很乐意给您详细说明。</p>`, // html body HTML格式的内容
            attachments: [{
                filename: name + '.pdf',
                path: './public/files/' + name + '.pdf'
            }]
        };
        transporter1.sendMail(mailOptions, (error, info) => {
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
    if (element.length < 18) {
        let arrLength = 18 - element.length;
        for (let i = 0; i < arrLength; i++) element.push('');
    }
    curData.push(element[1] || '');
    curData.push(element[2] || '');
    element[5] += '';
    element[8] += '';
    if (element[5].indexOf(" ") >= 0) {
        curData.push(element[5].split(/ (.*)/)[0]);
        curData.push(element[5].split(/ (.*)/)[1]);
    } else {
        curData.push(element[5]);
        curData.push(element[5]);
    }

    curData.push(element[3] || '');
    curData.push(element[4] || '');
    if (element[8].indexOf(" ") >= 0) {
        curData.push(element[8].split(/ (.*)/)[0]);
        curData.push(element[8].split(/ (.*)/)[1]);
    } else {
        curData.push(element[8]);
        curData.push(element[8]);
    }
    curData.push(element[6] || '');
    curData.push(element[7] || '');
    let air = [];
    for (let index = 9; index < 18; index++) {
        air.push(typeof(element[index]) == "null" ? '0' : element[index]);
    }
    curData.push(air.join(','));
    curData.push(typeof(element[0]) == "undefined" ? 0 : element[0]);

}

function airRead1(curData, element) {
    curData.push(element[1] || '');
    curData.push(element[2] || '');
    curData.push(element[3] || '');
    curData.push(element[4] || '');
    curData.push(element[5] || '');

    let doc = [],
        nondoc = [];

    for (let index = 6; index < 11; index++) {
        if (!isNaN(element[index])) element[index] = element[index].toFixed(2);
        doc.push(typeof(element[index]) == "null" ? '0' : element[index]);
    }

    for (let index = 11; index < 56; index++) {
        if (!isNaN(element[index])) element[index] = element[index].toFixed(2);
        nondoc.push(typeof(element[index]) == "null" ? '0' : element[index]);
    }
    curData.push(doc.join(','));
    curData.push(nondoc.join(','));
    curData.push(typeof(element[0]) == "undefined" ? 0 : element[0]);

}

function airRead2(curData, element) {
    if (element.length < 19) {
        let arrLength = 19 - element.length;
        for (let i = 0; i < arrLength; i++) element.push('');
    }
    curData.push(element[1] || '');
    curData.push(element[3] || '');
    curData.push(element[2] || '');
    curData.push(element[4] || '');
    curData.push(element[5] || '');
    curData.push(element[7] || '');
    curData.push(element[6] || '');
    curData.push(element[8] || '');
    curData.push(element[9] || '');
    curData.push(element[11] || '');
    curData.push(element[10] || '');
    curData.push(element[12] || '');
    curData.push(element[13] || '');
    curData.push(element[14] || '');
    curData.push(new Date(1900, 0, element[15] - 1));
    curData.push((element[16] || '') + ',' + (element[17] || ''));
    curData.push(element[18] || '');
    curData.push(typeof(element[0]) == "undefined" ? 0 : element[0]);
}

let shipDate = new Array("日", "一", "二", "三", "四", "五", "六");

function airRead3(curData, element) {
    curData.push(0);
    if (element.length < 25) {
        let arrLength = 25 - element.length;
        for (let i = 0; i < arrLength; i++) element.push('');
    }

    for (let index = 1; index < 9; index++) {
        curData.push(element[index] || '');
    }
    curData.push(element[10] || '');
    curData.push(element[9] || '');
    curData.push(element[16] || '');
    curData.push((element[11] || '') + ',' + (element[12] || '') + ',' + (element[13] || ''));
    curData.push(element[14] || '');
    curData.push(element[15] || '');
    let date1 = new Date(1900, 0, element[17] - 1);
    curData.push(element[17] == '' ? '' : ('星期' + shipDate[date1.getDay()]));
    curData.push(element[18] || '');
    let date2 = new Date(1900, 0, element[19] - 1);
    curData.push(element[19] == '' ? '' : ('星期' + shipDate[date2.getDay()]));
    curData.push(element[20] || '');
    let date3 = new Date(1900, 0, element[21] - 1);
    curData.push(element[21] == '' ? '' : ('星期' + shipDate[date3.getDay()]));
    curData.push(element[22] || '');
    curData.push(element[23] || '');
    curData.push(element[24] == '' ? null : (new Date(1900, 0, element[24] - 1)));
    curData.push(typeof(element[0]) == "undefined" ? 0 : element[0]);
}

function airRead4(curData, element) {
    curData.push(0);
    if (element.length < 20) {
        let arrLength = 20 - element.length;
        for (let i = 0; i < arrLength; i++) element.push('');
    }

    for (let index = 1; index < 12; index++) {
        curData.push(element[index] || '');
    }
    let date1 = new Date(1900, 0, element[12] - 1);
    curData.push(element[12] == '' ? '' : ('星期' + shipDate[date1.getDay()]));
    curData.push(element[13] || '');
    let date2 = new Date(1900, 0, element[14] - 1);
    curData.push(element[14] == '' ? '' : ('星期' + shipDate[date2.getDay()]));
    curData.push(element[15] || '');
    let date3 = new Date(1900, 0, element[16] - 1);
    curData.push(element[16] == '' ? '' : ('星期' + shipDate[date3.getDay()]));
    curData.push(element[17] || '');
    curData.push(element[18] || '');
    curData.push(element[19] == '' ? null : (new Date(1900, 0, element[19] - 1)));
    curData.push(typeof(element[0]) == "undefined" ? 0 : element[0]);
}

function readExcel(req, res, next) {
    let filename = req.query.filename || req.body.filename || "",
        type = req.query.type || req.body.type,
        sheets = xlsx.parse("./public/customer/" + filename);
    var queryData = [];
    var curId = 0,
        startIndex = 2;
    if (type == 2) startIndex = 3;
    else if (type == 4) startIndex = 1;
    else if (type == 5) startIndex = 1;
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
            "INSERT INTO `word2.0`.`air_trans_query`(`airline`, `airline_code`, `dep_airport_cn`, `dep_airport_en`, `dep_airport_code`, `dep_airport_country`, `des_airport_cn`, `des_airport_en`, `des_airport_code`, `des_airport_country`, `air_freight`,`show`) VALUES ?";

        if (type == 2) addSQL = "INSERT INTO delivery_trans_query(dep_country_cn,dep_country_en,zone,country_cn,country_en,doc_charge,nondoc_charge,`show`) VALUES ?";
        else if (type == 3) addSQL = "INSERT INTO `word2.0`.`train_trans_query`(`dep_country_cn`, `dep_country_en`, `dep_city_cn`, `dep_city_en`, `des_country_cn`, `des_country_en`, `des_city_cn`, `des_city_en`, `exit_country_cn`, `exit_country_en`, `exit_city_cn`, `exit_city_en`, `trans_time`, `validity_time_cn`, `validity_time_en`, `charge`, `remark`, `show`) VALUES ?";
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
        from: '"客户服务" <service@freightinquiry.com>', // 发件人
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
                    codemailOptions.subject = "查运费找回密码";
                    codemailOptions.html = `<p>Dear ${account}：</p>` +
                        `<p>&nbsp;&nbsp;&nbsp;&nbsp;欢迎注册查运费账户，我们非常感谢您的信任，查运费系统作为全球领先的互联网国际物流询价报价平台，我们坚持免费服务原则。</p>` +
                        `<p>查运费找回密码验证码：<u><strong>${code}</strong></u></p>` +
                        `<p>此验证码5分钟内有效，如验证码失效请到客服网站重新操作！</p>` +
                        `<p>如非本人操作，请忽略本邮件。</p>`;
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
                    codemailOptions.subject = "查运费注册验证码";
                    codemailOptions.html = `<p>Dear ${account}：</p>` +
                        `<p>&nbsp;&nbsp;&nbsp;&nbsp;欢迎注册查运费账户，我们非常感谢您的信任，查运费系统作为全球领先的互联网国际物流询价报价平台，我们坚持免费服务原则。</p>` +
                        `<p>查运费邮箱账号注册验证码：<u><strong>${code}</strong></u></p>` +
                        `<p>此验证码5分钟内有效，如验证码失效请到客服网站重新操作！</p>` +
                        `<p>如非本人操作，请忽略本邮件。</p>`;
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