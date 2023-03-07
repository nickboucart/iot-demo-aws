import { StaticSite, use } from "sst/constructs";
import { APIStack } from "./APIStack";
import { AuthStack } from "./AuthStack";

export function WebAppStack({ stack, app } ){
	const {api} = use(APIStack);
  const {auth} = use(AuthStack);


  const site = new StaticSite(stack, "SvelteApp", {
    path: "frontend",
    buildOutput: "dist",
    buildCommand: "npm run build",
    environment: {
      // Pass in the API endpoint to our app
      VITE_APP_API_URL: api.url,
      VITE_APP_REGION: app.region,
      VITE_APP_USER_POOL_ID: auth.userPoolId,
      VITE_APP_APP_CLIENT_ID: auth.userPoolClientId,
      VITE_APP_IDENTITY_POOL_ID: auth.cognitoIdentityPoolId || ""
    },
  });

  stack.addOutputs({
    SiteUrl: site.url || 'undefined',
  });

	return {site, };


}