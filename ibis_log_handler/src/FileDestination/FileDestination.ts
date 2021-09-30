export default interface FileDestination {
    put(file: Buffer): Promise<void>;
}