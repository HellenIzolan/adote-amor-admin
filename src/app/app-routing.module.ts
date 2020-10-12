import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: './auth/auth.module#AuthModule'
  },
  {
    path: 'admin',
    loadChildren: './admin//admin.module#AdminModule',
    canLoad: [AuthGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./principal/pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'politica-de-privacidade',
    loadChildren: () => import('./principal/pages/politica-de-privacidade/politica-de-privacidade.module').then( m => m.PoliticaDePrivacidadePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
