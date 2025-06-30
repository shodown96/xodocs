import { Project, SyntaxKind } from 'ts-morph';
import { pathToFileURL } from 'url';
import { z, ZodObject, ZodTypeAny } from 'zod';
import { RouteComment, SchemaEntry } from './types';

export function findAllControllerRoutes(): RouteComment[] {
    const project = new Project({
        tsConfigFilePath: 'tsconfig.json',
    });

    const results: RouteComment[] = [];

    for (const sourceFile of project.getSourceFiles()) {
        for (const cls of sourceFile.getClasses()) {
            const className = cls.getName() ?? 'AnonymousClass';

            for (const member of cls.getStaticMembers()) {
                if (!member.isKind(SyntaxKind.PropertyDeclaration)) continue;

                const prop = member.asKindOrThrow(
                    SyntaxKind.PropertyDeclaration,
                );
                const methodName = prop.getName();
                const initializer = prop.getInitializer();

                // We only want arrow functions
                if (
                    !initializer ||
                    initializer.getKind() !== SyntaxKind.ArrowFunction
                )
                    continue;

                const comments = prop
                    .getLeadingCommentRanges()
                    .map((c) => c.getText())
                    .join('\n');
                const lines = comments
                    .split('\n')
                    .map((l) => l.trim().replace(/^\/\//, '').trim());

                const routeComment: RouteComment = {
                    className,
                    methodName,
                    responses: {},
                };

                for (const line of lines) {
                    if (line.startsWith('@route')) {
                        const [, method, path] =
                            line.match(/@route\s+(\w+)\s+(.+)/) || [];
                        if (method && path) {
                            routeComment.method = method.toUpperCase();
                            routeComment.path = path;
                        }
                    } else if (line.startsWith('@summary')) {
                        routeComment.summary = line
                            .replace('@summary', '')
                            .trim();
                    } else if (line.startsWith('@response')) {
                        const [, code, desc] =
                            line.match(/@response\s+(\d+):\s*(.+)/) || [];
                        if (code && desc) routeComment.responses![code] = desc;
                    } else if (line.startsWith('@public')) {
                        routeComment.publicPath = true;
                    } else if (line.startsWith('@params')) {
                        routeComment.params = line
                            .replace('@params', '')
                            .trim();
                    } else if (line.startsWith('@tags')) {
                        const TAGS_REGEX = /@tags\s+(.+)/i;
                        const tagsMatch = line.match(TAGS_REGEX);
                        routeComment.tags = tagsMatch
                            ? tagsMatch[1].split(',').map((t) => t.trim())
                            : undefined;
                    }
                }

                results.push(routeComment);
            }
        }
    }
    return results;
}

export function buildOpenAPIPaths() {
    const routes = findAllControllerRoutes();
    const paths: Record<string, any> = {};

    for (const route of routes) {
        const {
            publicPath,
            path,
            method,
            params,
            tags,
            summary,
            responses = {},
        } = route;

        if (!path || !method) continue;

        if (!paths[path]) paths[path] = {};

        paths[path][method.toLowerCase()] = {
            publicPath: !!publicPath,
            summary,
            params,
            tags,
            responses: Object.entries(responses).reduce(
                (acc, [statusCode, description]) => {
                    acc[statusCode] = {
                        description,
                    };
                    return acc;
                },
                {} as Record<string, { description: string }>,
            ),
        };
    }
    return paths;
}

export async function getAllZodSchemas(): Promise<SchemaEntry[]> {
    const project = new Project({ tsConfigFilePath: 'tsconfig.json' });
    const schemas: SchemaEntry[] = [];

    const sourceFiles = project.getSourceFiles();

    for (const sourceFile of sourceFiles) {
        const filePath = sourceFile.getFilePath();
        const exportedVars = sourceFile
            .getVariableDeclarations()
            .filter((decl) => decl.isExported());

        if (!exportedVars.length) continue;

        let mod: Record<string, any>;
        try {
            const modulePath = pathToFileURL(filePath).href;
            mod = await import(modulePath);
        } catch (err) {
            console.warn(`Failed to import ${filePath}:`, err);
            continue;
        }

        for (const decl of exportedVars) {
            const name = decl.getName();
            const value = mod[name];

            if (value && value instanceof z.ZodType) {
                schemas.push({ name, schema: value });
            }
        }
    }
    return schemas;
}

export const createParameters = (zodObject: ZodObject<any>): any[] => {
    if (!zodObject) return [];
    return Object.entries(zodObject.shape).flatMap(([key, schema]: any) => {
        const isOptional = schema.isOptional?.() ?? false;
        const unwrapped = isOptional ? schema.unwrap() : schema;
        const openapi = (unwrapped as any)._def?.zodOpenApi.openapi.metadata;

        if (!openapi?.param) return [];

        const param = {
            name: openapi.param.name ?? key,
            in: openapi.param.in,
            required: openapi.param.in === 'path' ? true : !isOptional,
            description: openapi.description,
            example: openapi.example,
            schema: {
                type: inferType(unwrapped),
                format: inferFormat(unwrapped),
            },
        };

        return param;
    });
};

function inferType(schema: ZodTypeAny): string {
    switch (schema._def.typeName) {
        case 'ZodString':
            return 'string';
        case 'ZodNumber':
            return 'number';
        case 'ZodBoolean':
            return 'boolean';
        case 'ZodDate':
            return 'string';
        case 'ZodEnum':
            return 'string';
        default:
            return 'string';
    }
}

function inferFormat(schema: ZodTypeAny): string | undefined {
    const checks = schema._def.checks ?? [];
    for (const check of checks) {
        if (check.kind === 'uuid') return 'uuid';
        if (check.kind === 'email') return 'email';
        if (check.kind === 'url') return 'uri';
    }
    return undefined;
}
