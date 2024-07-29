import {
    deleteHandler,
    getCollectionHandler,
    getHandler,
    patchHandler,
    postHandler,
    putHandler
} from "./operations";
import { Config, Schema } from "./types";
import { buildContext } from "./utils/context";
import { getDefaultResources } from "./utils/defaults";
import { getObject } from "./utils/object";
import {
    buildUriVariables,
    getPathFromRequest,
    matchRoute
} from "./utils/router";
import { checkSecurity } from "./utils/security";

export function createRouteHandler(
    schema: Schema,
    config: Config
): (
    request: Request,
    { params }: { params: { path: string[] } }
) => Promise<Response> {
    return async (request) => {
        try {
            const {
                prefix = "/api",
                resources = getDefaultResources({ config })
            } = schema;

            const path = getPathFromRequest(request);
            const route = matchRoute({ path, prefix, resources });

            if (!route) {
                return Response.json({ message: "Not found" }, { status: 404 });
            }

            const { model, operation, resource } = route;

            const uriVariables = buildUriVariables({
                path,
                operation,
                prefix,
                model,
                config
            });

            const object = await getObject({ model, uriVariables, config });

            const context = await buildContext({
                config,
                request,
                model,
                object
            });

            const isAuthorized = await checkSecurity({
                resource,
                operation,
                context
            });

            if (!isAuthorized) {
                const message =
                    operation.securityMessage ||
                    resource.securityMessage ||
                    "Unauthorized";

                return Response.json(
                    {
                        message
                    },
                    { status: 403 }
                );
            }

            switch (operation.operation) {
                case "get":
                    return getHandler({
                        request,
                        model,
                        operation,
                        uriVariables,
                        context
                    });
                case "getCollection":
                    return getCollectionHandler({
                        request,
                        model,
                        operation,
                        uriVariables,
                        context
                    });
                case "post":
                    return postHandler({
                        request,
                        model,
                        operation,
                        uriVariables,
                        context
                    });
                case "put":
                    return putHandler({
                        request,
                        model,
                        operation,
                        uriVariables,
                        context
                    });
                case "patch":
                    return patchHandler({
                        request,
                        model,
                        operation,
                        uriVariables,
                        context
                    });
                case "delete":
                    return deleteHandler({
                        request,
                        model,
                        operation,
                        uriVariables,
                        context
                    });
                default:
                    return Response.json(
                        { message: "Method not allowed" },
                        { status: 405 }
                    );
            }
        } catch (error: unknown) {
            if (!(error instanceof Error)) {
                throw error;
            }

            return Response.json({ message: error.message }, { status: 500 });
        }
    };
}
