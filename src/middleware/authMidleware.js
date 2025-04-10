import jwt from "jsonwebtoken";
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // Check if authHeader exists and starts with "Bearer "
    if (authHeader && authHeader.startsWith("Bearer ")) {
        // Extract the token from the header
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided!" });
        }
        try {
            // Verify the token using the secret from environment variables
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            console.log("The user is", req.user);
            // Proceed to next middleware/route handler
            next();
        } catch (error) {
            return res.status(400).json({ message: "Invalid token" });
        }
    } else {
        // If no auth header or it doesn't start with "Bearer "
        return res.status(401).json({ message: "Authentication header missing or malformed" });
    }
};
export default verifyToken;