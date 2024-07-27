import {
    Context,
    ModelResult,
    Operation,
    PrismaModelName,
    User,
} from "../types";

async function checkSecurity<TModel extends PrismaModelName>({
    operation,
    context,
}: {
    operation: Operation<TModel>;
    context: Context<TModel>;
}): Promise<boolean> {
    if (operation.security) {
        return operation.security({
            object: context.previousObject as ModelResult<TModel>,
            user: context.security.user as User,
        });
    }

    return true;
}

export { checkSecurity };
