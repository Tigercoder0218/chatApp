const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const headerToken = req.get("Authorization");
    if (!headerToken) {
        return res.status(401).json({ error: "User Not Authorized by XRecon" });
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(headerToken, process.env.JWT_SECRET);
        if (decodedToken) {
            req.uid = decodedToken.uid;
        } else {
            throw new Error('Not Authorized');
        }
    } catch (err) {
        return res.status(401).json({ error: err });
    }
    next();
};