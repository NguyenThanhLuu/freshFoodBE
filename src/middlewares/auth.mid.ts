import { verify } from "jsonwebtoken";
import { HTTP_UNAUTHORIZED } from "../constants/http_status";
import { ACCESS_TOKEN_EXPIRED, NO_TOKEN } from "../constants/error-message";

export default (req: any, res: any, next: any) => {
  const accessToken = req.headers.access_token as string;
  if (!accessToken) {
    return res.status(HTTP_UNAUTHORIZED).send(NO_TOKEN);
  }
  try {
    const decodedUser = verify(
      accessToken,
      process.env.ACCESS_SECRET_KEY as string
    );
    req.user = decodedUser;
    return next();
  } catch (error) {
    res.status(HTTP_UNAUTHORIZED).send(ACCESS_TOKEN_EXPIRED);
  }
};
