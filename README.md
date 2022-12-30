###### <p align="center">[Projetos e Construção de Sistemas 2022.2](https://github.com/Projeto-e-Construcao-de-Sistemas-2022-2)</p>

<img src="./logo-light.png#gh-light-mode-only" alt="logo" style="width:100%">
<img src="./logo-dark.png#gh-dark-mode-only" alt="logo" style="width:100%">

###  [Repositório Backend 🖥️](https://github.com/Projeto-e-Construcao-de-Sistemas-2022-2/Grupo3-Ticket.io-Server) | [Repositório Frontend 💻](https://github.com/Projeto-e-Construcao-de-Sistemas-2022-2/Grupo3-Ticket.io-Client)

## 👥 Grupo 3 
Clara Thais, Arlindo Soares, Renan Lima, Yuri Campos, Mariana Duarte

## ✏️ Protótipo do projeto
[https://balsamiq.cloud/sm9h52j/pbcq60x/r6B5C](https://balsamiq.cloud/sm9h52j/pbcq60x/r6B5C)

## 🌎 Implementação do projeto
[https://ticket-io-front-git-dev-jrmsrs.vercel.app](https://ticket-io-front-git-dev-jrmsrs.vercel.app)

## ❓ Guia

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

## 🖥️ Requisições

### Usuários
- Obter usuários:  
(get) `/user`
- Obter usuário por ID:  
(get) `/user/UUID`
- Obter usuário por e-mail:  
(get) `/user?email=EMAIL`
- Cadastrar usuário  
(post) `/user`
- Alterar usuário  
(patch) `/user/UUID`
- Remover usuário  
(delete) `/user/UUID`

### Grupos solucionadores
- Obter grupos solucionadores  
(get) `/group`
- Obter grupo solucionador  
(get) `/group/UUID`
- Obter membros de um grupo solucionador  
(get) `/group/UUID?members=true`
- Cadastrar grupo solucionador  
(post) `/group`
- Alterar grupo solucionador  
(patch) `/group/UUID`
- Remover grupo solucionador  
(delete) `/group/UUID`

### Tickets de Problema
- Obter TPs  
(get) `/issue`
- Obter TP  
(get) `/issue/UUID`
- Cadastrar TP  
(post) `/issue`
- Alterar TP  
(patch) `/issue/UUID`
- Remover TP  
(delete) `/issue/UUID`

### Outras APIs
- Lerolero (fork)  
(get) `/lero`
