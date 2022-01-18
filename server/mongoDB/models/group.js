'use strict';

const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const groupSchema = require('../schemas/group');

// модель группы
const GroupModel = mongoose.model('Group', groupSchema);

module.exports = {
	
	query: function(filter) {
		const aggregationConfig = [];

		if (filter) {
			if (filter.id) {
				aggregationConfig.push({$match: { '_id': new ObjectId(filter.id)}});
			}
		}

		aggregationConfig.push(
			{$project: {
				_id: 0, id: "$_id",
				name: 1,
			}}
		);

		return GroupModel.aggregate(aggregationConfig);
	},
	
	create: function(data) {
		const group = new GroupModel({
			name: data.name
		});
	
		return group.save();
	}
}