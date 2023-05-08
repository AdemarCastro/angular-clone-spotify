import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { RouterModule } from '@angular/router';
import { LoginRotas } from './login.routes';

@NgModule({
  declarations: [
    LoginComponent, // Todo componente no Angular precisa estar vinculado a algum Modulo
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(LoginRotas)
  ]
})
export class LoginModule { }

/* 
Todo componente no Angular tem:
>login.component.html: Estrutura HTML do site que eu vejo na página
>login.component.scss: Estrutura CSS em que estilizo o design da página. Toda classe, variável que criar para esse componente será utilizado apenas neste componente. O Angular é totalmente scopado.
>login.component.spec.ts: Ligada a testes, mas não irei utilizar
>login.component.ts: Parte principal do componente, onde fica o arquivo TypeScript com toda a lógica do componente.
*/
