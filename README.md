# gamelog-API-Prisma

Este pequeno projeto conta com uma simples API para que possamos manter um controle dos minutos jogados em cada jogo, podendo ser adicionado em cada jogo sua respectiva categoria e plataforma em que foi jogado. </br>
Foi usada a linguagem TypeScript e a ORM Prisma.

# Setup:

Primeiramente, devemos clonar o repositório na pasta desejada.

Após feito isso, deve-se dar o comando `npm i` para instalar todas as dependências necessárias para a API.

É necessário, então, que seja criada a database que o projeto irá usar. Para isso, deve-se criar uma databse com o nome que desejar (recomenda-se gamelog).

Deve-se criar um arquivo .env na raiz do projeto e copiar o que está em .env.example, trocando os campos `YourUserName`, `YourPassword`, `YourHostName` e `YourDatabaseName` pelos seus respectivos valores corretos.

Por esse projeto usar prisma, é necessário que o usuário inicie a ORM através do comando `npx prisma init` e siga as instruções ali contidas.

Na pasta raiz do projeto executar o seguinte comando: `npm run prisma:migrate:dev`. Através deste comando, as tabelas devem ser criadas automaticamente.

Para popular as tabelas (se assim desejado), pode-se usar o comando `npm run prisma:seed`.

Concluído esses passos, o projeto está pronto para rodar com `npm run dev`.

# Testes:

Assumindo que os passos anteriores foram seguidos, deve-se criar uma outra database que servirá apenas para testes. Recomenda-se o uso do nome gamelog_tests.

Após criar essa nova database, precisamos criar um novo .env chamado .env.test, o qual usará a mesma estrutura do outro .env, trocando o campo `YourDatabaseName` pelo nome da database criada no passo anterior.

Com isso, podemos executar o comando `npm run prisma:migrate:test` para que sejam criadas tabelas iguais as da database de development.

Concluído esses passos, o projeto está pronto para ser testado através do comando `npm run test`.

# Métricas:

Caso deseje-se checar as métricas dos testes criados nesse projeto, pode-se rodar o comando `npm run test:coverage`.

Esse comando irá gerar uma pasta `coverage`, dentro da qual deve-se acessar a pasta `lcov-report` e rodar o arquivo `index.html` (recomenda-se usar a extensão para o VSCode chamada Live Server). Ao abrir o site relacionado a esse arquivo, poderá verificar-se todas as métricas dos testes desse projeto.

# Rotas:

POST: /genres </br>
Body: </br>![image](https://user-images.githubusercontent.com/110701545/215526724-de50e87f-c2f3-4b06-aada-84e6c5445a1d.png)


GET: /genres </br>
Response: </br>![image](https://user-images.githubusercontent.com/110701545/215527628-09f86d15-9b0a-4d0e-ba32-755a53646fd9.png)

POST: /platforms </br>
Body: </br>![image](https://user-images.githubusercontent.com/110701545/215529786-43210ae2-f484-4458-80a1-a3a4596e0905.png)

GET: /platforms </br>
Response: </br>![image](https://user-images.githubusercontent.com/110701545/215529895-5b90763c-f519-4b49-a7a6-88f5f26bf5ff.png)

POST: /games </br>
Body: </br>![image](https://user-images.githubusercontent.com/110701545/215527962-ce3eb287-9fdf-49f6-a635-90dd1f0b2457.png)</br>
OBS: playtime nesse caso se dá em minutos

GET: /games </br>
Response: </br>![image](https://user-images.githubusercontent.com/110701545/215528554-c04a7f30-4a9e-4aa0-9d39-dc978a3db1db.png)

GET: /genres?genre=corrida </br>
Response: </br>![image](https://user-images.githubusercontent.com/110701545/215528720-ade07efe-8aa5-408a-a502-3227daebdac3.png)</br>
OBS: funciona para qualquer gênero, o "corrida" foi apenas um exemplo. Não necessita capslock no começo.

GET: /genres?platform=epic </br>
Response: </br>![image](https://user-images.githubusercontent.com/110701545/215528993-fb90d280-36f1-4c2c-9b1c-e4b2868b804f.png)</br>
OBS: funciona para qualquer plataforma, o "epic" foi apenas um exemplo. Não necessita capslock no começo.

PATCH: /games/:id </br>
Body: </br>![image](https://user-images.githubusercontent.com/110701545/215529388-37bb1597-ea7f-43c3-a620-f34d8d8d8e6f.png)

DELETE: /games/:id </br>

GET: /games/playtime-avg </br>
Response: "Your average playtime is: 13245.43 minutes"
