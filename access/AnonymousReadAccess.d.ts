import {Access} from "../types";

export default class TokenAccess extends Access {
    type: "anonymous";

    constructor(access: Access);

    canWrite(req: Express.Request): Promise<boolean>;
    canRead(req: Express.Request): Promise<boolean>;
}