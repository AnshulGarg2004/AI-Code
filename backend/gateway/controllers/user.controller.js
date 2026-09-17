export const getCurrentUser = async (req , res) => {
    try {
        return res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in get curr user contoller: ", error);
        
        return res.status(500).json({message:"Get current user error"});
    }
}