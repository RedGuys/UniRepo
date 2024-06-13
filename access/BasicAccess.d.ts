import {Access} from "../types";

export default class BasicAccess extends Access {
    type: "basic";

    constructor(repo: string);

    canWrite(req: Express.Request): Promise<boolean>;
    canRead(req: Express.Request): Promise<boolean>;

    getActiveToken(req: Express.Request): string;
}