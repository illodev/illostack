import { describe, expect, it } from "vitest";
import { z } from "zod";

import {
    createDeleteOperation,
    createGetCollectionOperation,
    createGetOperation,
    createPostOperation,
    createPutOperation
} from "../../operations";
import { Operation, Resources } from "../../types";
import {
    buildUriVariables,
    getPathFromRequest,
    matchRoute
} from "../../utils/router";

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

        const uriVariables = buildUriVariables({ path, operation, prefix });

        expect(uriVariables).toEqual({});
    });

    it("should extract variables from the path when the template has variables", () => {
        const path = "/api/users/123";
        const operation: Operation<"user"> = {
            operation: "get",
            uriTemplate: "/users/{id}"
        };
        const prefix = "/api";

        const uriVariables = buildUriVariables({ path, operation, prefix });

        expect(uriVariables).toEqual({ id: "123" });
    });

    it("should handle multiple variables in the template", () => {
        const path = "/api/users/123/posts/456";
        const operation: Operation<"user"> = {
            operation: "get",
            uriTemplate: "/users/{userId}/posts/{postId}"
        };
        const prefix = "/api";

        const uriVariables = buildUriVariables({ path, operation, prefix });

        expect(uriVariables).toEqual({ userId: "123", postId: "456" });
    });
});
describe("getPathFromRequest", () => {
    it("should return the pathname from the request URL", () => {
        const request = new Request("https://example.com/api/users/123", {
            method: "GET"
        });
        const path = getPathFromRequest({ request });
        expect(path).toBe("/api/users/123");
    });

    it("should handle URLs without a pathname", () => {
        const request = new Request("https://example.com", {
            method: "GET"
        });
        const path = getPathFromRequest({ request });
        expect(path).toBe("/");
    });

    it("should handle URLs with query parameters", () => {
        const request = new Request(
            "https://example.com/api/users/123?sort=desc",
            {
                method: "GET"
            }
        );
        const path = getPathFromRequest({ request });
        expect(path).toBe("/api/users/123");
    });
});
