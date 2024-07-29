import {
    Context,
    GetOperation,
    ModelGetQueryArgs,
    ModelGetQueryResult,
    PrismaModelName,
    UriVariables
} from "../types";

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

    const query = {
        orderBy,
        where: {
            ...uriVariables,
            ...where
        },
        select,
        distinct
    } as ModelGetQueryArgs<TModel>;

    if (operation.onPreQuery) {
        await operation.onPreQuery({
            query,
            operation,
            uriVariables,
            context
        });
    }

    const result = (await (context.db[model] as any).findUnique(
        query
    )) as ModelGetQueryResult<TModel>;

    if (operation.onPostQuery) {
        await operation.onPostQuery({
            data: result,
            operation,
            uriVariables,
            context
        });
    }

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
