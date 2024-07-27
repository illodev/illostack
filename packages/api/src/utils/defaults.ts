import pluralize from "pluralize";
import {
    createDeleteOperation,
    createGetCollectionOperation,
    createGetOperation,
    createPatchOperation,
    createPostOperation,
    createPutOperation,
} from "../operations";
import { Config, PrismaModelName } from "../types";

const excludeMethods = [
    "$transaction",
    "$queryRawUnsafe",
    "$queryRaw",
    "$on",
    "$extends",
    "$executeRawUnsafe",
    "$executeRaw",
    "$disconnect",
    "$connect",
    "$use",
    "$parent",
    "_originalClient",
    "_middlewares",
    "_createPrismaPromise",
    "_extensions",
    "_previewFeatures",
    "_clientVersion",
    "_activeProvider",
    "_globalOmit",
    "_tracingHelper",
    "_errorFormat",
    "_runtimeDataModel",
    "_engineConfig",
    "_accelerateEngineConfig",
    "_engine",
    "_requestHandler",
    "_metrics",
    "_appliedParent",
] as const;

function getDefaultOperations<TModel extends PrismaModelName>({
    model,
}: {
    model: TModel;
}) {
    const pluralModel = pluralize(model);

    return [
        createGetCollectionOperation({
            uriTemplate: `/${pluralModel}`,
        }),
        createGetOperation({
            uriTemplate: `/${pluralModel}/{id}`,
        }),
        createPostOperation({
            uriTemplate: `/${pluralModel}`,
        }),
        createPutOperation({
            uriTemplate: `/${pluralModel}/{id}`,
        }),
        createPatchOperation({
            uriTemplate: `/${pluralModel}/{id}`,
        }),
        createDeleteOperation({
            uriTemplate: `/${pluralModel}/{id}`,
        }),
    ];
}

function getDefaultResources({ config }: { config: Config }) {
    const prisma = config.providers.database;

    type PrismaWithModelsOnly = Omit<
        typeof prisma,
        (typeof excludeMethods)[number] | symbol
    >;

    const models = Object.keys(prisma).filter(
        (key) => !excludeMethods.includes(key as any)
    ) as (keyof PrismaWithModelsOnly)[];

    const resources: Record<string, { operations: any[] }> = {};

    for (const model of models) {
        resources[model] = {
            operations: getDefaultOperations({ model }),
        };
    }

    return resources;
}

export { getDefaultOperations, getDefaultResources };
