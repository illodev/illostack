import bcrypt from "bcrypt";
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
                        security: ({ user }) => !!user,
                        onPreQuery: async ({ query, context }) => {
                            // Example of filtering by user role
                            // const user = context.security.user;
                            // if (!user || user.role !== "admin") {
                            //     query.where = {
                            //         ...query.where,
                            //         id: { equals: user.id }
                            //     };
                            // }
                        }
                    }),
                    createGetOperation({
                        uriTemplate: "/users/{id}",
                        security: ({ object, user }) => object?.id === user.id
                    }),
                    createPostOperation({
                        uriTemplate: "/users",
                        onPrePersist: async ({ data }) => {
                            data.password = await bcrypt.hash(
                                data.password,
                                10
                            );

                            return data;
                        },
                        onPostPersist: async ({ data }) => {
                            // Example of sending an email
                            // Send email
                            // await sendEmail({ to: data.email, subject: "Welcome" });

                            return data;
                        },
                        inputValidation: z.object({
                            name: z.string().optional(),
                            email: z.string().email(),
                            password: z.string()
                        })
                    }),
                    createPutOperation({
                        uriTemplate: "/users/{id}",
                        security: ({ object, user }) => object?.id === user.id,
                        onPrePersist: async ({ data }) => {
                            if (data.password) {
                                data.password = await bcrypt.hash(
                                    data.password,
                                    10
                                );
                            }

                            return data;
                        },
                        inputValidation: z.object({
                            name: z.string().optional(),
                            email: z.string().email().optional(),
                            password: z.string().optional()
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
