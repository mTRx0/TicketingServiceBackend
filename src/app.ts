import express from 'express';
import { graphqlHTTP } from 'express-graphql'
import { schema } from './nexusSchema/schema'
import { context } from './context'

import  { ErrorName, ErrorType } from './ErrorHandling/ErrorType'

const app = express();
app.disable('x-powered-by');

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    context: context,
    graphiql: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    customFormatErrorFn: (err: any) => {
      const error = getErrorCode(err.message)
      return ({ message: error.message, errorCode: error.errorCode, statusCode: error.statusCode })
    }
  }),
)

const getErrorCode = (errorName: ErrorName) => {
  return ErrorType[errorName];
}

app.get('/ping', (req, res) => {
  res.send("pong")
})

export { app };