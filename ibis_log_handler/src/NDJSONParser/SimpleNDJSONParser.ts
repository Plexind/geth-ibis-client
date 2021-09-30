import NDJSONParser, { DELIMITER } from "./NDJSONParser";

export default class SimpleNDJSONParser implements NDJSONParser {
    public parse(ndjson: Buffer): Record<string, unknown>[] {
        return ndjson.toString().split(DELIMITER).map(jsonString => JSON.parse(jsonString));
    }
}