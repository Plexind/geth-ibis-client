import NDJSONParser, { DELIMITER } from "./NDJSONParser";

export default class CleanNDJSONParser implements NDJSONParser {
    public parse(ndjson: Buffer): Record<string, unknown>[] {
        const rawRows: string[] = ndjson.toString().split(DELIMITER);
        const result: Record<string, unknown>[] = [];
        for (const jsonString of rawRows) {
            try {
                const parsedJson = JSON.parse(jsonString);
                result.push(parsedJson);
            } catch (err) {
                // swallow
            }
        }
        return result;
    }
}