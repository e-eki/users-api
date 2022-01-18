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
    let groupsIds = [];
    let filter;

    return Promise.resolve(true)
      .then(() => {
        filter = req.query;

        return Promise.resolve(groupModel.query());
      })
      .then(groups  => {
        groupsData = groups;
        groupsIds = groups.map(item => item.id);
        const tasks = [];

        groupsIds.forEach(id => {
          tasks.push(userModel.query({groupId: id, ...filter}));
        });

        return Promise.all(tasks);
      })
      .then(users => {
        for (let i = 0; i < groupsData.length; i++) {
          groupsData[i].users = users[i] || [];
        }
        
        const tasks = [];
        groupsIds.forEach(id => {
          tasks.push(userModel.query({getCount: true, groupId: id, ...filter}));
        });

        return Promise.all(tasks);
      })
      .then(counts  => {
        const count = Math.max.apply(null, counts);
        // for (let i = 0; i < groupsData.length; i++) {
        //   groupsData[i].total = counts[i] || [];
        // }

        const result = {
          data: JSON.stringify(groupsData),
          total: count
        };

        return utils.sendResponse(res, result);
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
