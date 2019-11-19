let express = require("express"),
    path = require("path"),
    cookieParser = require("cookie-parser"),
    ejs = require("ejs"),
    logger = require("morgan"),
    bodyParser = require("body-parser"),
    expressValidator = require("express-validator"),
    connection = require('express-mysql-connection'),
    mysql = require("mysql"),
    cors = require("cors"),
    routes = require("./routes"),
    mysqlConfig = require("./config/databaseConfig"),
    app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.engine(".html", ejs.__express);
app.set("view engine", "html");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(bodyParser.urlencoded({ limit: "5gb", extended: false }));
app.use(bodyParser.json({ limit: "5gb" }));
app.use(expressValidator());
app.use(connection(mysql, mysqlConfig.getDbConfig(), "pool"));

routes(app);

module.exports = app;