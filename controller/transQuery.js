let sillydate = require("silly-datetime");

let FILE_TYPE = ['空运', '国际快递', '铁路', '海运拼箱', '海运整箱'];

let SHIP_CITY = {
    "中日韩": {
        "中国航线": ["深圳", "上海", "宁波", "广州", "厦门", "青岛", "天津", "大连", "高雄", "基隆", "台中", "香港"],
        "日本航线": ["大阪", "神户", "东京", "横滨", "名古屋"],
        "韩国航线": ["釜山", "仁川"]
    },
    "欧洲": {
        "西欧航线": ["勒阿弗尔", "汉堡", "费利克斯托", "安特卫普", "鹿特丹"],
        "北欧航线": ["赫尔辛基", "哥本哈根", "哥德堡", "奥斯陆", "格丁尼亚"]
    },
    "地中海": {
        "地中海航线": ["巴塞罗那", "福斯", "拉斯佩齐亚", "那不勒斯", "马耳他"],
        "地东航线": ["塞得港", "伊斯坦布尔", "比雷埃夫斯", "利马索尔", "阿什杜德", "拉塔基亚", "贝鲁特"],
        "黑海航线": ["康斯坦察", "敖德萨", "瓦尔纳", "新罗斯科斯克", "波提"],
        "亚的里亚海": ["的里雅斯特", "科佩尔", "里耶卡"]
    },
    "印巴": {
        "印巴航线": ["新德里", "拉瓦沙瓦", "孟买", "加尔各答", "清奈", "班加罗尔", "科钦", "海德拉巴", "卡拉奇", "吉大港", "达卡", "科伦坡"]
    },
    "中东红海": {
        "中东航线": ["杰贝阿里", "马斯喀特", "利雅德", "多哈", "乌姆盖茨", "舒瓦克", "霍拉姆沙赫尔", "巴林"],
        "红海航线": ["吉达", "亚丁", "塞拉莱", "亚喀巴", "索科纳", "苏丹港", "吉布提"]
    },
    "北美": {
        "美西航线": ["洛杉矶", "长滩", "奥克兰"],
        "美东航线": ["纽约", "诺福克", "萨凡纳", "查尔斯敦", "巴尔的摩", "威尔明顿", "迈阿密", "休斯敦", "新奥尔良"],
        "加拿大航线": ["温哥华", "多伦多", "蒙特利尔"]
    },
    "中南美": {
        "墨西哥航线": ["曼萨尼约"],
        "中美洲航线": ["圣何塞", "阿卡胡特拉", "卡尔德拉港", "科林托", "圣佩德罗苏拉"],
        "巴拿马航线": ["科隆"],
        "南美西航线": ["布埃纳文图拉", "瓜亚基尔", "卡亚俄", "伊基克"],
        "南美东航线": ["桑托斯", "里约热内卢", "布宜诺斯艾利斯", "蒙德维的亚", "亚松森"],
        "加勒比海": ["拉瓜伊拉", "考塞多", "金斯敦", "西班牙港", "弗里波特", "布里奇敦", "太子港", "巴兰基亚", "圣胡安", "威廉斯塔德", "伯利兹城", "奥拉涅撕塔德", "乔治敦", "帕拉马里博", "哈瓦纳", "卡斯特里"]
    },
    "非洲": {
        "北非航线": ["阿尔及尔", "卡萨布兰卡", "突尼斯", "班加西"],
        "西非航线": ["蒙罗维亚", "拉各斯", "科托努", "阿比让", "利伯维尔", "洛美", "杜阿拉", "努瓦克肖特", "特马"],
        "东非航线": ["贝拉", "达累斯萨拉姆", "蒙巴萨", "加莱角", "路易港"],
        "南非航线": ["德班", "伊丽莎白港", "约翰内斯堡", "鲸湾港"]
    },
    "澳洲": {
        "澳新航线": ["布里斯班", "悉尼", "墨尔本", "奥克兰", "威灵顿", "利特尔顿"]
    },
    "东南亚": {
        "东南亚航线": ["曼谷", "新加坡", "槟城", "巴生港", "雅加达", "马尼拉", "胡志明市", "仰光"]
    }
};

let AIR_CITY = {
    "中日韩": {
        "中国": ["北京", "上海", "广州", "深圳", "杭州", "宁波", "青岛", "香港", "台北", "高雄"],
        "日本": ["东京", "大阪", "名古屋"],
        "韩国": ["仁川", "釜山"]
    },
    "东南亚": [
        "胡志明", "曼谷", "马尼拉",
        "雅加达", "吉隆坡", "河内",
        "金边", "万象", "新加坡",
        "槟城", "沙巴", "泗水",
        "斯里巴加湾", "宿务"
    ],
    "欧洲": [
        "阿姆斯特丹", "雅典", "布加勒斯特", "巴黎",
        "哥本哈根", "法兰克福", "赫尔辛基", "基辅", "伦敦",
        "里斯本", "马德里", "莫斯科", "慕尼黑", "米兰",
        "华沙", "苏黎世", "爱丁堡", "曼彻斯特", "贝尔法斯特", "都柏林",
        "布鲁塞尔", "维也纳", "布达佩斯", "马赛", "里昂", "布拉格",
        "伯尔尼", "日内瓦", "斯德哥尔摩", "奥斯陆", "柏林",
        "汉诺威", "杜塞尔多夫", "巴塞罗那", "罗马", "威尼斯", "雅典", "莫斯科"
    ],
    "北美": [
        "渥太华", "温哥华", "多伦多", "休斯顿", "华盛顿",
        "波士顿", "芝加哥", "达拉斯", "底特律", "纽瓦克",
        "西雅图", "拉斯维加斯", "洛杉矶", "纽约", "旧金山",
        "夏威夷", "亚特兰大", "新奥尔良", "迈阿密"
    ],
    "中南美": [
        "亚松森", "波哥大", "利马",
        "拉巴斯",
        "墨西哥城",
        "蒙德维蒂纳",
        "帕拉马里博",
        "圣地亚哥",
        "基多",
        "圣何塞",
        "巴拿马城",
        "哈瓦那",
        "金斯顿",
        "圣菲波哥大",
        "加拉加斯",
        "巴西利亚",
        "圣保罗", "布宜诺斯艾利斯"
    ],
    "澳洲": [
        "奥克兰",
        "布里斯班",
        "墨尔本",
        "纳迪",
        "悉尼",
        "惠灵顿",
        "堪培拉",
        "珀斯",
        "阿德莱德"
    ],
    "中东": [
        "巴士拉",
        "多哈",
        "迪拜",
        "德黑兰",
        "马斯喀特",
        "利雅得",
        "特拉维夫",
        "阿布扎比",
        "吉达",
        "巴林",
        "伊斯坦布尔"
    ],
    "印巴": [
        "孟买",
        "科伦坡",
        "达卡",
        "新德里",
        "加德满都",
        "拉合尔",
        "帕罗",
        "加尔各答",
        "清奈",
        "伊斯兰堡",
        "卡拉奇"
    ],
    "非洲": [
        "阿尔及尔",
        "开罗",
        "达里斯萨拉姆",
        "约翰内斯堡",
        "罗安达",
        "拉各斯",
        "卢萨卡",
        "内罗毕",
        "开普敦",
        "雅温得",
        "阿布贾",
        "亚的斯亚贝巴",
        "金沙萨",
        "布拉柴维尔",
        "突尼斯",
        "马普托",
        "阿克拉",
        "弗里敦"
    ],
    "中亚": [
        "阿什哈巴德",
        "第比利斯",
        "杜尚别",
        "巴库",
        "塔什干",
        "埃里温",
        "喀布尔",
        "乌兰巴托",
        "比什凯克"
    ]
}

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

            let sql = "SELECT * FROM air_trans_query WHERE CONCAT_WS(',',dep_airport_cn,dep_airport_en,dep_airport_code) LIKE '%" + start +
                "%' AND CONCAT_WS(',',des_airport_cn,des_airport_en,des_airport_code) LIKE '%" + end + "%'";

            if (start == "") {
                sql = "SELECT DISTINCT des_airport_cn,des_airport_en,des_airport_code  FROM air_trans_query WHERE CONCAT_WS(',',des_airport_cn,des_airport_en,des_airport_code) LIKE '%" +
                    end + "%'";
            }
            if (end == "") {
                sql = "SELECT DISTINCT dep_airport_cn,dep_airport_en,dep_airport_code  FROM air_trans_query WHERE CONCAT_WS(',',dep_airport_cn,dep_airport_en,dep_airport_code) LIKE '%" +
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

            let sql = "SELECT * FROM ship_trans_query WHERE CONCAT_WS(',',dep_port_cn,dep_port_en) LIKE '%" + start +
                "%' AND CONCAT_WS(',',des_port_cn,des_port_en) LIKE '%" + end + "%'";

            if (start == "") {
                sql = "SELECT DISTINCT des_port_cn,des_port_en FROM ship_trans_query WHERE CONCAT_WS(',',des_port_cn,des_port_en) LIKE '%" +
                    end + "%'";
            }
            if (end == "") {
                sql = "SELECT DISTINCT dep_port_cn,dep_port_en FROM ship_trans_query WHERE CONCAT_WS(',',dep_port_cn,dep_port_en) LIKE '%" +
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

            let sql = "SELECT * FROM ship1_trans_query WHERE CONCAT_WS(',',dep_port_cn,dep_port_en) LIKE '%" + start +
                "%' AND CONCAT_WS(',',des_port_cn,des_port_en) LIKE '%" + end + "%'";

            if (start == "") {
                sql = "SELECT DISTINCT des_port_cn,des_port_en  FROM ship1_trans_query WHERE CONCAT_WS(',',des_port_cn,des_port_en) LIKE '%" +
                    end + "%'";
            }
            if (end == "") {
                sql = "SELECT DISTINCT dep_port_cn,dep_port_en FROM ship1_trans_query WHERE CONCAT_WS(',',dep_port_cn,dep_port_en) LIKE '%" +
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
            let sql = "SELECT * FROM delivery_trans_query  WHERE CONCAT_WS(',',country_cn,country_en) LIKE '%" + end + "%'";
            if (mode == 1) {
                sql = "SELECT DISTINCT country_cn,country_en FROM `delivery_trans_query` WHERE CONCAT_WS(',',country_cn,country_en) LIKE '%" + end + "%'";
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
    getExchange: (req, res, next) => {

        req.getConnection(function(err, conn) {
            if (err) return next(err);

            let sql = "SELECT * FROM customer_exchange;";

            conn.query(sql, function(err, rows) {
                if (err) {
                    res.send(
                        JSON.stringify({
                            code: 1,
                            desc: "get exchange error"
                        })
                    );
                } else
                    res.send(
                        JSON.stringify({
                            code: 0,
                            desc: rows[0]
                        })
                    );
            });
        });
    },
    setExchange: (req, res, next) => {
        let usd = req.query.usd || req.body.usd || '',
            eur = req.query.eur || req.body.eur || '';

        req.getConnection(function(err, conn) {
            if (err) return next(err);

            let sql = "UPDATE customer_exchange SET usd = ?, eur = ?";

            conn.query(sql, [usd, eur], function(err, rows) {
                if (err) {
                    res.send(
                        JSON.stringify({
                            code: 1,
                            desc: "get exchange error"
                        })
                    );
                } else
                    res.send(
                        JSON.stringify({
                            code: 0,
                            desc: 'set exchange success'
                        })
                    );
            });
        });
    },
    getCity: (req, res, next) => {
        let mode = req.query.mode || req.body.mode || '';

        if (mode == '') {
            res.send(
                JSON.stringify({
                    code: 1,
                    desc: "invalid input"
                })
            );
        } else if (mode == 1) {
            res.send(
                JSON.stringify({
                    code: 0,
                    desc: SHIP_CITY
                })
            );
        } else if (mode == 2) {
            res.send(
                JSON.stringify({
                    code: 0,
                    desc: AIR_CITY
                })
            );
        }
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