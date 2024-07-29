import {
    Context,
    MutateModelResult,
    PostOperation,
    PrismaModelName,
    UriVariables,
    Validation
} from "../types";

type PostHandlerProps<
    TModel extends PrismaModelName,
    TContext extends Context<TModel>,
    TInputValidation extends Validation<TModel>
> = {
    request: Request;
    model: PrismaModelName;
    operation: PostOperation<TModel, TInputValidation>;
    uriVariables: UriVariables;
    context: TContext;
};

async function postHandler<
    TModel extends PrismaModelName,
    TContext extends Context<TModel>,
    TInputValidation extends Validation<TModel>
>({
    request,
    model,
    operation,
    uriVariables,
    context
}: PostHandlerProps<TModel, TContext, TInputValidation>): Promise<Response> {
    const data =
        operation.inputValidation?.parse(request.body) || (request.body as any);

    const { select } = operation;

    if (operation.onPrePersist) {
        await operation.onPrePersist({
            data,
            operation,
            uriVariables,
            context
        });
    }

    const result = (await (context.db[model] as any).create({
        data,
        select
    })) as MutateModelResult<TModel>;

    if (operation.onPostPersist) {
        await operation.onPostPersist({
            data: result,
            operation,
            uriVariables,
            context
        });
    }

    return Response.json(result);
}

function createPostOperation<
    TModel extends PrismaModelName,
    TInputValidation extends Validation<TModel>
>(
    operation: Omit<PostOperation<TModel, TInputValidation>, "operation">
): PostOperation<TModel, TInputValidation> {
    return {
        ...operation,
        operation: "post"
    };
}

export { createPostOperation, postHandler };
