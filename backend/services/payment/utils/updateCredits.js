import axios from "axios"

export const addCredits = async({userId, credits}) => {
     try {
        const {data} = await axios.post(`${process.env.AUTH_SERVICE_URL}/user/add-credits`, {
            userId,
            amount: credits
        });

        return data;
     } catch (error) {
        console.log("error in update credits payment: ", error.response?.data || error.message);
        throw new Error("Unable to add purchased credits");
     }
}