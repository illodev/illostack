import {
    Context,
    PostOperation,
    PrismaModelName,
    UriVariables
} from "../types";

async function postHandler<
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
    operation: PostOperation<TModel>;
    uriVariables: UriVariables;
    context: TContext;
}): Promise<Response> {
    const data = operation.inputValidation?.parse(request.body) || request.body;

    const { select } = operation;

    const result = await (context.db[model] as any).create({
        data,
        select
    });

    return Response.json(result);
}

function createPostOperation<TModel extends PrismaModelName>(
    operation: Omit<PostOperation<TModel>, "operation">
): PostOperation<TModel> {
    return {
        ...operation,
        operation: "post"
    };
}

export { createPostOperation, postHandler };
