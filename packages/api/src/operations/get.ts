import { Context, GetOperation, PrismaModelName, UriVariables } from "../types";

async function getHandler<
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
    operation: GetOperation<TModel>;
    uriVariables: UriVariables;
    context: TContext;
}) {
    const { orderBy, where, select, distinct } = operation;

    const prismaModel = context.db[model];

    if ("findUnique" in prismaModel) {
        const data = await (prismaModel as any).findUnique({
            where: {
                ...where,
                id: uriVariables.id,
            },
            orderBy,
            select,
            distinct,
        });

        return Response.json(data);
    }

    return Response.json({ message: "Not found" }, { status: 404 });
}

function createGetOperation<TModel extends PrismaModelName>(
    operation: Omit<GetOperation<TModel>, "operation">
): GetOperation<TModel> {
    return {
        ...operation,
        operation: "get",
    };
}

export { createGetOperation, getHandler };
