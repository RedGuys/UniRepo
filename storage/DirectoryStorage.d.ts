import {Storage} from "../types";

export default class DirectoryStorage implements Storage {
    type: "directory";
    path: string;

    constructor(path: string);

    deleteFile(path: string): void;

    exists(path: string): boolean;

    readFile(path: string): Buffer;

    writeFile(path: string, data: string | NodeJS.ArrayBufferView): void;
}