import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

//
// # Prisma
//--------------------------------------------------------------------------

export type PrismaModelName = Prisma.TypeMap["meta"]["modelProps"];
export type PrismaModelCapitalized<TModel extends PrismaModelName> =
    Capitalize<TModel>;
export type PrismaModel<TModel extends PrismaModelName> =
    Prisma.TypeMap["model"][PrismaModelCapitalized<TModel>];

export type ModelFields<TModel extends PrismaModelName> =
    keyof PrismaModel<TModel>["operations"]["create"]["args"]["data"];

export type ModelGetQueryResult<TModel extends PrismaModelName> =
    PrismaModel<TModel>["operations"]["findUnique"]["result"];

export type ModelGetCollectionQueryResult<TModel extends PrismaModelName> =
    PrismaModel<TModel>["operations"]["findMany"]["result"];

export type ModelCreateResult<TModel extends PrismaModelName> =
    PrismaModel<TModel>["operations"]["create"]["result"];

export type ModelUpdateResult<TModel extends PrismaModelName> =
    PrismaModel<TModel>["operations"]["update"]["result"];

export type ModelDeleteResult<TModel extends PrismaModelName> =
    PrismaModel<TModel>["operations"]["delete"]["result"];

export type ModelOrderBy<TModel extends PrismaModelName> =
    PrismaModel<TModel>["operations"]["findMany"]["args"]["orderBy"];

export type ModelWhere<TModel extends PrismaModelName> =
    PrismaModel<TModel>["operations"]["findMany"]["args"]["where"];

export type ModelSelect<TModel extends PrismaModelName> =
    PrismaModel<TModel>["operations"]["findMany"]["args"]["select"];

export type ModelDistinct<TModel extends PrismaModelName> =
    PrismaModel<TModel>["operations"]["findMany"]["args"]["distinct"];

export type ModelGetQueryArgs<TModel extends PrismaModelName> =
    PrismaModel<TModel>["operations"]["findUnique"]["args"];

export type ModelGetCollectionQueryArgs<TModel extends PrismaModelName> =
    PrismaModel<TModel>["operations"]["findMany"]["args"];

//
// # Security
//--------------------------------------------------------------------------

export type User = {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
};

export type SecurityPayload<TModel extends PrismaModelName> = {
    object?: ModelGetQueryResult<TModel>;
    user: User;
};

export type SecurityFn<TModel extends PrismaModelName> = (
    payload: SecurityPayload<TModel>
) => boolean;

export type SecurityContext<TModel extends PrismaModelName> = {
    object?: ModelGetQueryResult<TModel>;
    user?: User;
};

//
// # Validation
//--------------------------------------------------------------------------

export type ValidationFields<TModel extends PrismaModelName> = {
    [key in ModelFields<TModel>]?: z.ZodType<any> extends z.ZodType<infer T>
        ? T
        : never;
};

export type Validation<TModel extends PrismaModelName> = z.ZodObject<
    ValidationFields<TModel>
>;

//
// # Operations
//--------------------------------------------------------------------------

export type OperationUriTemplate<TModel extends PrismaModelName> =
    | `/${string}${ModelFields<TModel> extends string ? `/{${ModelFields<TModel>}}` : ""}`
    | `/${string}`;
export type UriVariables = Record<string, string | number>;

export type MutationOperations = {
    post: "post";
    put: "put";
    patch: "patch";
    delete: "delete";
};

export type MutationOperation<
    TModel extends PrismaModelName,
    TInputValidation extends Validation<TModel>
> = {
    inputValidation?: TInputValidation;
};

export type QueryOperations = {
    get: "get";
    getCollection: "getCollection";
};

export type QueryOperation<TModel extends PrismaModelName> = {
    outputValidation?: Validation<TModel>;
};

export type PrePersistData<
    TModel extends PrismaModelName,
    TInputValidation extends z.ZodObject<any>
> =
    TInputValidation extends Validation<TModel>
        ? z.infer<TInputValidation>
        : PrismaModel<TModel>["operations"]["create"]["args"]["data"];

export type OnPrePersist<
    TModel extends PrismaModelName,
    TInputValidation extends Validation<TModel>
> = (event: {
    data: PrePersistData<TModel, TInputValidation>;
    operation: MutationOperation<TModel, TInputValidation>;
    uriVariables: UriVariables;
    context: Context<TModel>;
}) => Promise<PrePersistData<TModel, TInputValidation>>;

export type OnPostPersistCreate<
    TModel extends PrismaModelName,
    TInputValidation extends Validation<TModel>
> = (event: {
    data: ModelCreateResult<TModel>;
    operation: MutationOperation<TModel, TInputValidation>;
    uriVariables: UriVariables;
    context: Context<TModel>;
}) => Promise<ModelCreateResult<TModel>>;

export type OnPostPersistUpdate<
    TModel extends PrismaModelName,
    TInputValidation extends Validation<TModel>
> = (event: {
    data: ModelUpdateResult<TModel>;
    operation: MutationOperation<TModel, TInputValidation>;
    uriVariables: UriVariables;
    context: Context<TModel>;
}) => Promise<ModelUpdateResult<TModel>>;

export type OnPostPersistDelete<
    TModel extends PrismaModelName,
    TInputValidation extends Validation<TModel>
> = (event: {
    data: ModelDeleteResult<TModel>;
    operation: MutationOperation<TModel, TInputValidation>;
    uriVariables: UriVariables;
    context: Context<TModel>;
}) => Promise<ModelDeleteResult<TModel>>;

export type OnPreQueryGet<TModel extends PrismaModelName> = (event: {
    query: ModelGetQueryArgs<TModel>;
    operation: QueryOperation<TModel>;
    uriVariables: UriVariables;
    context: Context<TModel>;
}) => Promise<void>;

export type OnPreQueryGetCollection<TModel extends PrismaModelName> = (event: {
    query: ModelGetCollectionQueryArgs<TModel>;
    operation: QueryOperation<TModel>;
    uriVariables: UriVariables;
    context: Context<TModel>;
}) => Promise<void>;

export type OnPostQueryGet<TModel extends PrismaModelName> = (event: {
    data: ModelGetQueryResult<TModel>;
    operation: QueryOperation<TModel>;
    uriVariables: UriVariables;
    context: Context<TModel>;
}) => Promise<void>;

export type OnPostQueryGetCollection<TModel extends PrismaModelName> = (event: {
    data: ModelGetCollectionQueryResult<TModel>;
    operation: QueryOperation<TModel>;
    uriVariables: UriVariables;
    context: Context<TModel>;
}) => Promise<void>;

export type BaseOperation<TModel extends PrismaModelName> = {
    uriTemplate?: OperationUriTemplate<TModel>;
    security?: SecurityFn<TModel>;
    securityMessage?: string;
};

export type PostOperation<
    TModel extends PrismaModelName,
    TInputValidation extends Validation<TModel> = Validation<TModel>
> = BaseOperation<TModel> &
    MutationOperation<TModel, TInputValidation> & {
        operation: MutationOperations["post"];
        select?: ModelSelect<TModel>;
        onPrePersist?: OnPrePersist<TModel, TInputValidation>;
        onPostPersist?: OnPostPersistCreate<TModel, TInputValidation>;
    };

export type PutOperation<
    TModel extends PrismaModelName,
    TInputValidation extends Validation<TModel>
> = BaseOperation<TModel> &
    MutationOperation<TModel, TInputValidation> & {
        operation: MutationOperations["put"];
        select?: ModelSelect<TModel>;
        where?: ModelWhere<TModel>;
        onPrePersist?: OnPrePersist<TModel, TInputValidation>;
        onPostPersist?: OnPostPersistUpdate<TModel, TInputValidation>;
    };

export type PatchOperation<
    TModel extends PrismaModelName,
    TInputValidation extends Validation<TModel>
> = BaseOperation<TModel> &
    MutationOperation<TModel, TInputValidation> & {
        operation: MutationOperations["patch"];
        select?: ModelSelect<TModel>;
        where?: ModelWhere<TModel>;
        onPrePersist?: OnPrePersist<TModel, TInputValidation>;
        onPostPersist?: OnPostPersistUpdate<TModel, TInputValidation>;
    };

export type DeleteOperation<
    TModel extends PrismaModelName,
    TInputValidation extends Validation<TModel>
> = BaseOperation<TModel> &
    MutationOperation<TModel, TInputValidation> & {
        operation: MutationOperations["delete"];
        select?: ModelSelect<TModel>;
        where?: ModelWhere<TModel>;
        onPrePersist?: OnPrePersist<TModel, TInputValidation>;
        onPostPersist?: OnPostPersistDelete<TModel, TInputValidation>;
    };

export type GetOperation<TModel extends PrismaModelName> =
    BaseOperation<TModel> &
        QueryOperation<TModel> & {
            operation: QueryOperations["get"];
            orderBy?: ModelOrderBy<TModel>;
            where?: ModelWhere<TModel>;
            select?: ModelSelect<TModel>;
            distinct?: ModelDistinct<TModel>;
            onPreQuery?: OnPreQueryGet<TModel>;
            onPostQuery?: OnPostQueryGet<TModel>;
        };

export type GetCollectionOperation<TModel extends PrismaModelName> =
    BaseOperation<TModel> &
        QueryOperation<TModel> & {
            operation: QueryOperations["getCollection"];
            orderBy?: ModelOrderBy<TModel>;
            where?: ModelWhere<TModel>;
            select?: ModelSelect<TModel>;
            distinct?: ModelDistinct<TModel>;
            onPreQuery?: OnPreQueryGetCollection<TModel>;
            onPostQuery?: OnPostQueryGetCollection<TModel>;
        };

export type Operation<TModel extends PrismaModelName> =
    | PostOperation<TModel, any>
    | GetOperation<TModel>
    | GetCollectionOperation<TModel>
    | PutOperation<TModel, any>
    | PatchOperation<TModel, any>
    | DeleteOperation<TModel, any>;

//
// # Resources
//--------------------------------------------------------------------------

export type ModelResource<TModel extends PrismaModelName> = {
    operations?: Operation<TModel>[];
    security?: SecurityFn<TModel>;
    securityMessage?: string;
};

export type Resources = {
    [key in PrismaModelName]?: ModelResource<key>;
};

//
// # Context
//--------------------------------------------------------------------------

export type Context<TModel extends PrismaModelName> = {
    model: TModel;
    security: SecurityContext<TModel>;
    previousObject?: ModelGetQueryResult<TModel>;
    db: PrismaClient;
};

//
// # Config
//--------------------------------------------------------------------------

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
        auth?: AuthProvider;
    };
};
