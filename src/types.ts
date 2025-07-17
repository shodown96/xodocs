import { IRoute } from 'express';
import { ZodType } from 'zod';
import { InfoObject } from 'zod-openapi/dist/openapi3-ts/dist/oas30';

export interface CustomRoute extends IRoute {
    methods: Record<string, true>;
}

export type RouteComment = {
    className: string;
    methodName: string;
    method?: string;
    path?: string;
    summary?: string;
    params?: string;
    tags?: string[];
    publicPath?: boolean;
    responses?: Record<string, string>;
};

export type SchemaEntry = {
    name: string;
    schema: ZodType;
};

export type GenerateConfig = {
    info?: Partial<InfoObject>;
    docsPath?: Partial<DocsPath>;
    auth?: AuthConfig;
    schemas: Record<string, ZodType>
    baseURL?: string
};

type DocsPath = {
    ui: string;
    json: string;
};

type AuthConfig = {
    type: 'bearer' | 'apiKey';
    name?: string; // for apiKey
    in?: 'header' | 'query'; // for apiKey
    scheme?: string; // for bearer, defaults to 'bearer'
    description?: string;
};

export type PathMethodObject = {
    params?: string;
    tags?: string[];
    summary?: string;
    publicPath?: boolean;
    responses: Record<string, string>[];
};
