import express from 'express';
import { graphqlHTTP } from 'express-graphql'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv';
import { schema } from './nexusSchema/schema'

import { getErrorCode } from './ErrorHandling/getErrorCode';
import prisma from './client';

import { authRouter } from './Routes/AuthenticationRoutes';
import { JWTController } from './Authentication/JWTController';
import { ErrorName } from './ErrorHandling/ErrorType';

dotenv.config();

const app = express();
app.disable('x-powered-by');

app.use('/auth', express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use('/auth', authRouter);

app.use(
  '/graphql',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  graphqlHTTP((req: any) => {
    try {
      const jwtController = new JWTController()
      const accessToken = req.signedCookies['accessToken'];

      const userId = jwtController.verifyAccessToken(accessToken)

      return {
        schema: schema,
        context: {
          prisma,
          userId
        },
        graphiql: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        customFormatErrorFn: (err: any) => {
          const error = getErrorCode(err.message)
          if (error === undefined) { return err; }
          return ({ message: error.message, errorCode: error.errorCode, statusCode: error.statusCode })
        }
      }
    } catch(e) {
      throw Error(ErrorName.UNAUTHENTICATED)
    }
  }),
)

app.get('/ping', (req, res) => {
  res.send("pong")
})

export { app };