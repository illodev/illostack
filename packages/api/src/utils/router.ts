import { Operation, PrismaModelName, Resources } from "../types";

function getPathFromRequest({ request }: { request: Request }) {
    return new URL(request.url).pathname;
}

const splitPath = (path: string) => {
    return path.split("/").filter((part) => part !== "");
};

async function buildUriVariables<TModel extends PrismaModelName>({
    path,
    operation,
    prefix
}: {
    path: string;
    operation: Operation<TModel>;
    prefix: string;
}) {
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

    return uriVariables;
}

function matchRoute<TModel extends PrismaModelName>({
    path,
    resources,
    prefix
}: {
    path: string;
    resources: Resources;
    prefix?: string;
}) {
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
                        operation: operation as Operation<TModel>
                    };
                }
            }
        }
    }

    return undefined;
}

export { buildUriVariables, getPathFromRequest, matchRoute };
