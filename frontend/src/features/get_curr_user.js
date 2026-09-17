import api from "../utils/axios"

export const getCurrUser = async () => {
    try {
        const {data} = await api.get('/api/get-current-user');
        return data;
    } catch (error) {
        console.log("error in fetch get curr user: ", error);
        return null;
        
    }
}