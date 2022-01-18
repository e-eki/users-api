'use strict';

const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const userSchema = require('../schemas/user');

// модель пользователя
const UserModel = mongoose.model('User', userSchema);

const defaultSortName = 'name';
const defaultSearchName = 'name';
const ascSortDirection = {name: 'asc', value: 1};
const descSortDirection = {name: 'desc', value: -1};

// получить параметры для запроса списка пользователей
const getAggregationConfigByFilter = (filter) => {
	const aggregationConfig = [];

	if (filter) {
		if (filter.groupId) {
			aggregationConfig.push({$match: { 'groupId': new ObjectId(filter.groupId)}});
		}

		if (!!filter.searchText) {
			const match = {};
			match['$match'] = {};

			if (!filter.searchType || (filter.searchType === defaultSearchName)) {
				match['$match'] = {$or: [{'firstName': {$regex:`${filter.searchText}`}}, {'lastName': {$regex:`${filter.searchText}`}} ] };
			} else {
				match['$match'][`${filter.searchType}`] = { $regex: `${filter.searchText}`};
			}
			aggregationConfig.push(match);
		}

		if (!!filter.sortType) {
			const sortDirectionValue = (!!filter.sortDirectionType && filter.sortDirectionType === descSortDirection.name) ? descSortDirection.value : ascSortDirection.value;
			const sort = {};
			sort['$sort'] = {};

			if (filter.sortType === defaultSortName) {
				sort['$sort']['firstName'] = sortDirectionValue;
				sort['$sort']['lastName'] = sortDirectionValue;
			} else {
				sort['$sort'][`${filter.sortType}`] = sortDirectionValue;
			}

			aggregationConfig.push(sort);
		}

		if (!!filter.start) {
			aggregationConfig.push({ $skip : parseInt(filter.start) });
		}

		if (!!filter.limit) {
			aggregationConfig.push({ $limit : parseInt(filter.limit) });
		}
	}
	return aggregationConfig;
};

// получить параметры для запроса количества пользователей
const getCountConfig = (filter) => {
	let countConfig = {};

	if (filter) {
		if (filter.groupId) {
			countConfig['groupId'] = new ObjectId(filter.groupId);
		}

		if (!!filter.searchText) {
			if (!filter.searchType || (filter.searchType === defaultSearchName)) {
				countConfig['$or'] = [{'firstName': {$regex:`${filter.searchText}`}}, {'lastName': {$regex:`${filter.searchText}`}} ];
			} else {
				countConfig[`${filter.searchType}`] = { $regex: `${filter.searchText}`};
			}
		}
	}
	return countConfig;
}

module.exports = {
	query: function(filter) {
		let queryConfig = [];
		if (!!filter) {
			queryConfig = filter.getCount ? getCountConfig(filter) : getAggregationConfigByFilter(filter);
		}

		if (!!filter && filter.getCount) {
			return UserModel.count(queryConfig);
		}

		queryConfig.push(
			{$project: {
				_id: 0, id: "$_id",
				firstName: 1,
				lastName: 1,
				personalPage: 1,
				email: 1,
				position: 1,
				phone: 1,
				groupId: 1,
				groupName: 1
			}
		});
		return UserModel.aggregate(queryConfig);
	},
	
	create: function(data) {
		const user = new UserModel({
			firstName: data.firstName,
			lastName: data.lastName,
			personalPage: data.personalPage,
			email: data.email,
			position: data.position,
			phone: data.phone,
			groupId: data.groupId,
			groupName: data.groupName,
		});
	
		return user.save();
	}
}