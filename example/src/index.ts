import express from 'express';
import { generateOpenAPIDocs } from 'xodocs';
import 'zod-openapi/extend';
import { AuthController } from './controllers/auth.controller';

const app = express();

app.use(express.json());
app.post('/login', AuthController.login);
app.get('/user/:id', AuthController.user);

generateOpenAPIDocs(app, {
    info: {
        title: 'Xodocs Sample',
        description: 'This is the official API of "Xodocs Sample"',
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
