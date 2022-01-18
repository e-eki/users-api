'use strict';

const errors = require('./errors');
const responses = require('./responses');

// различные утилиты
const utils = new function() {

    // выбросить указанную ошибку
	/*data = {
		errorData: <  error object >,
		messageData: < string or array of string >,
	}*/
    this.initError = function(errorData, messageData) {
        let error = {};
        error.status = (errorData && errorData.status) ? errorData.status : 500;
        error.message = (errorData && errorData.message) ? errorData.message : '';

        if (messageData) {
            error.message += ':\n';

            if (typeof(messageData) === 'string') {
                error.message += messageData;
            }
            else if (messageData.length) {
                messageData.forEach(item => {
                    error.message += item;
                    error.message += '\n';
                })
            }
        }

        return error;
    };

    // отправка ответа
    this.sendResponse = function(res, responseData, statusCode) {
        const status = statusCode || responses.OK_RESPONSE.status;
        const response = responseData; //|| responses.OK_RESPONSE.message;

        return res.status(status).send(response);
    };

    // отправка ошибки
	this.sendErrorResponse = function(res, error) {
        const status = error.status || errors.INTERNAL_SERVER_ERROR.status;
        const message = error.message || errors.INTERNAL_SERVER_ERROR.message;

        return res.status(status).send(message);
    };
};

module.exports = utils;