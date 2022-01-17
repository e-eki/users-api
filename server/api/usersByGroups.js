'use strict';

const express = require('express');
const Promise = require('bluebird');
const utils = require('../utils/baseUtils');
const userModel = require('../mongoDB/models/user');
const groupModel = require('../mongoDB/models/group');
const errors = require('../utils/errors');

let router = express.Router();

//----- endpoint: /api/users-by-groups/
router.route('/users-by-groups')
  // получение списка пользователей по группам
  .get(function(req, res) {
    let groupsData = [];

    return Promise.resolve(true)
      .then(() => {
        return Promise.resolve(groupModel.query());
      })
      .then(groups  => {
        groupsData = groups;
        const tasks = [];

        groups.forEach(group => {
          tasks.push(userModel.query({groupId: group.id}));
        });

        return Promise.all(tasks);
      })
      .then(users => {
        for (let i = 0; i < groupsData.length; i++) {
          groupsData[i].users = users[i] || [];
        }

        return utils.sendResponse(res, groupsData);
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
