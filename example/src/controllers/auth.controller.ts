import { RequestHandler } from 'express';

export class AuthController {
    // @public
    // @route POST /login
    // @summary Login a user
    // @response 200: AuthResponse
    // @tags Auth
    static login: RequestHandler = (_, res) => {
        res.json({ token: 'abc123' });
    };

    // @route POST /user/{id}
    // @summary Get user details
    // @response 200: AuthResponse
    // @params UserParamsId
    // @tags Auth
    static user: RequestHandler = (_, res) => {
        res.json({ token: 'abc123' });
    };
}

// i want t add queries like @query AuthQuery
