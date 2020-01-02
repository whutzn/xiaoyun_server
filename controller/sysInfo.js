module.exports = {
    setinfo: (req, res, next) => {
        let type = req.query.type || req.body.type || "",
            content = req.query.content || req.body.content || "",
            content1 = req.query.content1 || req.body.content1 || "",
            title = req.query.title || req.body.title || "",
            title1 = req.query.title1 || req.body.title1 || "",
            pname = req.query.pname || req.body.pname || "";

        if (type == "" && content == "") {
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

            let sql = "UPDATE customer_info SET content = ?,content_en = ?, title = ?,title_en = ?, pname = ? WHERE id = ?";

            conn.query(sql, [content, content1, title, title1, pname, type], function(err, rows) {
                if (err) {
                    res.send(
                        JSON.stringify({
                            code: 1,
                            desc: "info query error"
                        })
                    );
                } else
                    res.send(
                        JSON.stringify({
                            code: 0,
                            desc: "set info ok"
                        })
                    );
            });
        });
    },
    getinfo: (req, res, next) => {
        let type = req.query.type || req.body.type || "";

        if (type == "") {
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

            let sql = "SELECT * FROM customer_info WHERE id = ?";

            conn.query(sql, [type], function(err, rows) {
                if (err) {
                    res.send(
                        JSON.stringify({
                            code: 1,
                            desc: "info query error"
                        })
                    );
                } else {
                    if (rows[0].pname != "")
                        rows[0].pname =
                        "http://47.104.73.104:3000/customer/" + rows[0].pname;
                    res.send(
                        JSON.stringify({
                            code: 0,
                            desc: rows[0]
                        })
                    );
                }
            });
        });
    },
    adminLogin: (req, res, next) => {
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

            let sql = "SELECT * FROM `customer_admin` WHERE account = ? ";

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
                            desc: rows[0]
                        })
                    );
                }
            });
        });
    },
    addAd: (req, res, next) => {
        let type = req.query.type || req.body.type || "",
            content = req.query.content || req.body.content || "",
            start = req.query.start || req.body.start || "",
            end = req.query.end || req.body.end || "",
            deadline = req.query.deadline || req.body.deadline || null;

        if (type == "" && content == "") {
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

            let sql = "INSERT INTO `customer_ad`(type,`start`,`end`,deadline,content) VALUES (?,?,?,?,?)";

            conn.query(sql, [type, start, end, deadline, content], function(err, rows) {
                if (err) {
                    console.log(err);
                    res.send(
                        JSON.stringify({
                            code: 1,
                            desc: "ad query error"
                        })
                    );
                } else
                    res.send(
                        JSON.stringify({
                            code: 0,
                            desc: "ad add success"
                        })
                    );
            });
        });
    },
    getAd: (req, res, next) => {
        let type = req.query.type || req.body.type || "";

        req.getConnection(function(err, conn) {
            if (err) return next(err);

            let sql = "SELECT * FROM customer_ad ";

            if (type != "") sql += "WHERE type = " + type;

            conn.query(sql, [], function(err, rows) {
                if (err) {
                    res.send(
                        JSON.stringify({
                            code: 1,
                            desc: "ad query error"
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
    },
    removeAd: (req, res, next) => {
        let id = req.query.id || req.body.id || '';

        if (id == "") {
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

            let sql = "DELETE FROM customer_ad WHERE id = ?";

            conn.query(sql, [id], function(err, rows) {
                if (err) {
                    console.log(err);
                    res.send(
                        JSON.stringify({
                            code: 1,
                            desc: "ad query error"
                        })
                    );
                } else
                    res.send(
                        JSON.stringify({
                            code: 0,
                            desc: 'ad remove success'
                        })
                    );
            });
        });
    }
};