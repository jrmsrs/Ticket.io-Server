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
- Conta no [ViaCEP](https://viacep.com.br/)
- (opcional*) [Conta Gmail com SMTP e senha de aplicativo ativados](https://hotter.io/docs/email-accounts/app-password-gmail/)
- (opcional*) Conta gratuita [Cron-Job.org](https://cron-job.org/en/), com um Job que realize um api request por minuto para fazer o servidor na Vercel realizar tarefas automaticas
- (opcional*) [Banco de dados Firebase RealTimeDatabase](https://firebase.google.com/) secundário pra guardar e-mails que receberão relatórios gerenciais num array (pra receber uma query automática por minuto sem que afete o banco de dados principal)  

\* apenas a rota http://localhost:5000/report não irá funcionar sem esses requisitos

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

# Credenciais SMTP para envio de e-mails de relatórios gerenciais
SMTP_USER=
SMTP_PASS=

# Credenciais Firebase RealTimeDatabase
RTDB_ENDPOINT=

# Credenciais Cron-Job.org
CRON_JOB_APIKEY=
CRON_JOB_ENDPOINT=
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

### Soluções
- Obter Soluções  
(get) `/solution`
- Obter Solução  
(get) `/solution/UUID`
- Cadastrar Solução  
(post) `/solution`
- Alterar Solução  
(patch) `/solution/UUID`
- Remover Solução  
(delete) `/solution/UUID`

### Relatórios gerenciais
- Envio para um e-mail específico ou array  
(get) `/report?email=EMAIL`  
(get) `/report?email=EMAIL1&email=EMAIL2&email=EMAIL3`  

### Outras APIs
- Lerolero (fork)  
(get) `/lero`
