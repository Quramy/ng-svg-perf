import { QiitaRawUser } from './common-qiita';
export declare class User {
    id: string;
    raw: QiitaRawUser;
}
export declare class Follow {
    type: 'oneway' | 'twoway';
    source: string;
    target: string;
}
export declare class Link {
    source: number;
    target: number;
}
export interface PickupOption {
    minItems?: number;
    linkDiv?: number;
}
export declare class UserLink {
    private _rawUsers;
    private _rawFollows;
    private _users;
    private _follows;
    constructor();
    update(users: User[], links: Follow[]): void;
    nodes(): User[];
    links(): Link[];
    init(): this;
    pickup(options?: PickupOption): this;
}
