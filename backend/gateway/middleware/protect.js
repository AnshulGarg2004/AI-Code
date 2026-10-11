import redis from "../../shared/redis/redis.js";

export const protect = async (req, res, next) => {
    try {
        const sessionId = req.cookies?.session;
        if(!sessionId) {
            return res.status(404).json({message : "User unauthorised"});
        }
        
        
        
        const sessionData = await redis.get(`sessionId-${sessionId}`);
        
        if(!sessionData) {
            return res.status(404).json({message : "Session not found"});
            
        }
        
        const parsedRes = JSON.parse(sessionData);

        req.user = parsedRes;
        const userId = parsedRes?._id || parsedRes?.id || parsedRes?.userId;

        if (!userId) {
            return res.status(401).json({message : "Session user id missing"});
        }

        req.headers["x-user-id"] = String(userId);

        next();
        
        
        
    } catch (error) {
        console.log("middleware error : ", error);
        
        return res.status(500).json({message:"Something went wrong"});
        
    }
} 