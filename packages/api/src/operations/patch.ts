import {
    Context,
    ModelUpdateResult,
    PatchOperation,
    PrismaModelName,
    UriVariables,
    Validation
} from "../types";

type PatchHandlerProps<
    TModel extends PrismaModelName,
    TContext extends Context<TModel>,
    TInputValidation extends Validation<TModel>
> = {
    request: Request;
    model: PrismaModelName;
    operation: PatchOperation<TModel, TInputValidation>;
    uriVariables: UriVariables;
    context: TContext;
};

async function patchHandler<
    TModel extends PrismaModelName,
    TContext extends Context<TModel>,
    TInputValidation extends Validation<TModel>
>({
    request,
    model,
    operation,
    uriVariables,
    context
}: PatchHandlerProps<TModel, TContext, TInputValidation>): Promise<Response> {
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

    const result = (await (context.db[model] as any).update({
        data,
        where: { ...uriVariables, ...where },
        select
    })) as ModelUpdateResult<TModel>;

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

function createPatchOperation<
    TModel extends PrismaModelName,
    TInputValidation extends Validation<TModel>
>(
    operation: Omit<PatchOperation<TModel, TInputValidation>, "operation">
): PatchOperation<TModel, TInputValidation> {
    return {
        ...operation,
        operation: "patch"
    };
}

export { createPatchOperation, patchHandler };
