import {
    Context,
    PrismaModelName,
    PutOperation,
    UriVariables,
    Validation
} from "../types";

type PutHandlerProps<
    TModel extends PrismaModelName,
    TContext extends Context<TModel>,
    TInputValidation extends Validation<TModel>
> = {
    request: Request;
    model: PrismaModelName;
    operation: PutOperation<TModel, TInputValidation>;
    uriVariables: UriVariables;
    context: TContext;
};

async function putHandler<
    TModel extends PrismaModelName,
    TContext extends Context<TModel>,
    TInputValidation extends Validation<TModel>
>({
    request,
    model,
    operation,
    uriVariables,
    context
}: PutHandlerProps<TModel, TContext, TInputValidation>): Promise<Response> {
    const data =
        operation.inputValidation?.parse(request.body) || (request.body as any);

    const { where, select } = operation;

    if (operation.onPrePersist) {
        await operation.onPrePersist({
            data,
            operation,
            uriVariables,
            context
        });
    }

    const result = await (context.db[model] as any).update({
        data,
        where: {
            ...uriVariables,
            ...where
        },
        select
    });

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

function createPutOperation<
    TModel extends PrismaModelName,
    TInputValidation extends Validation<TModel>
>(
    operation: Omit<PutOperation<TModel, TInputValidation>, "operation">
): PutOperation<TModel, TInputValidation> {
    return {
        ...operation,
        operation: "put"
    };
}

export { createPutOperation, putHandler };
