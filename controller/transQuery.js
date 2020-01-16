let sillydate = require("silly-datetime");

let FILE_TYPE = ['空运', '国际快递', '铁路', '海运拼箱', '海运整箱'];

function searchFiled(sql, filed, name) {
    if (filed != "") {
        if (sql.indexOf("WHERE") >= 0) {
            sql += " AND customer_order." + name + "= '" + filed + "'";
        } else {
            sql += "WHERE customer_order." + name + " = '" + filed + "'";
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
                sql = "SELECT DISTINCT des_port_cn,des_port_en FROM ship_trans_query WHERE CONCAT(des_port_cn,des_port_en) LIKE '%" +
                    end + "%'";
            }
            if (end == "") {
                sql = "SELECT DISTINCT dep_port_cn,dep_port_en FROM ship_trans_query WHERE CONCAT(dep_port_cn,dep_port_en) LIKE '%" +
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
                sql = "SELECT DISTINCT des_port_cn,des_port_en  FROM ship1_trans_query WHERE CONCAT(des_port_cn,des_port_en) LIKE '%" +
                    end + "%'";
            }
            if (end == "") {
                sql = "SELECT DISTINCT dep_port_cn,dep_port_en FROM ship1_trans_query WHERE CONCAT(dep_port_cn,dep_port_en) LIKE '%" +
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
            if (mode == 1) {
                sql = "SELECT DISTINCT country_cn,country_en FROM `delivery_trans_query` WHERE CONCAT(country_cn,country_en) LIKE '%" + end + "%'";
            } else if (mode == 2) {
                sql = "SELECT  * FROM `delivery_trans_query` WHERE country_cn = '" + end + "' OR country_en = '" + end + "'";
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

            let sql = "SELECT SQL_CALC_FOUND_ROWS customer_order.*, customer.account FROM customer_order LEFT JOIN customer ON customer_order.customerid = customer.id ";

            sql = searchFiled(sql, id, 'id');
            sql = searchFiled(sql, is_export, 'is_export');
            sql = searchFiled(sql, is_aboard, 'is_aboard');
            sql = searchFiled(sql, status, 'status');

            sql += " ORDER BY customer_order.id DESC";

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

            let sql = "UPDATE customer_order SET admin_price = ?,admin_price1 = ?, `status` = ? WHERE id = ?",
                params = [admin_price, admin_price1, status, id];

            if (admin_price1 == '') {
                sql = "UPDATE customer_order SET admin_price = ?, `status` = ? WHERE id = ?";
                curPrice = admin_price;
                params = [curPrice, status, id];
            } else if (admin_price == '') {
                sql = "UPDATE customer_order SET admin_price1 = ?, `status` = ? WHERE id = ?";
                curPrice = admin_price1;
                params = [curPrice, status, id];
            }

            conn.query(sql, params, function(err, rows) {
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
    readOrder: (req, res, next) => {
        let id = req.query.id || req.body.id || '';

        req.getConnection(function(err, conn) {
            if (err) return next(err);

            let sql1 = "SELECT customer_order.*, customer.account, customer.phone FROM customer_order LEFT JOIN customer ON customer_order.customerid = customer.id WHERE customer_order.id = ?"

            conn.query(sql1, [id], function(err, rows1) {
                if (err) {
                    res.send(
                        JSON.stringify({
                            code: 1,
                            desc: "read order1 error " + err
                        })
                    );
                } else {
                    if (rows1.length > 0) {
                        let sql = "INSERT INTO `word2.0`.`business`(`user_id`, `business_number`, `origin`, `destination`, `inco_term`, `business_type`, `pay_type`, `pouch_docs`, `insurance_requirement`, `url`, `hbl_mbl`, `shipper_name`, `shipper_address`, `shipper_contact`, `shipper_usci_code`, `order_date`, `pick_up_date`, `pick_up_contact`, `pick_up_mobile`, `pick_up_address`, `tell_date`, `arrive_date`, `clear_date`, `send_date`, `consignee_name`, `consignee_address`, `consignee_contact`, `consignee_enterprise_code`, `notify_name`, `notify_address`, `notify_contact`, `marks`, `pieces`, `gross_weight`, `chargable_weight`, `commodity_name`, `hs_code`, `package_dimension`, `exchange_rate`, `exchange_rmb`, `reconciliation_date`, `invoice_date`, `remark`, `create_time`, `update_time`) VALUES ?",
                            params = [],
                            customer_query = JSON.parse(rows1[0].customer_query.replace(/[\r\n\s+]/g, '')),
                            price = JSON.parse(rows1[0].admin_price.replace(/[\r\n\s+]/g, '')),
                            price1 = JSON.parse(rows1[0].admin_price1.replace(/[\r\n\s+]/g, ''));

                        params.push(rows1[0].customerid);
                        params.push(rows1[0].business_number);
                        params.push(customer_query.entryPort);
                        params.push(customer_query.exitPort);
                        params.push('');
                        let depway = FILE_TYPE[rows1[0].type - 1];
                        if (rows1[0].type == 2 || rows1[0].type == 3) {
                            params.push(depway);
                        } else {
                            depway += rows1[0].is_export == 1 ? '出口' : '进口';
                            params.push(depway);
                        }
                        params.push('');
                        params.push('');
                        params.push('');
                        params.push('');
                        params.push('');
                        params.push(rows1[0].account);
                        params.push('');
                        params.push(rows1[0].phone);
                        params.push('');
                        params.push(new Date());
                        params.push(price.tiHuoDate || null);
                        params.push(price.chenYunName);
                        params.push(rows1[0].phone);
                        params.push(customer_query.tiAddress);
                        params.push(price1.tiHuoDate);
                        params.push(price1.daoDaDate);
                        params.push(price1.qingGuanDate);
                        params.push(price1.paiSongDate);
                        params.push('');
                        params.push('');
                        params.push('');
                        params.push('');
                        params.push('');
                        params.push('');
                        params.push('');
                        params.push('');
                        params.push(customer_query.productCount + typeof customer_query.containerType == 'undefined' ? customer_query.containerType : '');
                        params.push(customer_query.allWeight);
                        params.push(customer_query.chargingWeight);
                        params.push(customer_query.productName);
                        params.push('');
                        params.push(customer_query.productLong + "*" + customer_query.productWidth + "*" + customer_query.productHeight);
                        params.push(price.moneyType);
                        params.push(price1.moneyType);
                        params.push('0000-00-00');
                        params.push('0000-00-00');
                        params.push('');
                        params.push(new Date());
                        params.push(new Date());


                        conn.query(sql, [
                            [params]
                        ], function(err, rows) {
                            if (err) {
                                res.send(
                                    JSON.stringify({
                                        code: 1,
                                        desc: "read order error " + err
                                    })
                                );
                            } else {
                                let sql1 = "UPDATE customer_order SET `status` = 5 WHERE id = ?";
                                conn.query(sql1, [id], function(err1, rows1) {
                                    if (err1) {
                                        res.send(
                                            JSON.stringify({
                                                code: 1,
                                                desc: "set order send " + err1
                                            })
                                        );
                                    } else res.send(
                                        JSON.stringify({
                                            code: 0,
                                            desc: 'read order success'
                                        })
                                    );
                                });
                            }
                        });
                    }
                }
            });
        });
    },
};