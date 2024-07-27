import {
    Context,
    GetCollectionOperation,
    PrismaModelName,
    UriVariables,
} from "../types";

async function getCollectionHandler<
    TModel extends PrismaModelName,
    TContext extends Context<TModel>
>({
    request,
    model,
    operation,
    uriVariables,
    context,
}: {
    request: Request;
    model: PrismaModelName;
    operation: GetCollectionOperation<TModel>;
    uriVariables: UriVariables;
    context: TContext;
}) {
    const { orderBy, where, select, distinct } = operation;

    const users = await (context.db[model] as any).findMany({
        orderBy,
        where,
        select,
        distinct,
    });

    return Response.json(users);
}

function createGetCollectionOperation<TModel extends PrismaModelName>(
    operation: Omit<GetCollectionOperation<TModel>, "operation">
): GetCollectionOperation<TModel> {
    return {
        ...operation,
        operation: "getCollection",
    };
}

export { createGetCollectionOperation, getCollectionHandler };
