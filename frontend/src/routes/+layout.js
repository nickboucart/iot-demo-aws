import { Amplify, } from "aws-amplify";

Amplify.configure({
	Auth: {
		mandatorySignIn: true,
		region: import.meta.env.VITE_APP_REGION,
		userPoolId: import.meta.env.VITE_APP_USER_POOL_ID,
    identityPoolId: import.meta.env.VITE_APP_IDENTITY_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_APP_APP_CLIENT_ID, 
	},
	API: {
		endpoints: [
			{
				name: 'app',
				endpoint: import.meta.env.VITE_APP_API_URL,
				region: import.meta.env.VITE_APP_REGION
			}
		]
	}
})


export const ssr = false;
