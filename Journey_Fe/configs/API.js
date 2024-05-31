import axios from "axios";

export const endpoints = {
    journeys:'/journeys/',
    'journeys_detail': (JourneyId) => `/journeys/${JourneyId}`,
    addjourney:'/journeys/addjourney/',
    'comments': (JourneyId) => `/journey/${JourneyId}/comments/`,
    'add_comments': (JourneyId) => `/journey/${JourneyId}/comments/`,
    'join_detail': (JourneyId) => `/journey/${JourneyId}/join/`,
    'add_join': (JourneyId) => `/journey/${JourneyId}/join/`,
    'journey_by_user': (userId) => `/journeys/${userId}/journey_by_user/`,
    'login': '/o/token/',
    'current-user': '/users/current/',



}

export const authApi = (accessToken) => axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        "Authorization": `bearer ${accessToken}`
    }
})
export default axios.create({
    baseURL: "http://localhost:8000"
})