'use strict';

const express = require('express');
const Promise = require('bluebird');
const utils = require('../utils/baseUtils');
const logUtils = require('../utils/logUtils');
const userModel = require('../mongoDB/models/user');
const groupModel = require('../mongoDB/models/group');
const errors = require('../utils/errors');
const responses = require('../utils/responses');

let router = express.Router();

//----- endpoint: /api/users/
router.route('/users')
  // получение списка пользователей
  .get(function(req, res) { 
    return Promise.resolve(true)
      .then(() => {
        const filter = req.query;

        const tasks = [];
        tasks.push(userModel.query(filter));
        tasks.push(userModel.query({getCount: true, ...filter}));

        return Promise.all(tasks);
      })
      .spread((data, count)  => {
        const result = {
          data: JSON.stringify(data),
          total: count
        };
        return utils.sendResponse(res, result);
      })
      .catch((error) => {
				return utils.sendErrorResponse(res, error);
      });
  })

  // создание нового пользователя
  /*data = {
		firstName,
    lastName,
    personalPage,
    email,
    position,
    phone,
    groupId
	}*/
  .post(function(req, res) {
    return Promise.resolve(true)
			.then(() => {
        const validationErrors = [];

				//validate req.body
				if (!req.body.firstName || req.body.firstName == '') {
					validationErrors.push('empty firstName');
				}
				if (!req.body.lastName || req.body.lastName == '') {
					validationErrors.push('empty lastName');
				}
        if (!req.body.personalPage || req.body.personalPage == '') {
					validationErrors.push('empty personalPage');
				}
        if (!req.body.email || req.body.email == '') {
					validationErrors.push('empty email');
				}
        if (!req.body.position || req.body.position == '') {
					validationErrors.push('empty position');
				}
        if (!req.body.phone || req.body.phone == '') {
					validationErrors.push('empty phone');
				}
        if (validationErrors.length !== 0) {
					throw utils.initError(errors.FORBIDDEN, validationErrors);
        }

        const tasks = [];
        if (req.body.groupId) {
          tasks.push(groupModel.query({id: req.body.groupId}));
        }

        return Promise.all(tasks);
      })
      .spread((groups) => {
        const data = req.body;
        const group = (!!groups && !!groups[0]) ? groups[0] : null;

        const user = {
          firstName: data.firstName,
          lastName: data.lastName,
          personalPage: data.personalPage,
          email: data.email,
          position: data.position,
          phone: data.phone,
          groupId: group?.id || null,
          groupName: group?.name || null
        };

        return userModel.create(user);
      })
      .then(dbResponse => {
        logUtils.fileLogDbErrors(dbResponse);

        const id = (dbResponse._doc && dbResponse._doc._id) ? dbResponse._doc._id.toString() : null;
				return utils.sendResponse(res, {text: 'successfully saved', id: id}, responses.CREATED_RESPONSE.status);
			})
			.catch((error) => {
				return utils.sendErrorResponse(res, error);
			});
  })
  .put(function(req, res) {
		return utils.sendErrorResponse(res, errors.UNSUPPORTED_METHOD);
  })
  .delete(function(req, res) {
		return utils.sendErrorResponse(res, errors.UNSUPPORTED_METHOD);
	})
;

module.exports = router;
