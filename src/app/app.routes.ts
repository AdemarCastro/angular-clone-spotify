import { Routes } from "@angular/router";
import { AtenticadoGuard } from "./guards/atenticado.guard";

export const AppRotas: Routes = [ // Array
    {
        path: '',
        redirectTo: 'player',
        pathMatch: 'full' // Assim sempre vou ser redirecionado para tela de login inicialmente
    },
    {
        path: 'player',
        loadChildren: () => import('./pages/player/player.module').then(m => m.PlayerModule),
        canLoad: [AtenticadoGuard]
    },
    { // Objeto
        path: 'login',
        //component: Ao seu programa executar pela primeira vez o programa irá fazer o download de todo o componente de login e tudo que for necessário para executá-lo. O motivo disto não ser recomendado é que, ao usá-lo de forma indevida, pode causar atraso no carregamento do site para o usuário.
        loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) // O uso do loadChildren nos permite utilizar a técnica de Lazy Loading, que é uma técnica usada em aplicações Angular para melhorar o desempenho e a eficiência do carregamento de páginas. Em vez de carregar todos os módulos e componentes de uma só vez, o lazy loading nos permite carregar apenas o necessário para a página atual. Dessa forma, o carregamento das páginas será por demanda, o que irá tornar a aplicação mais leve e dinâmica.
    }
];