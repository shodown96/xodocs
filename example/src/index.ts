import 'zod-openapi/extend';
import express from 'express';
import { generateOpenAPIDocs } from 'xodocs';
import { AuthController } from './controllers/auth.controller';
import { AuthResponse, UserParamsId } from './schemas/auth.schemas';

const app = express();

app.use(express.json());
app.post('/login', AuthController.login);

generateOpenAPIDocs(app, {
    info: {
        title: 'Xodocs Sample',
        description: 'Yayy',
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
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
