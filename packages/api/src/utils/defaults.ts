import pluralize from "pluralize";
import { excludeMethodsFromPrismaClient } from "../constants";
import {
    createDeleteOperation,
    createGetCollectionOperation,
    createGetOperation,
    createPatchOperation,
    createPostOperation,
    createPutOperation
} from "../operations";
import { Config, PrismaModelName } from "../types";

type GetDefaultOperationsProps<TModel extends PrismaModelName> = {
    model: TModel;
};

function getDefaultOperations<TModel extends PrismaModelName>({
    model
}: GetDefaultOperationsProps<TModel>) {
    const pluralModel = pluralize(model);

    return [
        createGetCollectionOperation({
            uriTemplate: `/${pluralModel}`
        }),
        createGetOperation({
            uriTemplate: `/${pluralModel}/{id}`
        }),
        createPostOperation({
            uriTemplate: `/${pluralModel}`
        }),
        createPutOperation({
            uriTemplate: `/${pluralModel}/{id}`
        }),
        createPatchOperation({
            uriTemplate: `/${pluralModel}/{id}`
        }),
        createDeleteOperation({
            uriTemplate: `/${pluralModel}/{id}`
        })
    ];
}

type GetDefaultResourcesProps = {
    config: Config;
};

function getDefaultResources({ config }: GetDefaultResourcesProps) {
    const prisma = config.providers.database;

    type PrismaWithModelsOnly = Omit<
        typeof prisma,
        (typeof excludeMethodsFromPrismaClient)[number] | symbol
    >;

    const models = Object.keys(prisma).filter(
        (key) => !excludeMethodsFromPrismaClient.includes(key as any)
    ) as (keyof PrismaWithModelsOnly)[];

    const resources: Record<string, { operations: any[] }> = {};

    for (const model of models) {
        resources[model] = {
            operations: getDefaultOperations({ model })
        };
    }

    return resources;
}

export { getDefaultOperations, getDefaultResources };
