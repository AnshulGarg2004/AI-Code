import api  from "../utils/axios"

export const createPayment = async (plan) => {
    try {
        const { data } = await api.post('/api/payment/create', { plan });
        return data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Unable to create payment order";
        console.error("error in create payment feature:", message);
        throw new Error(message);
    }
}


export const verifyPayment = async({razorpay_order_id, razorpay_payment_id , razorpay_signature}) => {
    try {
         
        const { data } = await api.post('/api/payment/verify', { razorpay_order_id, razorpay_payment_id , razorpay_signature });
        return data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Unable to verify payment";
        console.error("error in verify payment feature:", message);
        throw new Error(message);
    }
}