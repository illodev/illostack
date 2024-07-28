import { Config, Context, ModelResult, PrismaModelName } from "../types";

async function buildContext<TModel extends PrismaModelName>({
    config,
    request,
    model,
    object
}: {
    config: Config;
    request: Request;
    model: TModel;
    object: ModelResult<TModel> | undefined;
}): Promise<Context<TModel>> {
    const security = (await config.providers.auth?.(request)) ?? {};

    const context = {
        model,
        security: {
            object,
            ...security
        },
        previousObject: object,
        db: config.providers.database
    };

    return context;
}

export { buildContext };
