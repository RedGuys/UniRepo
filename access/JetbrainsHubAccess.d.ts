import {Access} from "../types";

export default class JetbrainsHubAccess extends Access {
    type: "jetbrains";

    constructor(url: string, group: string);

    canWrite(req: Express.Request): Promise<boolean>;
    canRead(req: Express.Request): Promise<boolean>;

    getActiveToken(req: Express.Request): string;
}