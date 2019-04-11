import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginPageModule } from './login/login.module';
import { LoginPage } from './login/login';
import { ProjectSelectorPageModule } from './project-selector/project-selector.module';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPage},
  { path: 'project-selector', loadChildren: './project-selector/project-selector.module#ProjectSelectorPageModule' },
];

@NgModule({
  imports: [
    // TODO populate routes for other components
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    ProjectSelectorPageModule,
    LoginPageModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
