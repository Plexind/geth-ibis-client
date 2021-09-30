export default interface NDJSONParser {
    parse(ndjson: Buffer): Record<string, unknown>[]
}

export const DELIMITER = "\n";