import express from 'express';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import 'zod-openapi/extend';
import { AuthController } from '../src/examples';
import { generateOpenAPIDocs } from '../src/generate-docs';

describe('', () => {
    const app = express();
    beforeAll(async () => {
        app.use(express.json());
        app.post('/login', AuthController.login);
        app.get('/user/:id', AuthController.user);
        await generateOpenAPIDocs(app, {});
    });

    it('should mount the /login route', async () => {
        const res = await request(app).post('/login');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ token: 'abc123' });
    });

    it('should mount the /user/{id} route', async () => {
        const res = await request(app).get('/user/random');
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
        expect(res.body.paths['/user/{id}']).toBeDefined();
    });

    it('should generate OpenAPI schema with parameters', async () => {
        const res = await request(app).get('/docs/openapi.json');
        expect(res.status).toBe(200);
        expect(res.body.paths['/user/{id}'].get.parameters?.[0]).toBeDefined();
    });
});
