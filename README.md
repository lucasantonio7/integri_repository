# Integri

> Protal Integri

## Certificado de HTTPS

O certificados utilizam sistema da Let’s Encrypt que é um projeto colaborativo que libera certificados SSL gratuitos
porém eles tem a duração de 3 meses na qual um novo precisa ser gerado:

O link a seguir conta com o passo a passo de geração de um novo certificado para a conta do bluemix
https://github.com/ibmjstart/bluemix-letsencrypt

> ### Estrutura do arquivo domains.json:
>{
  "email": "aqui é inserido o email cujo as notificações do certificado",
  "staging": false,
  "domains": [
    {
      "domain": "integri.org",
      "hosts": [
        ".",
        "www"
      ]
    }
  ]
}

## Uso local

Este projeto utiliza a biblioteca cfenv-wrapper
https://github.com/aerwin/node-cfenv-wrapper

Dois arquivos precisam ser criados com as credenciais
estes são: 
- env.json (credenciais bluemix)
- env_custom.json (variaveis de ambiente)

## Uso no bluemix

O arquivo manifest.yml deve ser criado para que o upload seja realizado por meio de cf push
basta copiar o arquivo manifest_example.yml e substituir as credenciais 

## Build Setup

``` bash
# install dependencies
npm install

# install nodemon plugin
npm install -g nodemon

# serve with hot reload at localhost:8080
npm run dev

# server 
nodemon app.js

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
