import axios from 'axios';

const api = axios.create({
     baseURL:'http://localhost:8000/'
})

// authentication
export const login = async(userData)=>{
     return api.post('login/',userData)
}

export const register = async(userData)=>{
     return api.post('register/',userData)
}

export const getActivities = async(token)=>{
     return api.get('activities/',{
          headers:{Authorization:`Bearer ${token}`}
     })
}
export default api

