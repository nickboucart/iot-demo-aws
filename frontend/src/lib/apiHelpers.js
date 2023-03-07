import { API } from "aws-amplify";


export const getData = async (url = "", params = {}) => {
	const init = { queryStringParams: params };
	try {
		const response =  await API.get("app", url, init);
		return response.body;
	} catch (error) {
		console.log("something went wrong, api call failed");
		return { body: "something went wrong" };
		// @ts-ignore
	} finally {
		console.log('finally');
	}
}

export const postData = async (url = "", data = {}) => {
	const init = { body: data };
	try {
		const response =  await API.post("app", url, init);
		return response.body;
	} catch (error) {
		console.log("something went wrong, api call failed");
		return { body: "something went wrong" };
		// @ts-ignore
	} finally {
		console.log('finally');
	}
}