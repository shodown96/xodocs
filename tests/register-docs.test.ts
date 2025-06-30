import express from 'express';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import 'zod-openapi/extend';
import { generateOpenAPIDocs } from '../src/generate-docs';
import { AuthController, AuthResponse, UserParamsId } from '../src/examples';

describe('', () => {
    const app = express();
    beforeAll(async () => {
        app.use(express.json());
        app.post('/login', AuthController.login);
        app.get('/user', AuthController.user);
        await generateOpenAPIDocs(app, {
            schemas: {
                AuthResponse,
                UserParamsId,
            },
        });
    });

    it('should mount the /login route', async () => {
        const res = await request(app).post('/login');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ token: 'abc123' });
    });

    it('should mount the Swagger UI', async () => {
        const res = await request(app).get('/docs/');
        expect(res.status).toBe(200);
        expect(res.text).toContain('Swagger UI');
    });

    it('should generate OpenAPI schema with paths', async () => {
        const res = await request(app).get('/docs/openapi.json');
        expect(res.status).toBe(200);
        expect(res.body.paths['/login']).toBeDefined();
    });
});
