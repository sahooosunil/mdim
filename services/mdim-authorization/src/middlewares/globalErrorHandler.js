import  RoleNotFoundError  from "../errors/RoleNotFoundError.js";
import UserNotFoundError from "../errors/UserNotFoundError.js";

export default (err, req, res, next) => {
  console.error("🔥 Global Error:", err);

  if (err instanceof UserNotFoundError) {
    return res.status(404).json({ message: err.message || "User not found" });
  }

  if (err instanceof RoleNotFoundError) {
    return res.status(404).json({ message: err.message || "Role not found" });
  }

  // default fallback
  return res.status(500).json({
    message: err.message || "Internal Server Error",
  });
};
