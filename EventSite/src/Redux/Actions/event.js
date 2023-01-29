import { GET_EVENTS, GET_MY_EVENTS } from "../Type"

export const getEvents = () => {
	return {
		type: GET_EVENTS,
		data: {}
	}
}

export const getMyEvents = () => {
	return {
		type: GET_MY_EVENTS,
		data: {}
	}
}
