import axios from "axios";

export const endpoints = {
    journeys:'/journeys/'
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