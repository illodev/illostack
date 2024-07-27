import {
    Context,
    DeleteOperation,
    PrismaModelName,
    UriVariables,
} from "../types";

async function deleteHandler<
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
    operation: DeleteOperation<TModel>;
    uriVariables: UriVariables;
    context: TContext;
}) {
    const user = await (context.db[model] as any).delete({
        where: { id: uriVariables.id },
    });

    return Response.json(user);
}

function createDeleteOperation<TModel extends PrismaModelName>(
    operation: Omit<DeleteOperation<TModel>, "operation">
): DeleteOperation<TModel> {
    return {
        ...operation,
        operation: "delete",
    };
}

export { createDeleteOperation, deleteHandler };
