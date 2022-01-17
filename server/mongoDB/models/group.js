'use strict';

const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const groupSchema = require('../schemas/user');

// модель группы
const GroupModel = mongoose.model('Group', groupSchema);

module.exports = {
	
	query: function(config) {
		if (config) {
			// if (config.id) {
			// 	return UserModel.aggregate([
			// 		{$match: { '_id': new ObjectId(config.id)}},
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
		}	

		return GroupModel.aggregate([
			// {'$sort': {'name': 1, 'lastName': 1}},  // по названию по возрастанию
			{$project: {
				_id: 0, id: "$_id",
				name: 1,
			}}
		]);
	},
	
	create: function(data) {
		const group = new GroupModel({
			name: data.name
		});
	
		return group.save();
	}
}