import { FieldRef } from "@prisma/client/runtime/library";
import {
    Config,
    ModelResource,
    Operation,
    PrismaModelName,
    Resources
} from "../types";

function getPathFromRequest(request: Request) {
    return new URL(request.url).pathname;
}

const splitPath = (path: string) => {
    return path.split("/").filter((part) => part !== "");
};

type GetFieldsTypeProps<TModel extends PrismaModelName> = {
    model: TModel;
    config: Config;
};

function getFieldsType<TModel extends PrismaModelName>({
    model,
    config
}: GetFieldsTypeProps<TModel>) {
    return config.providers.database[model].fields;
}

type BuildUriVariablesProps<TModel extends PrismaModelName> = {
    path: string;
    operation: Operation<TModel>;
    prefix: string;
    model: TModel;
    config: Config;
};

function buildUriVariables<TModel extends PrismaModelName>({
    path,
    operation,
    prefix,
    model,
    config
}: BuildUriVariablesProps<TModel>) {
    const uriVariables: Record<string, string | number> = {};

    const pathParts = splitPath(path);
    const templateParts = splitPath(`${prefix}/${operation.uriTemplate}`);

    if (!templateParts) {
        return uriVariables;
    }

    for (let i = 0; i < templateParts.length; i++) {
        if (templateParts[i].startsWith("{")) {
            uriVariables[templateParts[i].slice(1, -1)] = pathParts[i];
        }
    }

    const fieldsType = getFieldsType({ model, config });

    for (const [key, value] of Object.entries(uriVariables)) {
        const fieldKey = key as keyof typeof fieldsType;

        if (!fieldsType[fieldKey]) {
            throw new Error(`Field ${fieldKey} not found in model ${model}`);
        }

        const fieldRef = fieldsType[fieldKey] as FieldRef<TModel, unknown>;

        if (fieldRef.typeName === "Int") {
            uriVariables[key] = parseInt(value as string);
        }
    }

    return uriVariables;
}

type MatchRouteProps<TModel extends PrismaModelName> = {
    path: string;
    resources: Resources;
    prefix?: string;
};

const matchRoute = <TModel extends PrismaModelName>({
    path,
    resources,
    prefix
}: MatchRouteProps<TModel>) => {
    // Split the path into parts
    const parts = splitPath(path);

    // Iterate over the resources in the API schema
    for (const [model, resource] of Object.entries(resources)) {
        const operations = resource.operations;

        if (!operations) {
            continue;
        }

        // Iterate over the operations for the resource
        for (const operation of operations) {
            // Check if the URI template matches the path
            if (operation.uriTemplate) {
                const templateParts = splitPath(
                    `${prefix}/${operation.uriTemplate}`
                );

                if (parts.length === templateParts.length) {
                    let match = true;

                    for (let i = 0; i < parts.length; i++) {
                        if (
                            !templateParts[i].startsWith("{") &&
                            parts[i] !== templateParts[i]
                        ) {
                            match = false;
                            break;
                        }
                    }

                    if (!match) {
                        continue;
                    }

                    return {
                        model: model as TModel,
                        operation: operation as Operation<TModel>,
                        resource: resource as ModelResource<TModel>
                    };
                }
            }
        }
    }

    return undefined;
};

export { buildUriVariables, getPathFromRequest, matchRoute };
