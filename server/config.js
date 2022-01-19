'use strict';

module.exports = {
    version: '1.0'
    
    // настройки сервера
    , server: {
        port: 3000
        , host: 'localhost'
        , protocol: 'http'
    }
    // название файла с логами БД
    , logFileName: 'dbLogs.log'
    // настройки соединения с БД
    , db : {
        mongo : {
            url: '<url>'
            , options: {
                autoReconnect: true
                , useNewUrlParser: true 
            }
        }
    }
};
