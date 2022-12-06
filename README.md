# Ticket.io Server

<img src="logo-light.png#gh-light-mode-only" alt="logo" style="width:100%">
<img src="logo-dark.png#gh-dark-mode-only" alt="logo" style="width:100%">

Api ainda no início, ~~nenhuma segurança~~ e banco de dados incompleto

## Grupo 3
Clara Thais, Arlindo Soares, Renan Lima, Yuri Campos, Mariana Duarte

## Repositório client side
[https://github.com/Projeto-e-Construcao-de-Sistemas-2022-2/Grupo3-Ticket.io-Client](https://github.com/Projeto-e-Construcao-de-Sistemas-2022-2/Grupo3-Ticket.io-Client)

## Protótipo do projeto
[https://balsamiq.cloud/sm9h52j/pbcq60x/r6B5C](https://balsamiq.cloud/sm9h52j/pbcq60x/r6B5C)

## Implementação do projeto
[https://ticket-io-front-git-dev-jrmsrs.vercel.app](https://ticket-io-front-git-dev-jrmsrs.vercel.app)

## Guia

### Pré-requisito
- [Node.js](https://nodejs.org/pt-br/) instalado na máquina
- MySQL/MariaDB ([scripts](./scripts.sql))

### Instalação
Na pasta do projeto, execute o comando:

`npm install`

O Node.js instalará todas as dependências e frameworks listados em package.json.  

Crie um arquivo '.env'  
`cat .env`

Coloque as variáveis de ambiente locais nesse arquivo seguindo o template:

```
MYSQL_HOST=
MYSQL_PORT=
MYSQL_DATABASE=
MYSQL_USER=
MYSQL_PASSWORD=
```

O projeto estará pronto para ser compilado.

### Rodar o projeto

Na pasta do projeto, execute o comando:

`npm start`

O servidor rodará em [http://localhost:5000/](http://localhost:5000)X. Irá recarregar e se reconectar com o banco sempre que houver mudança em algum arquivo.

## Requisições

### Usuários

- Obter usuários:  
(get) `localhost:5000/user`
- Obter usuário por ID:  
(get) `localhost:5000/user/UUID`
- Obter usuário por e-mail:  
(get) `localhost:5000/user?email=EMAIL`
- Cadastrar usuário  
(post) `localhost:5000/user`
- Alterar usuário  
(patch) `localhost:5000/user/UUID`
- Remover usuário  
(remove) `localhost:5000/user/UUID`

### Grupos solucionadores

- Obter grupos solucionadores  
(get) `localhost:5000/group`
- Obter grupo solucionador  
(get) `localhost:5000/group/UUID`
- Obter membros de um grupo solucionador  
(get) `localhost:5000/group/UUID?members=true`
- Cadastrar grupo solucionador  
(post) `localhost:5000/group`
- Alterar grupo solucionador  
(patch) `localhost:5000/group/UUID`
- Remover grupo solucionador  
(remove) `localhost:5000/group/UUID`