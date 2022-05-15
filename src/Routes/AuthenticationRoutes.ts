import { Router } from "express";
import { AuthenticationController } from "../Authentication/AuthenticationController";
import { JWTController } from "../Authentication/JWTController";
import { DatabaseController } from "../Database/DatabaseController";
import { getErrorCode } from "../ErrorHandling/getErrorCode";

const authRouter: Router = Router()

authRouter.post('/signup', async (req, res) => {
  try {
    const { given_name, family_name, email, username, password, inviteCode } = req.body;
    const authController = new AuthenticationController({ given_name, family_name, email, username, password, inviteCode });
    const jwtController = new JWTController();
    const dbController = new DatabaseController();

    const user = await authController.register();
    const authResponse = await jwtController.getIdAuthResponse(user);

    await dbController.registerUser(user, authResponse);

    res.cookie('accessToken', authResponse.accessToken, { signed: true })
    res.cookie('idToken', authResponse.idToken, { signed: true })
    res.cookie('refreshToken', authResponse.refreshToken, { signed: true }).send();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const error = getErrorCode(err.message)
    if (error === undefined) { 
      console.error(err)
      res.sendStatus(500)  
    }
    res.status(error.statusCode).send({ message: error.message, errorCode: error.errorCode })
  }
})

authRouter.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body
    const authController = new AuthenticationController({ email, password });
    const jwtController = new JWTController();
    const dbController = new DatabaseController();

    const user = await authController.login();
    const authResponse = await jwtController.getIdAuthResponse(user);

    await dbController.loginUser(user.id, authResponse);

    res.cookie('accessToken', authResponse.accessToken, { signed: true })
    res.cookie('idToken', authResponse.idToken, { signed: true })
    res.cookie('refreshToken', authResponse.refreshToken, { signed: true }).send();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const error = getErrorCode(err.message)
    if (error === undefined) { 
      console.error(err)
      res.sendStatus(500)  
    }
    res.status(error.statusCode).send({ message: error.message, errorCode: error.errorCode })
  }
})

authRouter.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.signedCookies['refreshToken'];
    const jwtController = new JWTController();
    const authResponse = await jwtController.refresh(refreshToken);

    res.cookie('accessToken', authResponse.accessToken, { signed: true })
    res.cookie('refreshToken', authResponse.refreshToken, { signed: true }).send();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const error = getErrorCode(err.message)
    if (error === undefined) { 
      console.error(err)
      res.sendStatus(500)  
    }
    res.status(error.statusCode).send({ message: error.message, errorCode: error.errorCode })
  }
})

export { authRouter };