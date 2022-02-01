import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    //canActivateChild: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: './pages/dashboard/dashboard.module#DashboardPageModule',
        canLoad: [AuthGuard]
      },
      {
        path: 'dados/create',
        loadChildren: './pages/dados-save/dados-save.module#DadosSavePageModule',
        canLoad: [AuthGuard]
      },
      {
        path: 'dados/edit/:id',
        loadChildren: './pages/dados-save/dados-save.module#DadosSavePageModule',
        canLoad: [AuthGuard]
      },
      {
        path: 'dados',
        loadChildren: './pages/dados/dados.module#DadosPageModule',
        canLoad: [AuthGuard]
      },
      {
        path: 'contas/create',
        loadChildren: './pages/contas-save/contas-save.module#ContasSavePageModule',
        canLoad: [AuthGuard]
      },
      {
        path: 'contas/edit/:id',
        loadChildren: './pages/contas-save/contas-save.module#ContasSavePageModule',
        canLoad: [AuthGuard]
      },
      {
        path: 'contas',
        loadChildren: './pages/contas/contas.module#ContasPageModule',
        canLoad: [AuthGuard]
      },
      {
        path: 'telefones/create',
        loadChildren: './pages/telefones-save/telefones-save.module#TelefonesSavePageModule',
        canLoad: [AuthGuard]
      },
      {
        path: 'telefones/edit/:id',
        loadChildren: './pages/telefones-save/telefones-save.module#TelefonesSavePageModule',
        canLoad: [AuthGuard]
      },
      {
        path: 'telefones',
        loadChildren: './pages/telefones/telefones.module#TelefonesPageModule',
        canLoad: [AuthGuard]
      },
      {
        path: 'conteudos/create',
        loadChildren: './pages/conteudos-save/conteudos-save.module#ConteudosSavePageModule',
        canLoad: [AuthGuard]
      },
      {
        path: 'conteudos/edit/:id',
        loadChildren: './pages/conteudos-save/conteudos-save.module#ConteudosSavePageModule',
        canLoad: [AuthGuard]
      },
      {
        path: 'conteudos',
        loadChildren: './pages/conteudos/conteudos.module#ConteudosPageModule',
        canLoad: [AuthGuard]
      },
      {
        path: 'marketing/create',
        loadChildren: './pages/marketing-save/marketing-save.module#MarketingSavePageModule',
        canLoad: [AuthGuard]
      },
      {
        path: 'marketing/edit/:id',
        loadChildren: './pages/marketing-save/marketing-save.module#MarketingSavePageModule',
        canLoad: [AuthGuard]
      },
      {
        path: 'marketing',
        loadChildren: './pages/marketing/marketing.module#MarketingPageModule',
        canLoad: [AuthGuard]
      },
      {
        path: 'adocoes/create',
        loadChildren: './pages/adocoes-save/adocoes-save.module#AdocoesSavePageModule',
        canLoad: [AuthGuard]
      },
      {
        path: 'adocoes/edit/:id',
        loadChildren: './pages/adocoes-save/adocoes-save.module#AdocoesSavePageModule',
        canLoad: [AuthGuard]
      },
      {
        path: 'adocoes',
        loadChildren: './pages/adocoes/adocoes.module#AdocoesPageModule',
        canLoad: [AuthGuard]
      },
      {
        path: '',
        redirectTo: '/admin/dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
