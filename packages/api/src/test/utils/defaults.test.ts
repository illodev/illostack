import { describe, expect, it } from "vitest";
import { getDefaultOperations } from "../../utils/defaults";

describe("getDefaultOperations", () => {
    it("should return default operations for a given model", () => {
        const model = "user";
        const operations = getDefaultOperations({ model });

        expect(operations).toHaveLength(6);
        expect(operations[0].uriTemplate).toBe("/users");
        expect(operations[1].uriTemplate).toBe("/users/{id}");
        expect(operations[2].uriTemplate).toBe("/users");
        expect(operations[3].uriTemplate).toBe("/users/{id}");
        expect(operations[4].uriTemplate).toBe("/users/{id}");
        expect(operations[5].uriTemplate).toBe("/users/{id}");
    });
});
