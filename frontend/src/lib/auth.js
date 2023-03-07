import { writable } from "svelte/store";
import { Auth } from "aws-amplify";

let _user = localStorage.getItem('amplifyUser');

export const user = writable(_user ? JSON.parse(_user) : null);
user.subscribe((value) => {
	if (value) localStorage.setItem('amplifyUser', JSON.stringify(value));
	else localStorage.removeItem('amplifyUser');
});
export async function logout() {
	await Auth.signOut();
	user.set(null);
}
export async function login(email, password) {
	const loggedInUser = await Auth.signIn(email, password)
	user.set(loggedInUser);
}