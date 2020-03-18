function getDbConfig() {
    return {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '*******',
        database: 'word2.0',
        multipleStatements: true
    }
}

module.exports = {
    getDbConfig: getDbConfig
}