import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

export type PrismaModelName = Prisma.TypeMap["meta"]["modelProps"];
export type PrismaModelCapitalized<TModel extends PrismaModelName> =
    Capitalize<TModel>;
export type PrismaModel<TModel extends PrismaModelName> =
    Prisma.TypeMap["model"][PrismaModelCapitalized<TModel>];

export type ModelFields<TModel extends PrismaModelName> =
    | keyof PrismaModel<TModel>["operations"]["create"]["args"]["data"]
    | keyof PrismaModel<TModel>["operations"]["update"]["args"]["data"];

export type ModelResult<TModel extends PrismaModelName> =
    PrismaModel<TModel>["operations"]["findUnique"]["result"];

export type ModelOrderBy<TModel extends PrismaModelName> =
    PrismaModel<TModel>["operations"]["findMany"]["args"]["orderBy"];

export type ModelWhere<TModel extends PrismaModelName> =
    PrismaModel<TModel>["operations"]["findMany"]["args"]["where"];

export type ModelSelect<TModel extends PrismaModelName> =
    PrismaModel<TModel>["operations"]["findMany"]["args"]["select"];

export type ModelInclude<TModel extends PrismaModelName> =
    PrismaModel<TModel>["operations"]["findMany"]["args"]["select"];

export type ModelDistinct<TModel extends PrismaModelName> =
    PrismaModel<TModel>["operations"]["findMany"]["args"]["distinct"];

export type OperationUriTemplate = string;
export type UriVariables = Record<string, string | number>;

export type SecurityPayload<TModel extends PrismaModelName> = {
    object: ModelResult<TModel>;
    user: User;
};

export type SecurityFn<TModel extends PrismaModelName> = (
    payload: SecurityPayload<TModel>
) => boolean;

export type SecurityContext<TModel extends PrismaModelName> = {
    object?: ModelResult<TModel>;
    user?: User;
};

export type ValidationFields<TModel extends PrismaModelName> = {
    [key in ModelFields<TModel>]?: z.ZodType<any> extends z.ZodType<infer T>
        ? T
        : never;
};

export type MutationOperations = {
    post: "post";
    put: "put";
    patch: "patch";
    delete: "delete";
};

export type MutationOperation<TModel extends PrismaModelName> = {
    inputValidation?: z.ZodObject<ValidationFields<TModel>>;
};

export type QueryOperations = {
    get: "get";
    getCollection: "getCollection";
};

export type QueryOperation<TModel extends PrismaModelName> = {
    outputValidation?: z.ZodObject<ValidationFields<TModel>>;
};

export type BaseOperation<TModel extends PrismaModelName> = {
    uriTemplate?: OperationUriTemplate;
    security?: SecurityFn<TModel>;
    securityMessage?: string;
};

export type PostOperation<TModel extends PrismaModelName> =
    BaseOperation<TModel> &
        MutationOperation<TModel> & {
            operation: MutationOperations["post"];
        };

export type GetOperation<TModel extends PrismaModelName> =
    BaseOperation<TModel> &
        QueryOperation<TModel> & {
            operation: QueryOperations["get"];
            orderBy?: ModelOrderBy<TModel>;
            where?: ModelWhere<TModel>;
            select?: ModelSelect<TModel>;
            distinct?: ModelDistinct<TModel>;
        };

export type GetCollectionOperation<TModel extends PrismaModelName> =
    BaseOperation<TModel> &
        QueryOperation<TModel> & {
            operation: QueryOperations["getCollection"];
            orderBy?: ModelOrderBy<TModel>;
            where?: ModelWhere<TModel>;
            select?: ModelSelect<TModel>;
            distinct?: ModelDistinct<TModel>;
        };

export type PutOperation<TModel extends PrismaModelName> =
    BaseOperation<TModel> &
        MutationOperation<TModel> & {
            operation: MutationOperations["put"];
            select?: ModelSelect<TModel>;
            where?: ModelWhere<TModel>;
        };

export type PatchOperation<TModel extends PrismaModelName> =
    BaseOperation<TModel> &
        MutationOperation<TModel> & {
            operation: MutationOperations["patch"];
            select?: ModelSelect<TModel>;
            where?: ModelWhere<TModel>;
        };

export type DeleteOperation<TModel extends PrismaModelName> =
    BaseOperation<TModel> &
        MutationOperation<TModel> & {
            operation: MutationOperations["delete"];
            select?: ModelSelect<TModel>;
            where?: ModelWhere<TModel>;
        };

export type Operation<TModel extends PrismaModelName> =
    | PostOperation<TModel>
    | GetOperation<TModel>
    | GetCollectionOperation<TModel>
    | PutOperation<TModel>
    | PatchOperation<TModel>
    | DeleteOperation<TModel>;

export type ModelResource<TModel extends PrismaModelName> = {
    operations?: Operation<TModel>[];
};

export type Resources = {
    [key in PrismaModelName]?: ModelResource<key>;
};

export type User = {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
};

export type Context<TModel extends PrismaModelName> = {
    model: TModel;
    security: SecurityContext<TModel>;
    previousObject?: ModelResult<TModel>;
    db: PrismaClient;
};

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
