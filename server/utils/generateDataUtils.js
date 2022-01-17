'use strict';

let usersGenerator = require('multi-users-generator');

// список групп
const groups = [
    { name: 'CEO' },
    { name: 'Designers' },
    { name: 'Development' },
    { name: 'Outsourced' }
];

const positions = [
    'UI Designer',
    'Senior UI Designer',
    'Manager',
    'CEO Specialist',

];

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
};

const userDataTemplates = [
    {
        position: 'Programmer',
        phone: "+123(456)123-45-67",
        groupId: null
    },
    {
        position: 'UI Designer',
        phone: "+255(666)177-45-67",
        groupId: null
    },
    {
        position: 'Manager',
        phone: "+177(890)123-45-67",
        groupId: null
    },
    {
        position: 'CEO Specialist',
        phone: "+890(000)123-45-67",
        groupId: null
    },
    {
        position: 'Engineer',
        phone: "+111(222)876-45-67",
        groupId: null
    }
]

// генерация списка пользователей
export let generateUsers = (count) => {
	const multi = usersGenerator.multiUsers(count);

	const result = multi.map(item => {
		item.personalPage = item.imageUrl;

		delete item.address;
		delete item.username;
		delete item.imageUrl;

        const r = getRandomInt(4);
        const userDataTemplate = userDataTemplates[r];

		item.phone = userDataTemplate.phone;
        item.position = userDataTemplate.position;
		item.groupId = userDataTemplate.groupId;
		
		return item;
	});
	
	return result;
}