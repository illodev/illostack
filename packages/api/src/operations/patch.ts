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
}) {
    const data = operation.inputValidation?.parse(request.body) || request.body;

    const user = await (context.db[model] as any).update({
        where: { id: uriVariables.id },
        data
    });

    return Response.json(user);
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
