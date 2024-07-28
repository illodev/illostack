import {
    Context,
    PatchOperation,
    PrismaModelName,
    UriVariables
} from "../types";

async function patchHandler<
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
    operation: PatchOperation<TModel>;
    uriVariables: UriVariables;
    context: TContext;
}): Promise<Response> {
    const data = operation.inputValidation?.parse(request.body) || request.body;

    const { where, select } = operation;

    const result = await (context.db[model] as any).update({
        data,
        where: { ...uriVariables, ...where },
        select
    });

    return Response.json(result);
}

function createPatchOperation<TModel extends PrismaModelName>(
    operation: Omit<PatchOperation<TModel>, "operation">
): PatchOperation<TModel> {
    return {
        ...operation,
        operation: "patch"
    };
}

export { createPatchOperation, patchHandler };
