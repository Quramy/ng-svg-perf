import {QiitaRawUser} from './common-qiita';

export class User {
  id: string;
  raw: QiitaRawUser;
}

export class Follow {
  type: 'oneway' | 'twoway';
  source: string;
  target: string;
}

export class Link {
  source: number;
  target: number;
}

export interface PickupOption {
  minItems?: number;
  linkDiv?: number;
}

export class UserLink {

  private _rawUsers: User[] = [];
  private _rawFollows: Follow[] = [];

  private _users: User[] = [];
  private _follows: Follow[] = [];

  constructor() {
    this.init().pickup();
  }

  update(users: User[], links: Follow[]) {
    this._users = users;
    this._follows = links;
  }

  nodes() {
    return this._users.slice();
  }

  links() {
    let follows = this._follows.slice();
    return follows.map(f => {
      let link: Link = {
        source: this._users.findIndex(u => u.id === f.source),
        target: this._users.findIndex(u => u.id === f.target)
      };
      return link;
    }).filter(link => {
      return link.source !== -1 && link.target !== -1;
    });
  }

  init() {
    const rawUsers = require('../data/_users.json') as QiitaRawUser[];
    let users = rawUsers.map(u => {
      return {
        id: u.id.toLowerCase(),
        raw: u
      } as User;
    })
    let links = require('../data/_links.json') as Follow[];
    this._rawUsers = users;
    this._rawFollows = links;
    return this;
  }

  pickup(options?: PickupOption) {
    const minItems = options && options.minItems || 10;
    const linkDiv = options && options.linkDiv || 1;
    let users = this._rawUsers.filter(u => {
      return u.raw.items_count >= minItems;
    });
    let follows = this._rawFollows
    .filter(l => {
      return users.some(u => u.id === l.source) && users.some(u => u.id === l.target);
    })
    .filter((l, i) => !(i % linkDiv))
    ;
    users = users.filter(u => {
      return follows.some(l => l.source === u.id) || follows.some(l => l.target === u.id);
    });
    this._users = users;
    this._follows = follows;
    return this;
  }
}


