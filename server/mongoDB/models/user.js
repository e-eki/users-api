'use strict';

const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const userSchema = require('../schemas/user');

// модель пользователя
const UserModel = mongoose.model('User', userSchema);

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

		return UserModel.aggregate([
			{'$sort': {'firstName': 1, 'lastName': 1}},  // по имени-фамилии по возрастанию
			{$project: {
				_id: 0, id: "$_id",
				groupId: 1,
				firstName: 1,
				lastName: 1,
				personalPage: 1,
				email: 1,
				position: 1,
				phone: 1,
			}}
		]);
	},
	
	create: function(data) {
		const user = new UserModel({
			firstName: data.firstName,
			lastName: data.lastName,
			personalPage: data.personalPage,
			email: data.email,
			position: data.position,
			groupId: data.groupId || null,
		});
	
		return user.save();
	}
}