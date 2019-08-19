import User from '../models/User';

export default async () => {
	console.log('Pruning old session tokens');
	const date = new Date();
	date.setDate(date.getDate() - 5);
	const users = await User.find({ lastOnline: { $lt: date } }).exec();
	for (var user in users) {
		users[user].sessionToken = null;
		await users[user].save();
	}
};
