import {Access} from "../types";

export default class PublicAccess extends Access {
    type: "public";

    canWrite(req: Express.Request): Promise<boolean>;
    canRead(req: Express.Request): Promise<boolean>;
}