import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// const routes: Routes = [
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: 'login', component: LoginPage},
  // { path: 'project-selector', component: ProjectSelectorPage},
  // TODO populate routes for other components
// ];
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule'},
  { path: 'project-selector', loadChildren: './project-selector/project-selector.module#ProjectSelectorPageModule'},
  // TODO populate routes for other components
  { path: 'form-selector', loadChildren: './form-selector/form-selector.module#FormSelectorPageModule' },
  { path: 'form-viewer', loadChildren: './form-viewer/form-viewer.module#FormViewerPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
