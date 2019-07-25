# NGX Wiz SSO

Modulo feito para [Angular 4+](https://angular.io/) que têm por objetivo facilitar o processo de autenticação e renovação de token no SSO da Wiz.

## Dependências

* [Angular 4+](https://angular.io/)
* [Vanilla Wiz SSO](https://github.com/wizsolucoes/vanilla-wiz-sso)

## Recursos do módulo

* Renovação automática(configurável) e silenciosa do token do usuário.
* Injeção de Token automática nas requisições http, [mapeadas](#configuracao-do-modulo) na configuração.
* Classe [Service Angular](https://angular.io/tutorial/toh-pt4) pronta para efetuar fluxos de login, renovação de token logout e etc.
* Inicialização silênciosa do usuário com status já logado e com renovação dinâmica de Token, antes mesmo de qualquer código do programador executar.
* Classe Guard que implementa a interface [CanActivete](https://angular.io/api/router/CanActivate) pronta para o sistema de [rotas do Angular](https://angular.io/guide/router).

## Instalação do módulo

Para utilizar o módulo e seus recursos basta executar o seguinte comando na raiz do seu projeto Angular.

```bash
npm install @wizsolucoes/ngx-wiz-sso --save
```

## Configuração do módulo

Antes de utilizar os recursos deste módulo é necessário realizar sua configuração no arquivo **app.module.ts** na pasta **app** do seu projeto.

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxWizSSOModule } from '@wizsolucoes/ngx-wiz-sso';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxWizSSOModule.forRoot({
      apiPath: "<<urldo servico>>",
      clientID: "<<Cliente ID>>",
      clientSecret: "<<Cliente Secret>>",
      grantType: "<<Grant Type>>",
      authedPaths: ["<<dns a ser autenticado>>"],
      scope: "<<scope do projeto>>",
      options: { //parâmetro opcional
        ssoTimeOut: 60000, //parâmetro opcional, determina o timeout para o SSO
        tokenAutoRefresh: true //parâmetro opcional, determina se o token deve ser renovado
      },
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

* **authedPaths**, um array que deve conter as rotas que terão tokens injetados nas requisições utilizando o [httpclient do Angular](https://angular.io/guide/http). Exemplo *http://www.wizsolucoes.com.br* sem o final do endpoint exemplo 

> Para entender melhor as demais configurações consulte a documentação do projeto [Vanilla Wiz SSO](https://github.com/wizsolucoes/vanilla-wiz-sso)

## Utilização do projeto:

A seguir os recursos abertos que podem ser utilizados com exemplos de como o módulo funciona.

### *Class SSOConectorService*

Classe preparada para o processo de login, logout, renovação de token e etc. Veja os métodos a seguir:

* **public static isLogged(): Token**<br>
Este método verifica de modo sincrono se existe um usuário logado no momento, caso sim ele retorna um [Objeto Token](#objeto-token).

* **public static logOut(): logOut**<br>
Método que finaliza o a sessão logada, a injeções de token e o processo de verificação inicial de login bem como a renovação silênciosa do Token.

* **public loginWithCredentials(_credentials: { email: string, password: string }): Observable<Token>** <br>
Loga o usuário no servidor, baseado nas configurações do módulo e devolve um O[Observable](https://angular.io/guide/observables) que contêm como retorno de sucesso um [Objeto Token](#objeto-token). Para executar este método é necessário fornecer um objeto dinâmico **_credentials** que consiste de um objeto js com os atributos email e password, ambos strings.

* **public refreshToken(): Observable<Token>**<br>
Executa a renovação do token que já está em memória, e devolve um [Observable](https://angular.io/guide/observables) com retorno do [Objeto Token](#objeto-token) caso haja sucesso.<br><br>
**Atenção:** *Este método faz parte do core do módulo e somente deve ser chamado se os [recursos de autorenovação](#configuracao-do-modulo) estiverem desativados.*

* **public checkLogged(): Observable<Token>** <br>
Cria um fluxo assincrono baseado em [Observable](https://angular.io/guide/observables) que verifica se existe token salvo no localstorage, renova o token se preciso, e devolve um [Objeto Token](#objeto-token) no caso de sucesso.<br><br>
**Atenção:** *Este método faz parte do core do módulo e somente deve ser chamado se os [recursos de autorenovação](#configuracao-do-modulo) estiverem desativados.*

* **public onRefreshTokenFail: EventEmitter<void>**<br>
Propriedade que permite saber quando o processo de renovação de token deu erro e o usuário não está mais com sessão válida. Deve ser utilizado assinado um [Observable](https://angular.io/guide/observables).

#### Exemplo de uso da classe *SSOConectorService*:

```ts
import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { SSOConectorService } from '@wizsolucoes/ngx-wiz-sso';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
    constructor(private sso: SSOConectorService, private http: HttpClient) {}

    ngOnInit () {   

    this.sso.onRefreshTokenFail.subscribe(
        _ => {
        // Usuário deslogado por erro de renovação no token, enviar para a tela de login ou algo assim.
        }
    );

    if (!SSOConectorService.isLogged()) {
      //Usuário deslogado, efetuar login atrávez de form, chamando o seguinte método
      this.sso.loginWithCredentials({ email: 'user@user.com', password: '123456'});
    } else {

      // usuário já logado, ir para a tela de entrada

      // Ao chamar serviço cujo dns (https://meugateway/) esteja na configuraçõe de rotas logadas, o Header Authorization com o devido token será injetado nessa requisição, não importando o método utilizado ou o path que viar após o dns principal.
      this.http.get('https://meugateway/api/servico/1578')
        .subscribe(
          data => console.log(data),
          error => console.error(error)
        );
    }
   
  }
}

```

> Importante: Nenhuma chamada via objeto HttpClient, cujo o dns não esteja listado na configuração do módulo será modificada como no exemplo.

#### Objeto Token

```ts
export interface Token {
    tokenType: string; // Tipo do token retornado pelo sso.
    hash: string; // Hash com a codificação do servidor.
    expiresIn: string; // Tempo de vida do token em segundos.
    refreshToken: string; // Token de renovação.
}
```

### *class AuthGuard implements CanActivate*

Um Guard é um recurso que consta do sistema de [rotas do Angular](https://angular.io/guide/router) e que permite restringir ou habilitar acesso a determina rota, veja o exemplo a seguir:

```ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

import { AuthGuard } from from '@wizsolucoes/ngx-wiz-sso';

const routes: Routes = [
  {
    path: 'gestao-360',    
    component: HomeComponent,
    canActivate: [AuthGuard]    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Gestao360RoutingModule { }

```

No exemplo acima somente será possível acessar a rota *http://meu-site.com.br/gestao-360* se o usuário estiver logado no SSO.