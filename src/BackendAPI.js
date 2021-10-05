///import Axios from "axios";
import { BACKEND_API_URL_MHK_QA2, BACKEND_API_URL_MHK_SECURITYLOAD, BACKEND_API_URL_MHK_STAGE2 } from "./utils/AppConstants";

// export const API_INSTANCE = Axios.create({
// 	baseURL: BACKEND_API_URL_MHK_QA2,
// 	method: "POST",
// 	headers: {
// 		'Content-Type': 'application/json',
// 		'OAuth': 'jSzcOZo9rry6DOpLGS0TEzrTQswNVWku',
// 		'AppID': 'zNiphaJww8e4qYEwJ96gVK5HTAAbAXdj'
// 	}
// 	//timeout: 20000,
// })

export const API_MHK_COGNITO_LOGIN = "api/CoreUser/MHKCognitoLogin";
export const API_MHK_COGNITO_LOGIN_PAYLOAD = {UserName: 'admin', Password: 'adminMHK'};

export const API_MHK_COGNITO_LOGOUT = "api/CoreUser/MHKCognitoLogout";