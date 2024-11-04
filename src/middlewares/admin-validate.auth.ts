import { ADMIN_NO_PERMISSION } from "../constants/error-message";
import { HTTP_UNAUTHORIZED } from "../constants/http_status";

export default (req: any, res: any, next: any) => {
  if (
    req.user.role === "admin" &&
    req.user.email !== process.env.VALIDATE_ADMIN
  ) {
    return res.status(HTTP_UNAUTHORIZED).send(ADMIN_NO_PERMISSION);
  }
  return next();
};
