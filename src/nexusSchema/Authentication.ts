import {
  objectType, stringArg,
} from 'nexus'
import { AuthenticationController } from '../Authentication/AuthenticationController'
import { JWTController } from '../Authentication/JWTAuthenticationController'

export const AuthenticationMutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.nullable.field('registerUser', {
      type: AuthResponse,
      args: {
        given_name: stringArg(),
        family_name: stringArg(),
        email: stringArg(),
        username: stringArg(),
        password: stringArg(),
        inviteCode: stringArg()
      },
      resolve: async (_, { given_name, family_name, email, username, password, inviteCode }) => {
        try {
          const authController = new AuthenticationController({ given_name, family_name, email, username, password, inviteCode });
          const jwtController = new JWTController();
  
          const user = await authController.register();
          const authResponse = await jwtController.getAuthResponse(user);
  
          return authResponse;
        } catch (e) {
          console.error(e);
        }
      },
    })

    t.nullable.field('loginUser', {
      type: AuthResponse,
      args: {
        email: stringArg(),
        password: stringArg(),
      },
      resolve: async (_, { email, password }) => {
        const authController = new AuthenticationController({ email, password });
        const jwtController = new JWTController();

        const user = await authController.login();
        const authResponse = await jwtController.getAuthResponse(user);

        return authResponse;
      },
    })
  }
})

const AuthResponse = objectType({
  name: 'AuthResponse',
  definition(t) {
    t.nonNull.string('accessToken')
    t.nonNull.string('idToken')
    t.nonNull.string('refreshToken')
  }
})