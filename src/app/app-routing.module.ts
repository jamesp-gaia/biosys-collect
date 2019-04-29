import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// const routes: Routes = [
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: 'login', component: LoginPage},
  // { path: 'project-selector', component: ProjectSelectorPage},
  // TODO populate routes for other components
// ];
const routes: Routes = [
  { path: '', redirectTo: 'form', pathMatch: 'full' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule'},
  { path: 'project-selector', loadChildren: './project-selector/project-selector.module#ProjectSelectorPageModule'},
  { path: 'form', loadChildren: './form/form.module#FormModule'},
  // TODO populate routes for other components
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    // LoginPageModule,
    // ProjectSelectorPageModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
