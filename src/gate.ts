import { authGate } from "./auth";
import { ErrorResponse } from "./response";
import { userGate } from "./user";

export const combinedGates = async (req, res, next) => {
	const authed = await authGate(req, res);
	const defaultErr = new ErrorResponse(res, 404, "User Not Found");

	if (!authed) {
		defaultErr.send()
		return
	}

	const isUser = await userGate(req, res);

	if (!isUser) {
		defaultErr.send();
		return;
	}
	next();
}
