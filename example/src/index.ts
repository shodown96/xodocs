import express from 'express';
import { generateOpenAPIDocs } from 'xodocs';
import 'zod-openapi/extend';
import { AuthController } from './controllers/auth.controller';
import { AuthResponse, UserParamsId } from './schemas/auth.schemas';

const app = express();

app.use(express.json());
app.post('/login', AuthController.login);
app.get('/user/:id', AuthController.user);

generateOpenAPIDocs(app, {
    info: {
        title: 'Xodocs Sample',
        description: 'This is the official API of "Xodocs Sample"',
    },
    schemas: {
        AuthResponse,
        UserParamsId,
    },
    auth: {
        type: 'bearer',
        in: 'header',
        scheme: 'token',
    },
    baseURL: "http://localhost:3000",
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
