import CSRF from '../models/CSRF';

export default async () => {
	console.log('Pruning old CSRF tokens');
	const csrf = CSRF.find();
};
