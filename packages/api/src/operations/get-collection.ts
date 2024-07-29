import {
    Context,
    GetCollectionOperation,
    ModelGetCollectionQueryArgs,
    ModelGetCollectionQueryResult,
    PrismaModelName,
    UriVariables
} from "../types";

async function getCollectionHandler<
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
    operation: GetCollectionOperation<TModel>;
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
    } as ModelGetCollectionQueryArgs<TModel>;

    if (operation.onPreQuery) {
        await operation.onPreQuery({
            query,
            operation,
            uriVariables,
            context
        });
    }

    const data = (await (context.db[model] as any).findMany(
        query
    )) as ModelGetCollectionQueryResult<TModel>;

    if (operation.onPostQuery) {
        await operation.onPostQuery({
            data,
            operation,
            uriVariables,
            context
        });
    }

    return Response.json(data);
}

function createGetCollectionOperation<TModel extends PrismaModelName>(
    operation: Omit<GetCollectionOperation<TModel>, "operation">
): GetCollectionOperation<TModel> {
    return {
        ...operation,
        operation: "getCollection"
    };
}

export { createGetCollectionOperation, getCollectionHandler };
