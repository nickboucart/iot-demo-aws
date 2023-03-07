import { Cognito, use } from "sst/constructs";
import { APIStack } from "./APIStack";

export function AuthStack({ stack, app }) {

	const auth = new Cognito(stack, "Auth",  {
		login: ['email'],
	});

	const {api} = use(APIStack);

	auth.attachPermissionsForAuthUsers(stack, [api]);

	stack.addOutputs({
		Region: app.region,
		UserPoolId: auth.userPoolId,
		IdentityPoolId: auth.cognitoIdentityPoolId,
		UserPoolClientId: auth.userPoolClientId,
	})

	return {
		auth,
	}


}