import { createUserWithEmailAndPassword, type UserCredential } from 'firebase/auth';
import { auth } from './admin';
import axios from 'axios';

const apiCall = axios.create({ baseURL: 'https://be-read-me-a-story.herokuapp.com/' });

export const fetchStories = (familyId: string) => {
	return apiCall.get(`/stories/${familyId}`).then((res) => {
		return res.data;
	});
};

export const fetchStory = (storyId: string) => {
	return apiCall.get(`/stories/story/${storyId}`).then((res) => {
		return res.data;
	});
};

export const postStory = (story: any) => {
	return apiCall.post('/stories', story).then((res) => {
		return res.data;
	});
};

export const fetchUserStatus = async (email: string) => {
	//this needs to return user id - and return family name
	let isInvited: boolean = false;
	let resFamilyId: string = '';
	let resInviteId: string = '';

	try {
		const { data, status } = await apiCall.get(`/users/email/${email}`);
		if (status === 204) {
			return { new_user: 'new user' };
		} else {
			resInviteId = Object.keys(data)[0];
			resFamilyId = Object.keys(data[resInviteId]['families'])[0];
			isInvited = data[resInviteId]['invited'];
			return { resInviteId, resFamilyId, isInvited };
		}
	} catch (error: any) {
		return { message: 'An error has occured' };
	}
};

export const createNewUserAndFamily = async (
	email: string,
	fullName: string,
	displayName: string,
	password: string,
	familyName: string
) => {
	try {
		//create user directly in Firebase database
		const userCredential: UserCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);

		// save user data via python api to Firebase database
		interface User {
			email: string;
			fullName: string;
			displayName: string;
			familyName: string;
			userId: string;
		}

		const user: User = {
			email: email,
			fullName: fullName,
			displayName: displayName,
			familyName: familyName,
			userId: userCredential.user.uid
		};

		const postUserToDatabase = await apiCall.post('/users', user);

		return postUserToDatabase.data.family_id;
	} catch (error) {
		console.error(error);
		return Promise.reject();
	}
};

export const fetchFamilyId = async (userId: string) => {
	try {
		const userData = await apiCall.get(`/users/${userId}`);
		const resFamilyId: string = Object.keys(userData.data.families)[0];
		return resFamilyId;
	} catch (error) {
		return "There's been an error!";
	}
};

export const inviteUser = async (email: string, familyId: string) => {
	// may need to check if user has already been invited(?)
	try {
		const data = await apiCall.post(`/users/invited`, { email: email, familyId: familyId });
		return Promise.resolve({
			data
		});
	} catch (error) {
		return Promise.reject();
	}
};

export const fetchUserById = async (userId: string) => {
	try {
		const userData = await apiCall.get(`/users/${userId}`);
		return userData.data;
	} catch (error) {
		return "Error, can't find user";
	}
};

export const createInvitedUser = async (
	displayName: string,
	fullName: string,
	password: string,
	email: string,
	familyId: string,
	inviteId: string
) => {
	try {
		//create user directly in Firebase database
		const userCredential: UserCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);

		interface UpdatedUser {
			email: string;
			fullName: string;
			displayName: string;
			userId: string;
			familyId: string;
			inviteId: string;
		}

		const updatedUser: UpdatedUser = {
			email: email,
			fullName: fullName,
			displayName: displayName,
			userId: userCredential.user.uid,
			familyId: familyId,
			inviteId: inviteId
		};
		const createdUser = await apiCall.post(`/users/invites/${familyId}`, updatedUser);
		return createdUser.data;
	} catch (error) {
		console.error(error);
		return Promise.reject();
	}
};

export const addChapter = async (newChapter: {}, storyId: string) => {
	try {
		const updatedChapter = await apiCall.patch(`/stories/story/${storyId}`, newChapter);
		return updatedChapter.data;
	} catch (error) {
		console.error(error);
		return Promise.reject();
	}
};
