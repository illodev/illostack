import { Config, PrismaModelName } from "../types";

async function getObject<TModel extends PrismaModelName>({
    model,
    uriVariables,
    config
}: {
    model: TModel;
    uriVariables: Record<string, string | number>;
    config: Config;
}) {
    try {
        const object = await (
            config.providers.database[model] as any
        ).findUnique({
            where: uriVariables
        });

        return object;
    } catch (error) {
        return null;
    }
}

export { getObject };
