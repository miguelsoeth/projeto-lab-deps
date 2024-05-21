import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { AccountComponent } from './pages/account/account.component';
import { authGuard } from './guards/auth.guard';
import { ClientsComponent } from './pages/clients/clients.component';
import { HistoryComponent } from './pages/history/history.component';
import { roleGuard } from './guards/role.guard';
import { EditComponent } from './pages/edit/edit.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'registrar',
        component: RegisterComponent,
    },
    {
        path: 'conta',
        component: AccountComponent,
        canActivate: [authGuard],
    },
    {
        path: 'clientes',
        component: ClientsComponent,
        canActivate:[roleGuard],
        data: {
            roles:['Admin'],
        }
    },
    {
        path: 'historico',
        component: HistoryComponent,
        canActivate:[authGuard],
        data: {
            roles:['Admin'],
        }
    },
    {
        path: 'clientes/editar/:id',
        component: EditComponent,
        canActivate:[roleGuard],
        data: {
            roles:['Admin'],
        }
    }
];
