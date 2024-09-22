# Cassini File Sharing API

Este projeto é um backend de compartilhamento de arquivos com controle de limite de downloads, expiração de URLs pré-assinadas e criptografia de arquivos. Ele utiliza a Cloudflare R2 para armazenamento de arquivos, Prisma ORM para gerenciamento de banco de dados e Fastify para a criação da API.

## Funcionalidades

- **Upload de Arquivos**: Os usuários podem fazer upload de arquivos para o bucket da Cloudflare R2, com um limite de tamanho e tipos de arquivos permitidos.
- **URLs Pré-assinadas**: As URLs de upload e download são pré-assinadas, garantindo que apenas os usuários com a URL válida possam acessar o arquivo.
- **Expiração de Arquivos**: Os arquivos no bucket expiram após 7 dias, sendo removidos automaticamente.
- **Limite de Downloads**: O número de downloads por arquivo é limitado, e após atingir esse limite, o arquivo não pode mais ser baixado.
- **Logs de Acesso**: Cada tentativa de download é registrada com informações sobre o IP do solicitante, data de acesso, status (sucesso, erro ou limite de downloads excedido), e opcionalmente, o `user-agent`.
- **Segurança com Criptografia**: A criptografia simétrica do lado do cliente é aplicada para garantir que os arquivos sejam enviados de forma segura.

## Tecnologias Utilizadas

- **Node.js**: Plataforma de execução do JavaScript.
- **Fastify**: Framework web para criação de APIs rápidas e eficientes.
- **Cloudflare R2**: Serviço de armazenamento de arquivos.
- **Prisma ORM**: Gerenciamento de banco de dados com PostgreSQL.
- **Zod**: Validação de esquemas de dados para garantir segurança e integridade.

## Instalação

### Pré-requisitos

- Node.js (>= 16.x)
- PostgreSQL (ou outro banco de dados suportado pelo Prisma)
- Conta Cloudflare com acesso ao R2

### Passos para Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/cassini-file-sharing.git
   cd cassini-file-sharing
   ```

2. Instale as dependências:
   ```bash
   pnpm install
   ```

3. Configure as variáveis de ambiente no arquivo `.env`:
   ```bash
   DATABASE_URL="postgresql://username:password@localhost:5432/cassini"
   R2_ACCESS_KEY_ID="sua-access-key-id"
   R2_SECRET_ACCESS_KEY="sua-secret-access-key"
   R2_BUCKET_NAME="cassini-dev"
   ```

4. Execute as migrações do banco de dados com Prisma:
   ```bash
    pnpm prisma migrate dev
   ```

5. Inicie o servidor::
   ```bash
   pnpm run dev
   ```


## Documentação da API

### **Upload de Arquivos**

`POST /uploads`

**Descrição**: Faz o upload de um arquivo para o bucket da Cloudflare R2.

**Corpo da Requisição**:
```json
{
  "name": "nome-do-arquivo.ext",
  "contentType": "tipo/mime",
  "size": 1048576
}
```

**Resposta**:
```json
	{
  "id": "file-id",
  "signedUrl": "https://url-pre-assinada.com"
}
```

### **Download de Arquivos**

`GET /uploads/:id`

**Descrição**: Faz o download de um arquivo utilizando uma URL pré-assinada.

**Resposta**: Redireciona para a URL pré-assinada.

**Erros**: 
  - **403**: Limite de downloads excedido.
  - **404**: Arquivo não encontrado.

### **Logs de Acesso**

`POST /uploads/:id/logs`

**Descrição**: Obtém os logs de acessos a um arquivo específico.

**Resposta**:
```json
[
  {
    "id": "log-id",
    "fileId": "file-id",
    "ipAddress": "192.168.0.1",
    "accessedAt": "2023-09-22T15:20:00.000Z",
    "status": "Success",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
  }
]
```

### **Desenvolvimento**

#### **Estrutura de pastas**

- `/src`: Código-fonte do backend.
- `/prisma`: Arquivos de migração e esquema do banco de dados.

#### **Scripts disponíveis**

- `pnpm run dev`: Inicia o servidor de desenvolvimento
- `pnpm run build`: Compila o código para produção
- `pnpm prisma migrate dev`: Executa migrações do banco de dados

### **Licença**

Este projeto está licenciado sob a licença MIT.