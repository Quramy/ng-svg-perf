import 'es6-shim';
import 'reflect-metadata';
import 'zone.js/dist/zone';
import 'rxjs';

import {bootstrap} from 'angular2/platform/browser';
import {provide, enableProdMode} from 'angular2/core';
import {MyApp} from './app/my-app.component';
import {UserLink} from '../../common/lib/user-link';

enableProdMode();
bootstrap(MyApp, [
  provide(UserLink, {useClass: UserLink}),
]);
