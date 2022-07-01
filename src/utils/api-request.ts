import { createUserWithEmailAndPassword, type UserCredential } from 'firebase/auth';
import { auth } from './admin';

import axios from 'axios';

const apiCall = axios.create({ baseURL: 'http://127.0.0.1:5000' });

export const fetchStories = (familyId: string) => {
	return apiCall.get(`/stories/${familyId}`).then((res) => {
		return res.data;
	});
};

export const postStory = (story: any) => {
	return apiCall.post('/stories', story).then((res) => {
		return res.data;
	});
};

export const fetchUserStatus = (email: string) => {
	return Promise.resolve('not found');
};

export const createNewUserAndFamily = async (
	email: string,
	fullName: string,
	displayName: string,
	password: string,
	familyName: string
) => {
	try {
		// create the user in firebase AUTH
		const userCredential: UserCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);

		// TODO: create a record for the user, with all the details, in firebase DB
		const userIdToPassToDbIs = userCredential.user.uid;
		// example of returned object, replace with API response
		return Promise.resolve({
			uid: userCredential.user.uid,
			// placeholder - create automagically for now
			fid: '960d1c6b-fc65-484b-99b3-9dc66914bae5'
		});
	} catch (error) {
		console.error(error);
		// temp rejecting until api endpoint is available (ask andy if this doesn't make sense)
		return Promise.reject();
	}
};

export const inviteUser = async (email: string, familyId: string) => {
	// may need to check if user has already been invited(?)
	// POST to /users
	// should create a new user and store the family id + store the user in the families object

	// temporary return
	return Promise.resolve({
		uid: email
	});
};
