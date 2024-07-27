import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
    createDeleteOperation,
    createGetCollectionOperation,
    createGetOperation,
    createPostOperation,
    createPutOperation,
} from "../operations";
import { Resources } from "../types";
import { matchRoute } from "../utils/router";

const resources: Resources = {
    user: {
        operations: [
            createGetCollectionOperation({
                uriTemplate: "/users",
                security: ({ user }) => !!user,
            }),
            createGetOperation({
                uriTemplate: "/users/{id}",
                security: ({ object, user }) => object?.id === user.id,
            }),
            createPostOperation({
                uriTemplate: "/users",
                security: ({ user }) => !!user,
                inputValidation: z.object({
                    name: z.string(),
                    email: z.string().email(),
                    role: z.string().optional(),
                }),
            }),
            createPutOperation({
                uriTemplate: "/users/{id}",
                security: ({ object, user }) => object?.id === user.id,
                inputValidation: z.object({
                    name: z.string().optional(),
                    email: z.string().email().optional(),
                    role: z.string().optional(),
                }),
            }),
            createDeleteOperation({
                uriTemplate: "/users/{id}",
                security: ({ object, user }) => object?.id === user.id,
            }),
        ],
    },
};

describe("matchRoute", () => {
    it("should find the route for a valid URI template", () => {
        const route = matchRoute({
            path: "/api/users/123",
            resources,
            prefix: "/api",
        });
        expect(route?.operation.uriTemplate).toBe("/users/{id}");
    });

    it("should return undefined for an invalid URI template", () => {
        const route = matchRoute({
            path: "/api/posts/123",
            resources,
            prefix: "/api",
        });
        expect(route).toBeUndefined();
    });
});
