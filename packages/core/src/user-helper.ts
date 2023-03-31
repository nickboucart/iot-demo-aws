
// returns the userid from a cognito user pool user. This is a more intuitive id to use than the cognito identity id...
export function getUserId(event) {
  const authProvider = event.requestContext.authorizer.iam.cognitoIdentity.amr[2];
  // Cognito authentication provider looks like:
  // cognito-idp.us-east-1.amazonaws.com/us-east-1_xxxxxxxxx,cognito-idp.us-east-1.amazonaws.com/us-east-1_aaaaaaaaa:CognitoSignIn:qqqqqqqq-1111-2222-3333-rrrrrrrrrrrr
  // Where us-east-1_aaaaaaaaa is the User Pool id
  // And qqqqqqqq-1111-2222-3333-rrrrrrrrrrrr is the User Pool User Id
  const parts = authProvider.split(':');
  const userPoolIdParts = parts[parts.length - 3].split('/');

  const userPoolId = userPoolIdParts[userPoolIdParts.length - 1];
  return parts[parts.length - 1];
}


// returns the cognito identity id. A user might have multiple identities, if they would use multiple id providers...
export function getUserIdentityId(event) {
	return event.requestContext.authorizer.iam.cognitoIdentity.identityId;
}