import proxy from "express-http-proxy";

export const proxyWithHeaders = (serviceUrl) => {
    return proxy(serviceUrl, {
        proxyReqOptDecorator: (proxyReqOpts, req) => {
            const userId = req.user?._id || req.user?.id || req.user?.userId;

            if (userId) {
                proxyReqOpts.headers = {
                    ...proxyReqOpts.headers,
                    "x-user-id": String(userId)
                };
            }

            return proxyReqOpts;
        }
    })
}
