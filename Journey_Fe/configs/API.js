import axios from "axios";

export const endpoints = {
    journeys:'/journeys/',
    'journeys_detail': (JourneyId) => `/journeys/${JourneyId}/`,
    add_journey:'/add_journey/',
    'add_place_visit':(JourneyId)=>`/add_journey/${JourneyId}/add_place_visit/`,
    'comments': (JourneyId) => `/journey/${JourneyId}/comments/`,
    'add_comments': (JourneyId) => `/journey/${JourneyId}/comments/`,
    'join_detail': (JourneyId) => `/journey/${JourneyId}/join/`,
    'image_journey': (JourneyId) => `/journey/${JourneyId}/image/`,
    'image_journey_detail': (imageJourneyId) => `/image_journey/${imageJourneyId}/`,
    'comments_image_journey': (imageJourneyId) => `/image_journey/${imageJourneyId}/comment/`,

    chats: '/chat/',
    'add_join': (JourneyId) => `/journey/${JourneyId}/join/`,
    'complete': (JourneyId) => `/journey/${JourneyId}/complete/`,
    'close_comments': (JourneyId) => `/journey/${JourneyId}/close_comments/`,
    'messages': (chatId) => `/messages/${chatId}/`,

    'place_visits': (JourneyId) => `/journeys/${JourneyId}/place_visits/`,

    journey_by_user : `/journeys/journey_by_user/`,
    joined_journeys : `/journeys/joined_journeys/`,

    'login': '/user/login/',
    'register': '/register',
    'reports': '/reports/',
    'current_user_profile': '/user/current_user_profile/',
    'tags': '/tags/',
    'search': '/journeys/search/',
    'search_user':'/user/search_users/',
    'rating': '/rating/',

    'current-user': '/user/current-user/',
    'profile_user':(userId)=>`/user/${userId}/profile_user/`,
}

export const authApi = (accessToken) => axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        "Authorization": `bearer ${accessToken}`
    }
})
export default axios.create({
    baseURL: "http://localhost:8000",
    headers: {
      'content-type': 'application/json',
    },
    
})