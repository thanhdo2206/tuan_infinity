import axios from 'axios';
import jwtDecode from 'jwt-decode';
import * as storage from '../utils/storage';

const authTokens = storage.getValueStorage('auth');

const axiosInstance = axios.create({
	baseURL: `${process.env.REACT_APP_BASE_URL_API}`,
	headers: {
		token: `babers ${authTokens?.accessToken}`,
	},
});

axiosInstance.interceptors.request.use(async req => {
	const authTokens = storage.getValueStorage('auth');
	const accessToken = authTokens.accessToken
	// console.log('accessToken before', accessToken)
	if (accessToken) {
		// console.log('accessToken', accessToken)
		const decodedToken = jwtDecode(accessToken);
		// console.log('decoded', decodedToken.exp*1000 < new Date().getTime())
		if (decodedToken.exp * 1000 < new Date().getTime()) {
			const respone = await axios.post(
				`${process.env.REACT_APP_BASE_URL_API}auth/refresh`,
				{
					refreshToken: authTokens?.refreshToken,
				}
			);
			// console.log('axios', respone.data);
			storage.storeValueStorage('auth', respone.data);
			req.headers.token = `babers ${respone.data.accessToken}`;
			return req
		}
	}
	req.headers.token = `babers ${authTokens.accessToken}`;
	return req;
});
export default axiosInstance;
