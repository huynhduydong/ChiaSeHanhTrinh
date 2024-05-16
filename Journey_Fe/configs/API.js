import axios from "axios";

export const endpoints = {
    journeys:'/journeys/',
    'journeys_detail': (JourneyId) => `/journeys/${JourneyId}`,
    addjourney:'/journeys/addjourney/',
    'comments': (JourneyId) => `/journeys/${JourneyId}/comments/`,
    'add_comments': (JourneyId) => `/journeys/${JourneyId}/comments/`,
    'join_detail': (JourneyId) => `/journeys/${JourneyId}/join/`,
    'add_join': (JourneyId) => `/journeys/${JourneyId}/join/`,


}

export const authAPI = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    console.log('Token: ', token);

    return axios.create({
        baseURL: "http://localhost:8000",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export default axios.create({
    baseURL: "http://localhost:8000"
})