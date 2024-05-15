import axios from "axios";

export const endpoints = {
    journeys:'/journeys/',
    'journeys_detail': (JourneyId) => `/journeys/${JourneyId}`,
    addjourney:'/journeys/addjourney/'
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