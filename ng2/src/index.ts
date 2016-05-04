import 'es6-shim';
import 'reflect-metadata';
import 'zone.js/dist/zone';
import 'rxjs';

import {bootstrap} from '@angular/platform-browser-dynamic';
import {provide, enableProdMode} from '@angular/core';
import {MyApp} from './app/my-app.component';
import {UserLink} from '../../common/lib/user-link';

enableProdMode();
bootstrap(MyApp, [
  provide(UserLink, {useClass: UserLink}),
]);
