import { type Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { createSchema } from 'zod-openapi';
import { GenerateConfig, PathMethodObject } from './types';
import { buildOpenAPIPaths, createParameters, getAllZodSchemas } from './utils';

export async function generateOpenAPIDocs(
    app: Express,
    config?: GenerateConfig,
) {
    const {
        auth,
        baseURL,
        info = {
            title: "API Docs",
            version: "1.0.0"
        },
        docsPath = {
            ui: "/docs",
            json: "/docs/openapi.json",
        } } = config || {};

    const paths = buildOpenAPIPaths();
    const schemas = await getAllZodSchemas()
    // const transformed = Object.fromEntries(
    //     Object.entries(schemas).map(([key, schema]) => [
    //         key,
    //         createSchema(schema).schema,
    //     ]),
    // );

    // Build OpenAPI paths
    const resolvedPaths: any = {};

    for (const [path, methods] of Object.entries(paths)) {
        resolvedPaths[path] = {};

        for (const [method, rawOperation] of Object.entries(methods)) {
            const operation = rawOperation as PathMethodObject;
            const { summary, params, publicPath, tags, responses } = operation;

            const resolvedResponses: Record<string, any> = {};

            for (const [statusCode, resDef] of Object.entries(responses)) {
                const schemaName = resDef.description;
                const schema = schemas.find(v => v.name === schemaName)?.schema

                resolvedResponses[statusCode] = {
                    description: `${schemaName} response`,
                    content: {
                        'application/json': {
                            schema: schema ? createSchema(schema).schema : null,
                        },
                    },
                };
            }
            const paramSchema = schemas.find(v => v.name === params)?.schema
            resolvedPaths[path]![method] = {
                summary,
                tags,
                parameters: params
                    ? createParameters(paramSchema as any)
                    : undefined,
                security: publicPath ? [] : undefined,
                responses: resolvedResponses,
            };
        }
    }

    const openapi = {
        openapi: '3.0.0',
        info,
        paths: resolvedPaths,
        security: {},
        components: {
            securitySchemes: {
                BearerAuth: {},
                ApiKeyAuth: {},
            },
        },
    };
    // 🔐 Inject auth configuration
    if (auth) {
        switch (auth.type) {
            case 'bearer':
                openapi.components.securitySchemes!['BearerAuth'] = {
                    type: 'http',
                    scheme: auth.scheme ?? 'bearer',
                    description: auth.description,
                };
                break;
            case 'apiKey':
                openapi.components.securitySchemes!['ApiKeyAuth'] = {
                    type: 'apiKey',
                    in: auth.in ?? 'header',
                    name: auth.name ?? 'Authorization',
                    description: auth.description,
                };
                break;
        }
    }

    const jsonPath = String(docsPath.json)
    const uiPath = String(docsPath.ui);
    app.get(jsonPath, (_req, res): any => res.json(openapi));
    app.use(uiPath, swaggerUi.serve, swaggerUi.setup(openapi));
    console.log(`[xodocs]: Serving Swagger UI docs at ${(baseURL || "") + uiPath}`);
    console.log(`[xodocs]: Serving Swagger JSON at ${(baseURL || "") + jsonPath}`);
    return openapi;
}
