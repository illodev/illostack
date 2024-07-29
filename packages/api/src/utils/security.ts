import {
    Context,
    ModelResource,
    Operation,
    PrismaModelName,
    User
} from "../types";

type CheckSecurityProps<TModel extends PrismaModelName> = {
    resource: ModelResource<TModel>;
    operation: Operation<TModel>;
    context: Context<TModel>;
};

async function checkSecurity<TModel extends PrismaModelName>({
    resource,
    operation,
    context
}: CheckSecurityProps<TModel>): Promise<boolean> {
    // First, check if the operation has a security function
    if (operation.security) {
        return operation.security({
            object: context.previousObject,
            user: context.security.user as User
        });
    }

    // Next, check if the resource has a security function
    if (resource.security) {
        return resource.security({
            object: context.previousObject,
            user: context.security.user as User
        });
    }

    return true;
}

export { checkSecurity };
