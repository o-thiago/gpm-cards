# GPM Cards

Este é um projeto [Next.js](https://nextjs.org) para o sistema de cartões da GPMecatrônica.

## Ambiente de Desenvolvimento

Este projeto utiliza [Nix](https://nixos.org/) com [flakes](https://nixos.wiki/wiki/Flakes) para garantir um ambiente de desenvolvimento reproduzível. O `direnv` é usado para carregar automaticamente as variáveis de ambiente e as dependências do Nix ao entrar no diretório do projeto.

### Pré-requisitos

- [Nix](https://nixos.org/download.html) com suporte a flakes habilitado.
- [direnv](https://direnv.net/docs/installation.html)

### Começando

1.  **Permita o `direnv`:**
    Na primeira vez que você entrar no diretório do projeto, execute o seguinte comando para permitir que o `direnv` carregue o ambiente:
    ```bash
    direnv allow
    ```

2.  **Inicie os serviços de desenvolvimento:**
    O ambiente de desenvolvimento é gerenciado pelo `services-flake` e `process-compose`. Para iniciar o servidor de desenvolvimento do Next.js e o banco de dados PostgreSQL, execute:
    ```bash
    nix run .#development
    ```
    Isso fará o seguinte:
    - Iniciará um container PostgreSQL na porta `5433`.
    - Instalará as dependências `npm`.
    - Iniciará o servidor de desenvolvimento do Next.js em [http://localhost:3000](http://localhost:3000).

A página será atualizada automaticamente conforme você edita os arquivos.

## Banco de Dados e Migrações

O projeto utiliza [Kysely](https://kysely.dev/) como query builder e para o gerenciamento de migrações do banco de dados.

### Configuração

A configuração do Kysely está no arquivo `.config/kysely.config.ts`. Ele utiliza a variável de ambiente `DATABASE_URL` para se conectar ao banco de dados. O `direnv` já configura essa variável para apontar para o banco de dados de desenvolvimento.

### Executando Migrações

Para aplicar as migrações mais recentes ao seu banco de dados, execute:

```bash
npx kysely-ctl migrate:latest
```

### Criando uma Nova Migração

Para criar um novo arquivo de migração, utilize o seguinte comando, substituindo `<nome_da_migracao>` por um nome descritivo:

```bash
npx kysely-ctl migrate make <nome_da_migracao>
```

Isso criará um novo arquivo em `src/migrations` com um timestamp. Edite este arquivo para definir a lógica da sua migração nos métodos `up` e `down`.
