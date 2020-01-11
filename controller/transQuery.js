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
    delievryquery: (req, res, next) => {
        let end = req.query.end || req.body.end || "";

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
    }
};