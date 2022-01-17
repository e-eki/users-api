'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// схема пользователя
const userSchema = new Schema(
	{
		firstName: { type: String },     // имя
		lastName: { type: String },      // фамилия
		personalPage: { type: String },  // ссылка на личную страницу
		email: { type: String },         // имейл
		position: { type: String },      // должность
		phone: { type: String },         // телефон
		groupId: Schema.Types.ObjectId,  // id группы
	},
	{versionKey: false}
);

module.exports = userSchema;
