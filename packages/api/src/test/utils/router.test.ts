import { describe, expect, it } from "vitest";
import { z } from "zod";

import { PrismaClient } from "@prisma/client";
import {
    createDeleteOperation,
    createGetCollectionOperation,
    createGetOperation,
    createPostOperation,
    createPutOperation
} from "../../operations";
import { Config, Operation, Resources } from "../../types";
import {
    buildUriVariables,
    getPathFromRequest,
    matchRoute
} from "../../utils/router";

const config: Config = {
    providers: {
        database: new PrismaClient()
    }
};

const resources: Resources = {
    user: {
        operations: [
            createGetCollectionOperation({
                uriTemplate: "/users",
                security: ({ user }) => !!user
            }),
            createGetOperation({
                uriTemplate: "/users/{id}",
                security: ({ object, user }) => object?.id === user.id
            }),
            createPostOperation({
                uriTemplate: "/users",
                security: ({ user }) => !!user,
                inputValidation: z.object({
                    name: z.string(),
                    email: z.string().email(),
                    role: z.string().optional()
                })
            }),
            createPutOperation({
                uriTemplate: "/users/{id}",
                security: ({ object, user }) => object?.id === user.id,
                inputValidation: z.object({
                    name: z.string().optional(),
                    email: z.string().email().optional(),
                    role: z.string().optional()
                })
            }),
            createDeleteOperation({
                uriTemplate: "/users/{id}",
                security: ({ object, user }) => object?.id === user.id
            })
        ]
    }
};

describe("matchRoute", () => {
    it("should find the route for a valid URI template", () => {
        const route = matchRoute({
            path: "/api/users/123",
            resources,
            prefix: "/api"
        });
        expect(route?.operation.uriTemplate).toBe("/users/{id}");
    });

    it("should return undefined for an invalid URI template", () => {
        const route = matchRoute({
            path: "/api/posts/123",
            resources,
            prefix: "/api"
        });
        expect(route).toBeUndefined();
    });
});

describe("buildUriVariables", () => {
    it("should return an empty object when the template has no variables", () => {
        const path = "/api/users";
        const operation: Operation<"user"> = {
            operation: "getCollection",
            uriTemplate: "/users"
        };
        const prefix = "/api";

        const uriVariables = buildUriVariables({
            path,
            operation,
            prefix,
            model: "user",
            config
        });

        expect(uriVariables).toEqual({});
    });

    it("should extract variables from the path when the template has variables", () => {
        const path = "/api/users/123";
        const operation: Operation<"user"> = {
            operation: "get",
            uriTemplate: "/users/{id}"
        };
        const prefix = "/api";

        const uriVariables = buildUriVariables({
            path,
            operation,
            prefix,
            model: "user",
            config
        });

        expect(uriVariables).toEqual({ id: "123" });
    });

    it("should error when a uriVariable not in model", () => {
        const path = "/api/users/123";
        const operation: Operation<"user"> = {
            operation: "get",
            uriTemplate: "/users/{userId}"
        };
        const prefix = "/api";

        expect(() =>
            buildUriVariables({
                path,
                operation,
                prefix,
                model: "user",
                config
            })
        ).toThrowError();
    });

    it("should handle a prefix with a trailing slash", () => {
        const path = "/api/users/123";
        const operation: Operation<"user"> = {
            operation: "get",
            uriTemplate: "/users/{id}"
        };
        const prefix = "/api/";

        const uriVariables = buildUriVariables({
            path,
            operation,
            prefix,
            model: "user",
            config
        });

        expect(uriVariables).toEqual({ id: "123" });
    });
});

describe("getPathFromRequest", () => {
    it("should return the pathname from the request URL", () => {
        const request = new Request("https://example.com/api/users/123", {
            method: "GET"
        });
        const path = getPathFromRequest(request);
        expect(path).toBe("/api/users/123");
    });

    it("should handle URLs without a pathname", () => {
        const request = new Request("https://example.com", {
            method: "GET"
        });
        const path = getPathFromRequest(request);
        expect(path).toBe("/");
    });

    it("should handle URLs with query parameters", () => {
        const request = new Request(
            "https://example.com/api/users/123?sort=desc",
            {
                method: "GET"
            }
        );
        const path = getPathFromRequest(request);
        expect(path).toBe("/api/users/123");
    });
});
