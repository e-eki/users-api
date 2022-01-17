'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Promise = require('bluebird');
const config = require('./config');
const mongoDbUtils = require('./utils/mongoDbUtils');
const utils = require('./utils/baseUtils');
const logUtils = require('./utils/logUtils');
const indexHTML = path.resolve('./frontend/public/index.html');
const errors = require('./utils/errors');

const app = express();
const http = require('http').Server(app);

// статические файлы
app.use(express.static('frontend/public'));

app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
    });

    if (req.method === 'OPTIONS') {
        return res.set({'Allow': 'OPTIONS, GET, POST, PUT, DELETE'}).status(200).end();
    }
    next();
});

app.use(bodyParser.json({type: 'application/json'}));

// ---------------------------------------------------------------
// запросы к api
app.use('/api', require('./api/groups'));
app.use('/api', require('./api/users'));
app.use('/api', require('./api/usersByGroups'));

// ---------------------------------------------------------------

// на все остальные запросы отдаем главную страницу
app.get('/*', (req, res) => res.sendFile(indexHTML));

// Если произошла ошибка валидации, то отдаем 400 Bad Request
app.use((req, res, next) => {
    const error = utils.initError(errors.NOT_FOUND, 'url does not exist');
    return utils.sendErrorResponse(res, error);
});

// Если же произошла иная ошибка, то отдаем 500 Internal Server Error
app.use((error, req, res, next) => {
    return utils.sendErrorResponse(res, error);
});

//app.listen
http.listen(config.server.port, () => {
    // создаем файл для логов
    return Promise.resolve(logUtils.initFileLogger())
        .then(result => {
            //соединение с БД
            return Promise.resolve(mongoDbUtils.setUpConnection());
        })
        .then(result => {
            console.log(`Hosted on:  ${config.server.host}:${config.server.port}`);
            return logUtils.fileLogMessage('----- Set up DB connection -----');
        })
        .catch(error => {
            console.error('Init http-server error: ' + error);
        })
});

// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", () => {
    console.log(`Hosted on:  ${config.server.host}:${config.server.port}`);

    // отключение от БД  (??)
    return Promise.resolve(mongoDbUtils.closeConnection())
        .then(result => {
            process.exit();
        })
});
