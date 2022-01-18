'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// схема группы
const groupSchema = new Schema(
	{
		name: { type: String },     // наименование
	},
	{versionKey: false}
);

module.exports = groupSchema;
