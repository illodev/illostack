import { Context, PrismaModelName, PutOperation, UriVariables } from "../types";

async function putHandler<
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
    operation: PutOperation<TModel>;
    uriVariables: UriVariables;
    context: TContext;
}) {
    const data = operation.inputValidation?.parse(request.body) || request.body;

    const { where, select } = operation;

    const result = await (context.db[model] as any).update({
        data,
        where: {
            ...uriVariables,
            ...where
        },
        select
    });

    return Response.json(result);
}

function createPutOperation<TModel extends PrismaModelName>(
    operation: Omit<PutOperation<TModel>, "operation">
): PutOperation<TModel> {
    return {
        ...operation,
        operation: "put"
    };
}

export { createPutOperation, putHandler };
