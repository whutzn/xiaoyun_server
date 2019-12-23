module.exports = {
  setinfo: (req, res, next) => {
    let type = req.query.type || req.body.type || "",
      content = req.query.content || req.body.content || "",
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

      let sql = "UPDATE customer_info SET content = ?, pname = ? WHERE id = ?";

      conn.query(sql, [content,pname,type], function(err, rows) {
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
              desc: 'set info ok'
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
          if(rows[0].pname != '') rows[0].pname = 'http://47.104.73.104:3000/customer/' + rows[0].pname;
          res.send(
            JSON.stringify({
              code: 0,
              desc: rows[0]
            })
          ); 
        }
      });
    });
  }
};
