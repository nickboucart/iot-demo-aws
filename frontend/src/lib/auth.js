import { writable } from "svelte/store";
import { Auth } from "aws-amplify";

async function getCurrentUser() {
	let user = null;
	try {
		user = await Auth.currentAuthenticatedUser();
		console.log(user);
	} catch (error) {
		console.log('no current user')
	}
	return user;
}


export const user = writable(await getCurrentUser()	);

// user.subscribe((value) => {
// 	if (value) localStorage.setItem('amplifyUser', JSON.stringify(value));
// 	else localStorage.removeItem('amplifyUser');
// });

export async function logout() {
	await Auth.signOut();
	user.set(null);
}

export async function login(email, password) {
	const loggedInUser = await Auth.signIn(email, password)
	// localStorage.setItem('amplifyUser', JSON.stringify(loggedInUser));
	user.set(loggedInUser);
}