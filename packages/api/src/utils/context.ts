import {
    Config,
    Context,
    ModelGetQueryResult,
    PrismaModelName
} from "../types";

type BuildContextProps<TModel extends PrismaModelName> = {
    config: Config;
    request: Request;
    model: TModel;
    object: ModelGetQueryResult<TModel> | undefined;
};

async function buildContext<TModel extends PrismaModelName>({
    config,
    request,
    model,
    object
}: BuildContextProps<TModel>): Promise<Context<TModel>> {
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
