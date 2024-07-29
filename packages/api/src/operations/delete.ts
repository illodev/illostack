import {
    Context,
    DeleteOperation,
    PrismaModelName,
    UriVariables,
    Validation
} from "../types";

async function deleteHandler<
    TModel extends PrismaModelName,
    TContext extends Context<TModel>,
    TInputValidation extends Validation<TModel>
>({
    request,
    model,
    operation,
    uriVariables,
    context
}: {
    request: Request;
    model: PrismaModelName;
    operation: DeleteOperation<TModel, TInputValidation>;
    uriVariables: UriVariables;
    context: TContext;
}): Promise<Response> {
    const { where, select } = operation;

    const result = await (context.db[model] as any).delete({
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

function createDeleteOperation<
    TModel extends PrismaModelName,
    TInputValidation extends Validation<TModel>
>(
    operation: Omit<DeleteOperation<TModel, TInputValidation>, "operation">
): DeleteOperation<TModel, TInputValidation> {
    return {
        ...operation,
        operation: "delete"
    };
}

export { createDeleteOperation, deleteHandler };
