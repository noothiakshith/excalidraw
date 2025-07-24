import jwt from 'jsonwebtoken';

export default function verifyToken(req, res, next) {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(400).json({ message: 'Invalid token.' });
    }
}
