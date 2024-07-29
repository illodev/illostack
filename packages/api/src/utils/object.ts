import { Config, PrismaModelName } from "../types";

type GetObjectProps<TModel extends PrismaModelName> = {
    model: TModel;
    uriVariables: Record<string, string | number>;
    config: Config;
};

async function getObject<TModel extends PrismaModelName>({
    model,
    uriVariables,
    config
}: GetObjectProps<TModel>) {
    // If there are no variables in the URI, an object cannot be searched, it is understood that
    // it is a collection request or the creation of an object
    if (Object.keys(uriVariables).length === 0) {
        return null;
    }

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
