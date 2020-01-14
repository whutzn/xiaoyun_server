let sillydate = require("silly-datetime");


function searchFiled(sql, filed, name) {
    if (filed != "") {
        if (sql.indexOf("WHERE") >= 0) {
            sql += " AND " + name + "= '" + filed + "'";
        } else {
            sql += "WHERE " + name + " = '" + filed + "'";
        }
    }
    return sql;
};

function PrefixZero(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}

module.exports = {
    airquery: (req, res, next) => {
        let start = req.query.start || req.body.start || "",
            end = req.query.end || req.body.end || "";

        if (start == "" && end == "") {
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

            let sql = "SELECT * FROM air_trans_query WHERE CONCAT(dep_airport_cn,dep_airport_en,dep_airport_code) LIKE '%" + start +
                "%' AND CONCAT(des_airport_cn,des_airport_en,des_airport_code) LIKE '%" + end + "%'";

            if (start == "") {
                sql = "SELECT DISTINCT des_airport_cn,des_airport_en,des_airport_code  FROM air_trans_query WHERE CONCAT(des_airport_cn,des_airport_en,des_airport_code) LIKE '%" +
                    end + "%'";
            }
            if (end == "") {
                sql = "SELECT DISTINCT dep_airport_cn,dep_airport_en,dep_airport_code  FROM air_trans_query WHERE CONCAT(dep_airport_cn,dep_airport_en,dep_airport_code) LIKE '%" +
                    start + "%'";
            }

            conn.query(sql, [], function(err, rows) {
                if (err) {
                    res.send(
                        JSON.stringify({
                            code: 1,
                            desc: "air query error"
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
    shipquery: (req, res, next) => {
        let start = req.query.start || req.body.start || "",
            end = req.query.end || req.body.end || "";

        if (start == "" && end == "") {
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

            let sql = "SELECT * FROM ship_trans_query WHERE CONCAT(dep_port_cn,dep_port_en) LIKE '%" + start +
                "%' AND CONCAT(des_port_cn,des_port_en) LIKE '%" + end + "%'";

            if (start == "") {
                sql = "SELECT DISTINCT dep_port_cn,dep_port_en FROM ship_trans_query WHERE CONCAT(dep_port_cn,dep_port_en) LIKE '%" +
                    end + "%'";
            }
            if (end == "") {
                sql = "SELECT DISTINCT des_port_cn,des_port_en FROM ship_trans_query WHERE CONCAT(des_port_cn,des_port_en) LIKE '%" +
                    start + "%'";
            }

            conn.query(sql, [], function(err, rows) {
                if (err) {
                    res.send(
                        JSON.stringify({
                            code: 1,
                            desc: "ship query error"
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
    shipquery1: (req, res, next) => {
        let start = req.query.start || req.body.start || "",
            end = req.query.end || req.body.end || "";

        if (start == "" && end == "") {
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

            let sql = "SELECT * FROM ship1_trans_query WHERE CONCAT(dep_port_cn,dep_port_en) LIKE '%" + start +
                "%' AND CONCAT(des_port_cn,des_port_en) LIKE '%" + end + "%'";

            if (start == "") {
                sql = "SELECT DISTINCT dep_port_cn,dep_port_en FROM ship1_trans_query WHERE CONCAT(dep_port_cn,dep_port_en) LIKE '%" +
                    end + "%'";
            }
            if (end == "") {
                sql = "SELECT DISTINCT des_port_cn,des_port_en FROM ship1_trans_query WHERE CONCAT(des_port_cn,des_port_en) LIKE '%" +
                    start + "%'";
            }

            conn.query(sql, [], function(err, rows) {
                if (err) {
                    res.send(
                        JSON.stringify({
                            code: 1,
                            desc: "ship1 query error"
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
    delievryquery: (req, res, next) => {
        let end = req.query.end || req.body.end || "",
        mode = req.query.mode || req.body.mode || "";

        if (end == "") {
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
            let sql = "SELECT * FROM delivery_trans_query  WHERE CONCAT(country_cn,country_en) LIKE '%" + end + "%'";
            if(mode == 1) {
                sql = "SELECT DISTINCT country_cn,country_en FROM `delivery_trans_query` WHERE CONCAT(country_cn,country_en) LIKE '%" + end + "%'";
            }else if(mode == 2) {
                sql = "SELECT  * FROM `delivery_trans_query` WHERE country_cn = '"+end+"' OR country_en = '"+end+"'";
            }

            conn.query(sql, [], function(err, rows) {
                if (err) {
                    res.send(
                        JSON.stringify({
                            code: 1,
                            desc: "delivery query error"
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
    getdeliverycity: (req, res, next) => {
        req.getConnection(function(err, conn) {
            if (err) return next(err);
            conn.query('SELECT * FROM delivery_city', [], function(err, rows) {
                if (err) {
                    res.send(
                        JSON.stringify({
                            code: 1,
                            desc: "delivery query error"
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
    trainquery: (req, res, next) => {
        let start = req.query.start || req.body.start || "",
            end = req.query.end || req.body.end || "";

        if (start == "" && end == "") {
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

            let sql = "SELECT DISTINCT * FROM train_trans_query WHERE `start` = '" + start + "' AND `end` = '" + end + "' ";

            if (start == "") {
                sql = "SELECT DISTINCT `end` FROM train_trans_query WHERE `end` LIKE '%" +
                    end + "%'";
            }
            if (end == "") {
                sql = "SELECT DISTINCT `start` FROM train_trans_query WHERE `start` LIKE '%" + start + "%'";
            }

            conn.query(sql, [], function(err, rows) {
                if (err) {
                    res.send(
                        JSON.stringify({
                            code: 1,
                            desc: "train query error"
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
    uploadquery: (req, res, next) => {
        let customerid = req.query.customerid || req.body.customerid,
            customer_query = req.query.customerquery || req.body.customerquery || '',
            type = req.query.type || req.body.type;

        if (customer_query == "") {
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
            let today = sillydate.format(new Date(), 'YYMMDD');

            let sql1 = "SELECT COUNT(*) AS num FROM customer_order WHERE business_number LIKE '%" + today + "%'";
            conn.query(sql1, [], function(err, rows1) {
                if (err) {
                    res.send(
                        JSON.stringify({
                            code: 1,
                            desc: "upload query error"
                        })
                    );
                } else {
                    let curnum = rows1[0].num + 1;

                    let sql = "INSERT INTO customer_order(customerid,customer_query,type,business_number) VALUES (?,?,?,?);";

                    conn.query(sql, [customerid, customer_query, type, 'SFF2' + today + PrefixZero(curnum, 3)], function(err, rows) {
                        if (err) {
                            res.send(
                                JSON.stringify({
                                    code: 1,
                                    desc: "upload query error"
                                })
                            );
                        } else
                            res.send(
                                JSON.stringify({
                                    code: 0,
                                    desc: 'upload success'
                                })
                            );
                    });
                }
            });
        });
    },
    querylist: (req, res, next) => {
        let id = req.query.id || req.body.id || '',
            is_export = req.query.export || req.body.export || '',
            is_aboard = req.query.aboard || req.body.aboard || '',
            status = req.query.status || req.body.status || '',
            pageSize = req.body.pageSize || req.query.pageSize || "",
            pageNum = req.body.pageNum || req.query.pageNum || "";


        req.getConnection(function(err, conn) {
            if (err) return next(err);

            let sql = "SELECT SQL_CALC_FOUND_ROWS * FROM customer_order ";

            sql = searchFiled(sql, id, 'id');
            sql = searchFiled(sql, is_export, 'is_export');
            sql = searchFiled(sql, is_aboard, 'is_aboard');
            sql = searchFiled(sql, status, 'status');

            sql += " ORDER BY id DESC";

            if (pageNum != "" && pageSize != "") {
                let start = (pageNum - 1) * pageSize;
                sql += " LIMIT " + start + "," + pageSize;
            }

            sql += ";SELECT FOUND_ROWS() AS total;";

            conn.query(sql, [], function(err, rows) {
                if (err) {
                    res.send(
                        JSON.stringify({
                            code: 1,
                            desc: "list query error"
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
    removelist: (req, res, next) => {
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

            let sql = "DELETE FROM customer_order WHERE id = ?";

            conn.query(sql, [id], function(err, rows) {
                if (err) {
                    res.send(
                        JSON.stringify({
                            code: 1,
                            desc: "remove query error"
                        })
                    );
                } else
                    res.send(
                        JSON.stringify({
                            code: 0,
                            desc: 'remove success'
                        })
                    );
            });
        });
    },
    updatelist: (req, res, next) => {
        let id = req.query.id || req.body.id || '',
            admin_price = req.query.price || req.body.price || '',
            admin_price1 = req.query.price1 || req.body.price1 || '',
            status = req.query.status || req.body.status || '',
            curPrice = '';

        req.getConnection(function(err, conn) {
            if (err) return next(err);

            let sql = "UPDATE customer_order SET admin_price = ?, `status` = ? WHERE id = ?";

            if (admin_price1 == '') {
                sql = "UPDATE customer_order SET admin_price = ?, `status` = ? WHERE id = ?";
                curPrice = admin_price;
            } else if (admin_price == '') {
                sql = "UPDATE customer_order SET admin_price1 = ?, `status` = ? WHERE id = ?";
                curPrice = admin_price1;
            }

            conn.query(sql, [curPrice, status, id], function(err, rows) {
                if (err) {
                    res.send(
                        JSON.stringify({
                            code: 1,
                            desc: "update query error"
                        })
                    );
                } else
                    res.send(
                        JSON.stringify({
                            code: 0,
                            desc: 'update success'
                        })
                    );
            });
        });
    },
    setordertype: (req, res, next) => {
        let id = req.query.id || req.body.id || '',
            is_export = req.query.export || req.body.export,
            is_aboard = req.query.aboard || req.body.aboard;

        req.getConnection(function(err, conn) {
            if (err) return next(err);

            let sql = "UPDATE customer_order SET is_export = ?, is_aboard = ? WHERE id = ?";

            conn.query(sql, [is_export, is_aboard, id], function(err, rows) {
                if (err) {
                    res.send(
                        JSON.stringify({
                            code: 1,
                            desc: "set type error"
                        })
                    );
                } else
                    res.send(
                        JSON.stringify({
                            code: 0,
                            desc: 'set type success'
                        })
                    );
            });
        });
    },
    getorder: (req, res, next) => {
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

            let sql = "SELECT * FROM customer_order WHERE id = ?";

            conn.query(sql, [id], function(err, rows) {
                if (err) {
                    res.send(
                        JSON.stringify({
                            code: 1,
                            desc: "get order query error"
                        })
                    );
                } else {
                    let curStatus = rows[0].status;
                    if (curStatus == 3) {
                        res.send(
                            JSON.stringify({
                                code: 1,
                                desc: '已完成'
                            })
                        );
                    } else if (curStatus == 4) {
                        res.send(
                            JSON.stringify({
                                code: 2,
                                desc: '正在编辑'
                            })
                        );
                    } else {
                        let sql1 = "UPDATE customer_order SET `status` = 4 WHERE id = ?";
                        conn.query(sql1, [id], function(err1, rows1) {
                            if (err1) {
                                res.send(
                                    JSON.stringify({
                                        code: 1,
                                        desc: "get order " + err1
                                    })
                                );
                            } else res.send(
                                JSON.stringify({
                                    code: 0,
                                    desc: rows[0]
                                })
                            );
                        });
                    }
                }
            });
        });
    },
};