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
        
        next();
        
        
        
    } catch (error) {
        console.log("middleware error : ", error);
        
        return res.status(500).json({message:"Something went wrong"});
        
    }
} 