import { Context, GetOperation, PrismaModelName, UriVariables } from "../types";

async function getHandler<
    TModel extends PrismaModelName,
    TContext extends Context<TModel>
>({
    request,
    model,
    operation,
    uriVariables,
    context
}: {
    request: Request;
    model: PrismaModelName;
    operation: GetOperation<TModel>;
    uriVariables: UriVariables;
    context: TContext;
}): Promise<Response> {
    const { orderBy, where, select, distinct } = operation;

    const prismaModel = context.db[model];

    const result = await (prismaModel as any).findUnique({
        where: {
            ...uriVariables,
            ...where
        },
        orderBy,
        select,
        distinct
    });

    return Response.json(result);
}

function createGetOperation<TModel extends PrismaModelName>(
    operation: Omit<GetOperation<TModel>, "operation">
): GetOperation<TModel> {
    return {
        ...operation,
        operation: "get"
    };
}

export { createGetOperation, getHandler };
