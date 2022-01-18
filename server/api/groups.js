'use strict';

const express = require('express');
const Promise = require('bluebird');
const utils = require('../utils/baseUtils');
const logUtils = require('../utils/logUtils');
const groupModel = require('../mongoDB/models/group');
const errors = require('../utils/errors');
const responses = require('../utils/responses');

let router = express.Router();

//----- endpoint: /api/groups/
router.route('/groups')
  // получение списка групп
  .get(function(req, res) { 
    return Promise.resolve(true)
      .then(() => {
        return groupModel.query();
      })
      .then(data => {
        return utils.sendResponse(res, data);
      })
      .catch((error) => {
				return utils.sendErrorResponse(res, error);
      });
  })

  // создание новой группы
  /*data = {
		name
	}*/
  .post(function(req, res) {
    return Promise.resolve(true)
			.then(() => {
        const validationErrors = [];

				//validate req.body
				if (!req.body.name || req.body.name == '') {
					validationErrors.push('empty name');
				}
				if (validationErrors.length !== 0) {
					throw utils.initError(errors.FORBIDDEN, validationErrors);
        }

				const data = {
          name: req.body.name,
        };

        return groupModel.create(data);
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

//----- endpoint: /api/groups/:id
router.route('/groups/:id')
  // получение группы по ее id
  .get(function(req, res) { 
    return Promise.resolve(true)
      .then(() => {
        return groupModel.query({id: req.params.id});
      })
      .then(data => {
        return utils.sendResponse(res, data);
      })
      .catch((error) => {
				return utils.sendErrorResponse(res, error);
      });
  })
  .post(function(req, res) {
		return utils.sendErrorResponse(res, errors.UNSUPPORTED_METHOD);
	})
  .put(function(req, res) {
		return utils.sendErrorResponse(res, errors.UNSUPPORTED_METHOD);
  })
  .delete(function(req, res) {
		return utils.sendErrorResponse(res, errors.UNSUPPORTED_METHOD);
	})
;

module.exports = router;
