https://efficient-sloth-d85.notion.site/Desafio-02-be7cdb37aaf74ba898bc6336427fa410

### Regras da aplicação

- Deve ser possível criar um usuário
- Deve ser possível identificar o usuário entre as requisições
- Deve ser possível registrar uma refeição feita, com as seguintes informações:
  _As refeições devem ser relacionadas a um usuário._
  - Nome
  - Descrição
  - Data e Hora
  - Está dentro ou não da dieta
- Deve ser possível editar uma refeição, podendo alterar todos os dados acima
- Deve ser possível apagar uma refeição
- Deve ser possível listar todas as refeições de um usuário
- Deve ser possível visualizar uma única refeição
- Deve ser possível recuperar as métricas de um usuário
  - Quantidade total de refeições registradas
  - Quantidade total de refeições dentro da dieta
  - Quantidade total de refeições fora da dieta
  - Melhor sequência por dia de refeições dentro da dieta
- O usuário só pode visualizar, editar e apagar as refeições o qual ele criou

## Como rodar?

```bash
$ git clone https://github.com/azevedorafael/daily-diet-api

$ cd daily-diet-api

$ npm install

$ npm run knex -- migrate:latest

$ npm run dev

# The server will start at port:3333
```

## Como testar?

```bash
$ npm test
```
