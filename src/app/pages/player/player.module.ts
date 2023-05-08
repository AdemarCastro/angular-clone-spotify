import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from './player.component';
import { RouterModule } from '@angular/router';
import { PlayerRotas } from './player.routes';

@NgModule({
  declarations: [
    PlayerComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(PlayerRotas)
  ]
})
export class PlayerModule { }

// Guardian é basicamente um protetor de rotas, impedindo do acesso quando não se está autenticado

// CanLoad enquanto não resolver tudo ele não abre o modulo
