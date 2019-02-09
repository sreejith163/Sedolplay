import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterPageComponent } from './register/register.component';
import { ErrorComponent } from './error/error.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

export const SessionRoute: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterPageComponent
      },
      {
        path: 'forgotpass',
        component: ForgotPasswordComponent
      },
      {
        path: 'error/:type',
        component: ErrorComponent
      },
      {
        path: 'lock',
        component: LockscreenComponent
      }
    ]
  }
];
