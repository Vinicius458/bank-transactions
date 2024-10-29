# Transaction API

Esta API permite a criação, consulta e processamento de transações financeiras, como transferências, depósitos e saques. A API utiliza RabbitMQ para filas e controle de concorrência, além de otimização de consistência de dados.


2. **Instale as dependências:**
   ```bash
   npm install

3. **Configuração do arquivo .env:**
   ```bash
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=seu_usuario
   DB_PASSWORD=sua_senha
## Índice
1. [Instalação e Configuração](#instalação-e-configuração)
2. [Endpoints da API](#endpoints-da-api)
3. [Estrutura de Dados](#estrutura-de-dados)
4. [Exemplos de Requisição](#exemplos-de-requisição)
5. [Filas e Processamento Assíncrono](#filas-e-processamento-assíncrono)
6. [Testes](#testes)

## Instalação e Configuração

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd seu-repositorio
   DB_NAME=bank
   RABBITMQ_HOST=localhost
   RABBITMQ_PORT=5672
