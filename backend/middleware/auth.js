const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.header('Authorization'); // Get the entire Authorization header

    // Check if the Authorization header exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Access denied. No token provided or invalid format.');
    }

    // Extract the Bearer token correctly
    const bearerToken = authHeader.split(' ')[1].trim(); // Get the token after 'Bearer' and trim any whitespace

    console.log("Token:", bearerToken); // Log the token for debugging

    try {
        // Verify the token
        const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded user information to the request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Token verification error:", error.message); // Log the error for debugging
        res.status(400).send('Invalid token.');
    }
};

module.exports = auth;
