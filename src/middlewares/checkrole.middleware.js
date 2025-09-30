import { ApiError } from "../utils/ApiError.js";

const checkRole = (role) => {
  return (req, res, next) => {
    if (req.role !== role) {
    throw new ApiError(403, "Forbidden: Access denied")
    }
    next();
  };
};

export { checkRole };
