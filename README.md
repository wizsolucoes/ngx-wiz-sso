# NGX Wiz SSO

Modulo [Angular](https://angular.io/) feito para facilitar processo de autenticação e renovação de token no SSO da Wiz.

Compatível com as [versões suportadas do Anuglar](https://angular.io/guide/releases#support-policy-and-schedule) (^8.0.0, ^9.0.0 e ^10.0.0) e otimizado para a versões ^10.0.0.

## Dependências

* [Angular](https://angular.io/)
* [Vanilla Wiz SSO](https://github.com/wizsolucoes/vanilla-wiz-sso)

## Recursos do módulo

* Renovação automática(configurável) e silenciosa do token do usuário.
* Injeção de Token automática nas requisições http, [mapeadas](#configuração-do-módulo) na configuração.
* Classe [Service Angular](https://angular.io/tutorial/toh-pt4) pronta para efetuar fluxos de login, renovação de token logout e etc.
* Inicialização silênciosa do usuário com status já logado e com renovação dinâmica de Token, antes mesmo de qualquer código do programador executar.
* Classe Guard que implementa a interface [CanActivete](https://angular.io/api/router/CanActivate) pronta para o sistema de [rotas do Angular](https://angular.io/guide/router).

## Instalação do módulo

Para instalar o módulo e seus recursos basta executar o seguinte comando na raiz do seu projeto Angular.

```bash
npm install @wizsolucoes/ngx-wiz-sso --save
```

## Configuração do módulo

Antes de utilizar os recursos deste módulo será necessário realizar a seguinte configuração no arquivo **app.module.ts** do seu projeto.

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
      apiSubscription: "<<chave da assinatura da api>>" //parâmetro opcional
      options: { //parâmetro opcional
        ssoTimeOut: 60000, //parâmetro opcional, determina o timeout para o SSO
        tokenAutoRefresh: true, //parâmetro opcional, determina se o token deve ser renovado
        loginRoute: 'login' //url que aponta para onde redirecionar no caso de não haver token
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

> Um boa dica é utilizar os [enviroments do Angular](https://medium.com/beautiful-angular/angular-2-and-environment-variables-59c57ba643be) para ter essas configurações baseadas no modo de publicação.

## Utilização do projeto:

A seguir os recursos abertos que podem ser utilizados neste módulo:

### *Class SSOConectorService*

Classe preparada para o processo de login, logout, renovação de token e etc. Veja os métodos a seguir:

* **public static isLogged(): Token**<br>
Este método verifica de modo sincrono se existe um usuário logado no momento, caso sim ele retorna um [Objeto Token](#objeto-token).

* **public static logOut(): void**<br>
Método que finaliza o a sessão logada, a injeções de token e o processo de verificação inicial de login bem como a renovação silênciosa do Token.

* **public loginWithCredentials(_credentials: { userName: string, password: string }): Observable<Token>** <br>
Loga o usuário no servidor, baseado nas configurações do módulo e devolve um [Observable](https://angular.io/guide/observables) que contêm como retorno de sucesso um [Objeto Token](#objeto-token). Para executar este método é necessário fornecer um objeto dinâmico **_credentials** que consiste de um objeto js com os atributos userName e password, ambos strings.

* **public refreshToken(): Observable<Token>** ¹<br>
Executa a renovação do token que já está em memória, e devolve um [Observable](https://angular.io/guide/observables) com retorno do [Objeto Token](#objeto-token) caso haja sucesso.<br><br>

* **public checkLogged(): Observable<Token>** ¹<br>
Cria um fluxo assincrono baseado em [Observable](https://angular.io/guide/observables) que verifica se existe token salvo no localstorage, renova o token se preciso, e devolve um [Objeto Token](#objeto-token) no caso de sucesso.<br><br>

* **public static readonly onRefreshTokenFail: EventEmitter<void>;**<br>
Propriedade estática que permite saber quando o processo de renovação de token deu erro e o usuário não está mais com sessão válida. Deve ser utilizado assinado um [Observable](https://angular.io/guide/observables).

> 1 - **Atenção:** *Estes métodos fazem parte do core do módulo e somente deve ser chamado se os [recursos de autorenovação](#configuração-do-módulo) estiverem desativados.*

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

    SSOConectorService.onRefreshTokenFail.subscribe(
        _ => {
        // Usuário deslogado por erro de renovação no token, enviar para a tela de login ou algo assim.
        }
    );

    if (!SSOConectorService.isLogged()) {
      //Usuário deslogado, efetuar login atrávez de form, chamando o seguinte método
      this.sso.loginWithCredentials({ userName: 'user@user.com', password: '123456'});
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

> Importante: Nenhuma chamada via objeto HttpClient, cuja à rota base não esteja listado na configuração do módulo, será modificada como no exemplo.

#### Objeto Token

```ts
export interface Token {
    tokenType: string; // Tipo do token retornado pelo sso.
    hash: string; // Hash com a codificação do servidor.
    expiresIn: string; // Tempo de vida do token em segundos.
    refreshToken: string; // Token de renovação.
}
```

#### class AuthGuard implements CanActivate

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
