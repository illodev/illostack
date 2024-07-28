# Illostack API

> [!IMPORTANT] > **This project is currently in development and not yet stable.**

This utility provides a streamlined approach to creating APIs in Next.js using Prisma as the ORM and Zod for validation. It enables the creation of secure, validated, and type-safe API endpoints with minimal boilerplate code.

## Table of Contents

-   [Introduction](#introduction)
-   [Installation](#installation)
-   [Usage](#usage)
-   [Types](#types)
    -   [PrismaModelName](#prismamodelname)
    -   [ModelFields](#modelfields)
    -   [ModelResult](#modelresult)
    -   [Operation](#operation)
-   [Operations](#operations)
    -   [PostOperation](#postoperation)
    -   [GetOperation](#getoperation)
    -   [GetCollectionOperation](#getcollectionoperation)
    -   [PutOperation](#putoperation)
    -   [PatchOperation](#patchoperation)
    -   [DeleteOperation](#deleteoperation)
-   [Configuration](#configuration)
-   [Example](#example)

## Introduction

This utility allows you to quickly define API routes in a Next.js application using Prisma for database operations and Zod for validation. It abstracts common operations and security checks, allowing you to focus on defining the logic specific to your application.

## Installation

First, ensure you have the required dependencies installed:

```bash
npm install @prisma/client zod
```

## Usage

### Defining Types

The utility includes several TypeScript types to facilitate type-safe API development.

#### `PrismaModelName`

Represents the name of a Prisma model.

```typescript
export type PrismaModelName = Prisma.TypeMap["meta"]["modelProps"];
```

#### `ModelFields`

Represents the fields of a Prisma model used for create and update operations.

```typescript
export type ModelFields<TModel extends PrismaModelName> =
    | keyof PrismaModel<TModel>["operations"]["create"]["args"]["data"]
    | keyof PrismaModel<TModel>["operations"]["update"]["args"]["data"];
```

#### `ModelResult`

Represents the result of a findUnique operation on a Prisma model.

```typescript
export type ModelResult<TModel extends PrismaModelName> =
    PrismaModel<TModel>["operations"]["findUnique"]["result"];
```

#### `Operation`

Represents a generic operation (CRUD) for a Prisma model.

```typescript
export type Operation<TModel extends PrismaModelName> =
    | PostOperation<TModel>
    | GetOperation<TModel>
    | GetCollectionOperation<TModel>
    | PutOperation<TModel>
    | PatchOperation<TModel>
    | DeleteOperation<TModel>;
```

## Operations

### PostOperation

Defines a POST operation.

```typescript
export type PostOperation<TModel extends PrismaModelName> =
    BaseOperation<TModel> &
        MutationOperation<TModel> & {
            operation: MutationOperations["post"];
        };
```

### GetOperation

Defines a GET operation.

```typescript
export type GetOperation<TModel extends PrismaModelName> =
    BaseOperation<TModel> &
        QueryOperation<TModel> & {
            operation: QueryOperations["get"];
            orderBy?: ModelOrderBy<TModel>;
            where?: ModelWhere<TModel>;
            select?: ModelSelect<TModel>;
            distinct?: ModelDistinct<TModel>;
        };
```

### GetCollectionOperation

Defines a GET collection operation.

```typescript
export type GetCollectionOperation<TModel extends PrismaModelName> =
    BaseOperation<TModel> &
        QueryOperation<TModel> & {
            operation: QueryOperations["getCollection"];
            orderBy?: ModelOrderBy<TModel>;
            where?: ModelWhere<TModel>;
            select?: ModelSelect<TModel>;
            distinct?: ModelDistinct<TModel>;
        };
```

### PutOperation

Defines a PUT operation.

```typescript
export type PutOperation<TModel extends PrismaModelName> =
    BaseOperation<TModel> &
        MutationOperation<TModel> & {
            operation: MutationOperations["put"];
            select?: ModelSelect<TModel>;
            where?: ModelWhere<TModel>;
        };
```

### PatchOperation

Defines a PATCH operation.

```typescript
export type PatchOperation<TModel extends PrismaModelName> =
    BaseOperation<TModel> &
        MutationOperation<TModel> & {
            operation: MutationOperations["patch"];
            select?: ModelSelect<TModel>;
            where?: ModelWhere<TModel>;
        };
```

### DeleteOperation

Defines a DELETE operation.

```typescript
export type DeleteOperation<TModel extends PrismaModelName> =
    BaseOperation<TModel> &
        MutationOperation<TModel> & {
            operation: MutationOperations["delete"];
            select?: ModelSelect<TModel>;
            where?: ModelWhere<TModel>;
        };
```

## Configuration

Define the schema and the configuration for your API routes.

```typescript
export type Schema = {
    prefix?: string;
    resources?: Resources;
};

export type AuthProvider = (req: Request) => Promise<{
    isAuthenticated: boolean;
    user?: User;
}>;

export type Config = {
    providers: {
        database: PrismaClient;
        auth: AuthProvider;
    };
};
```

## Example

Below is an example of how to set up API routes using the utility.

```typescript
import { z } from "zod";
import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import {
    createDeleteOperation,
    createGetCollectionOperation,
    createGetOperation,
    createPostOperation,
    createPutOperation,
    createRouteHandler,
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
                    }),
                    createGetOperation({
                        uriTemplate: "/users/{id}",
                        security: ({ object, user }) => object?.id === user.id,
                    }),
                    createPostOperation({
                        uriTemplate: "/users",
                        inputValidation: z.object({
                            name: z.string(),
                            email: z.string().email(),
                        }),
                    }),
                    createPutOperation({
                        uriTemplate: "/users/{id}",
                        security: ({ object, user }) => object?.id === user.id,
                        inputValidation: z.object({
                            name: z.string().optional(),
                            email: z.string().email().optional(),
                        }),
                    }),
                    createDeleteOperation({
                        uriTemplate: "/users/{id}",
                        security: ({ object, user }) => object?.id === user.id,
                    }),
                ],
            },
        },
    },
    {
        providers: {
            database: db,
            auth: async () => {
                const session = await getServerAuthSession();

                return {
                    isAuthenticated: !!session,
                    user: session?.user,
                };
            },
        },
    }
);

export {
    handler as DELETE,
    handler as GET,
    handler as PATCH,
    handler as POST,
    handler as PUT,
};
```

This configuration sets up a collection of user-related API endpoints with security and validation in place. The routes are prefixed with `/api/v1` and include operations for fetching, creating, updating, and deleting users.

## Conclusion

This utility provides a structured and efficient way to build APIs in Next.js using Prisma and Zod. By leveraging TypeScript types and Zod schemas, it ensures type safety and validation, reducing the likelihood of runtime errors and improving code maintainability.
Future Features
Automatic Swagger Generation

## Future Features

### Automatic Swagger Generation

Implement automatic Swagger documentation generation to provide API documentation and testing interfaces.

### Pre-processors (Pre Persist)

Add pre-processors that run before persistence to handle data transformations or validations.

### Model-level Configuration

Allow configuration at the model level for more granular control over individual models' behaviors and validations.

### Subresources

Support subresource routing and operations to handle nested resources efficiently.

### Events (onPrePersist, onPostPersist, etc.)

Introduce event hooks such as `onPrePersist` and `onPostPersist` to enable custom logic execution at different points in the data lifecycle.

### WebSocket or Mercure Integration

Integrate WebSocket or Mercure to support real-time data updates and notifications in your API.
