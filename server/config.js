'use strict';

// const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
    version: '1.0'
    
    // настройки сервера
    , server: {
        port: 3000   //process.env.PORT || 3000
        , host: 'localhost'
        , protocol: 'http'
    }
    // , server: {    // для heroku
    //     port: process.env.PORT || 8000
    //     , host: 'test-task-users-app.herokuapp.com'
    //     , protocol: 'https'
    // }
    // название файла с логами БД
    , logFileName: 'dbLogs.log'
    // настройки соединения с БД
    , db : {
        mongo : {
            url: 'mongodb+srv://eeki:feanoring1320@cluster0.tltda.mongodb.net/UsersAppDatabase?retryWrites=true&w=majority'
            , options: {
                autoReconnect: true
                , useNewUrlParser: true 
            }
        }
    }
};
