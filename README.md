# News Explorer Backend

## Descrição
O **News Explorer Backend** é uma API criada com Node.js e Express para gerenciar autenticação de usuários e manipulação de artigos. O projeto utiliza MongoDB com Mongoose para armazenamento de dados, Jest e Supertest para testes, Celebrate para validação de dados de entrada e Winston com express-winston para logs de erros e requisições.

## Tecnologias Utilizadas
- **Node.js** Ambiente de execução JavaScript no servidor.
- **Express** Framework para criação de servidores.
- **MongoDB** com **Mongoose** Banco de datos NoSQL
- **Jest** e **Supertest** Testes automatizados
- **Celebrate** Validação de dados de entrada
- **Winston** e **express-winston** Logs de erro e requisição

## Endpoints

### Endpoints Públicos (Não requerem autenticação)
- **POST /signup** - Cadastra um novo usuário
- **POST /signin** - Realiza login e retorna um token JWT

### Endpoints Protegidos (Requerem autenticação via token JWT)
#### Endpoints de Usuários
- **GET /users** - Retorna todos os usuários
- **GET /user/me** - Retorna os dados do usuário atualmente autenticado

#### Endpoints de Artigos
- **POST /articles** - Cria um novo artigo
- **GET /articles** - Retorna todos os artigos salvos pelo usuário autenticado
- **DELETE /articles/:articleId** - Deleta um artigo salvo pelo usuário autenticado

## Configuração do Ambiente
Antes de executar a API, crie um arquivo `.env` baseado no modelo `.env.example` e configure as variáveis de ambiente necessárias:

### Exemplo de `.env.example`
```env
DB_URI=mongodb://localhost:27017/example
NODE_ENV=
JWT_SECRET=
```

## Instalação e Execução Local
```sh
# Clonar o repositório
git clone https://github.com/cesar-matsubayashi/news-explorer-backend.git
cd news-explorer-backend

# Instalar dependências
npm install

# Iniciar o servidor
npm start
```

#### Para rodar em ambiente de desenvolvimento
```sh
npm run dev
```

## Testes
Para rodar os testes automatizados:
```sh
npm run test
```

## Nome Domínio
https://api.newsexplorer.serverpit.com
