'use strict';

const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const userSchema = require('../schemas/user');

// модель пользователя
const UserModel = mongoose.model('User', userSchema);

const defaultSortName = 'name';
const defaultSort = {'$sort': {'firstName': 1, 'lastName': 1}};
// const defaultSearchType = ''

module.exports = {
	
	query: function(filter) {
		const aggregationConfig = [];

		if (filter) {
			if (filter.groupId) {
				aggregationConfig.push({$match: { 'groupId': new ObjectId(config.groupId)}});
			}
			if (!!filter.searchText) {
				if (!!filter.searchText) {
					//
				}
			}
			if (!!filter.sortType) {
				if (filter.sortType === defaultSortName) {
					aggregationConfig.push(defaultSort);
				} else {
					const sort = {};
					sort['$sort'] = {};
					sort['$sort'][`${filter.sortType}`] = 1;
					aggregationConfig.push(sort);
				}
			}
			if (!!filter.start) {
				aggregationConfig.push({ $skip : parseInt(filter.currentPage) });
			}
			if (!!filter.limit) {
				// aggregationConfig.push({ $limit : parseInt(filter.limit) });
			}
		}

		aggregationConfig.push(
			{$project: {
				_id: 0, id: "$_id",
				groupId: 1,
				firstName: 1,
				lastName: 1,
				personalPage: 1,
				email: 1,
				position: 1,
				phone: 1,
			}
		});

		return UserModel.aggregate(aggregationConfig);
		

			// if (config.groupId) {
			// 	return UserModel.aggregate([
			// 		{$match: { 'groupId': new ObjectId(config.groupId)}},
			// 		{'$sort': {'firstName': 1, 'lastName': 1}},  // по имени-фамилии по возрастанию
			// 		{$project: {
			// 			_id: 0, id: "$_id",
			// 			groupId: 1,
			// 			firstName: 1,
			// 			lastName: 1,
			// 			personalPage: 1,
			// 			email: 1,
			// 			position: 1,
			// 			phone: 1,
			// 		}}
			// 	]);
			// }
		// }	

		// return UserModel.aggregate([
		// 	{'$sort': {'firstName': 1, 'lastName': 1}},  // по имени-фамилии по возрастанию
		// 	{$project: {
		// 		_id: 0, id: "$_id",
		// 		groupId: 1,
		// 		firstName: 1,
		// 		lastName: 1,
		// 		personalPage: 1,
		// 		email: 1,
		// 		position: 1,
		// 		phone: 1,
		// 	}}
		// ]);
	},
	
	create: function(data) {
		const user = new UserModel({
			firstName: data.firstName,
			lastName: data.lastName,
			personalPage: data.personalPage,
			email: data.email,
			position: data.position,
			phone: data.phone,
			groupId: data.groupId || null,
		});
	
		return user.save();
	}
}