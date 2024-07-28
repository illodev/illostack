import { z } from "zod";

import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import {
    createDeleteOperation,
    createGetCollectionOperation,
    createGetOperation,
    createPostOperation,
    createPutOperation,
    createRouteHandler
} from "@illostack/api";

const handler = createRouteHandler(
    {
        prefix: "/api/v1",
        resources: {
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
                        inputValidation: z.object({
                            name: z.string(),
                            email: z.string().email()
                        })
                    }),
                    createPutOperation({
                        uriTemplate: "/users/{id}",
                        security: ({ object, user }) => object?.id === user.id,
                        inputValidation: z.object({
                            name: z.string().optional(),
                            email: z.string().email().optional()
                        })
                    }),
                    createDeleteOperation({
                        uriTemplate: "/users/{id}",
                        security: ({ object, user }) => object?.id === user.id
                    })
                ]
            },
            account: {}
        }
    },
    {
        providers: {
            database: db,
            auth: async () => {
                const session = await getServerAuthSession();

                return {
                    isAuthenticated: !!session,
                    user: session?.user
                };
            }
        }
    }
);

export {
    handler as DELETE,
    handler as GET,
    handler as PATCH,
    handler as POST,
    handler as PUT
};
