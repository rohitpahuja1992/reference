import { FETCH_CLIENT_MODULE_COMPLETE, FETCH_STATE_COMPLETE,FETCH_VERSION_COMPLETE} from "../utils/AppConstants";

export const fetchModules = () => {
	return {
		type: FETCH_CLIENT_MODULE_COMPLETE,
    }
}

export const fetchStatecity = () => {
	return {
		type: FETCH_STATE_COMPLETE,
    }
}

export const fetchVersion = () => {
	return {
		type: FETCH_VERSION_COMPLETE,
    }
}