export const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
};
// This middleware checks if the user has admin privileges. If not, it sends a 403 Forbidden response. If the user is an admin, it calls the next middleware or route handler.