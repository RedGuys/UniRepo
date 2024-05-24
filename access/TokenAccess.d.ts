import {Access} from "../types";

export default class TokenAccess extends Access {
    type: "token";

    constructor(repo: string);

    canWrite(req: Express.Request): Promise<boolean>;
    canRead(req: Express.Request): Promise<boolean>;

    getActiveToken(req: Express.Request): string;
}