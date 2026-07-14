# Bem-Estar Animal - Frontend

Este é o repositório da interface do usuário do **Sistema de Bem-Estar Animal**.

A aplicação permite que os usuários cadastrem seus pets, solicitem castrações (com base em um sistema de quotas diárias/mensais), registrem atendimentos emergenciais, coloquem animais para adoção responsável e adotem pets cadastrados. 

Para os administradores, o portal oferece um painel completo para gerenciar usuários, atualizar status de solicitações, emitir fichas de triagem em PDF e configurar quotas de castração.

---

## Índice

1. Pré-requisitos
2. Instalação
3. Configuração de Variáveis de Ambiente
4. Arquitetura do Projeto e Estrutura de Diretórios
5. Bibliotecas Principais e Ferramentas
6. Funcionalidades da Pasta `src/lib/`
7. Constantes e Validações (`src/constants/`)
8. Grupos de Rotas da Aplicação (`src/app/`)
9. Estrutura de Componentes (`src/components/`)
10. Comandos de Uso

---

## 1. Pré-requisitos

Antes de configurar o projeto localmente, é necessário ter o seguinte instalado/configurado:

* **Node.js** e **npm** instalados na sua máquina local.
* Servidor **Backend** rodando localmente (por padrão na porta `4000`) para que as integrações funcionem.

---

## 2. Instalação

Siga os passos abaixo para baixar o projeto e configurar o ambiente de desenvolvimento local.

### Passo 1: Clonar o Repositório
Abra o seu terminal e execute o comando abaixo para clonar o repositório:
```bash
git clone https://github.com/bem-estar-animal-pmar/bem-estar-animal-frontend.git

```

```bash
cd bem-estar-animal-frontend

```

### Passo 2: Instalar Dependências



Instale todos os pacotes necessários especificados no `package.json` utilizando o **npm**:

```bash
npm install

```

---

## 3. Configuração de Variáveis de Ambiente



Para se comunicar com o backend e realizar os fluxos de autenticação de forma correta, você precisa configurar as variáveis de ambiente.

Crie um arquivo chamado `.env` ou `.env.local` na raiz do diretório `bem-estar-animal-frontend/` com as seguintes configurações:

| Nome | Descrição | Exemplo / Valor Padrão |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | URL de conexão com a API do Backend | `http://localhost:4000`<br> |
| `NEXT_PUBLIC_WEBSITE_URL` | URL pública de acesso deste Frontend | `http://localhost:3000`<br> |

---

## 4. Arquitetura do Projeto e Estrutura de Diretórios


O projeto utiliza a arquitetura de **App Router** do Next.js. A base de código está modularizada para facilitar a manutenção:

```text
bem-estar-animal-frontend/
├── src/
│   ├── app/                       
│   │   ├── (admin)/               # Painel do Administrador
│   │   ├── (auth)/                # Autenticação e Onboarding
│   │   ├── (dashboard)/           # Painel do Usuário
│   │   ├── (landing-page)/        # Páginas Públicas (Landing Page)
│   │   └── (template)/            # Templates de documentos apra impressão
│   ├── components/                
│   │   ├── features/              # Componentes relacionados à regra de negócio
│   │   ├── layout/                # Estruturas de layout (Header, Sidebar, Footer)
│   │   └── ui/                    # Componentes de interface (Input, Select, Card, etc.)
│   ├── constants/                 # Constantes estáticas, tipos (Interfaces) e schemas de validação para forms (Zod)
│   └── lib/                       # Configurações do client do better auth, utilitários de tradução, função para gerar toast, formatadores de data e hora, etc.

```

---

## 5. Bibliotecas Principais e Ferramentas



* **[Next.js 16.2.9](https://nextjs.org/)**

* **[React ^19](https://react.dev/)**

* **[Tailwind CSS v4](https://tailwindcss.com/)**

* **[TypeScript](https://www.typescriptlang.org/)**

* **[Zod ^4.3.6](https://zod.dev/)**

* **[React Hook Form](https://react-hook-form.com/)**

* **[Better-Auth (Client)](https://www.better-auth.com/)**


---

## 6. Funcionalidades da Pasta `src/lib/`

Esta pasta contém integrações externas e funções auxiliares vitais da aplicação:

* **`auth-client.ts`**: Inicializa o cliente Better-Auth para Next.js, permitindo comunicação com o backend de forma dinâmica chamando funções.

* **`scheduling.ts`**: Funções auxiliares de data e hora para manipulação de fuso horário e permitir seleção de datas corretas.

* **`toast-store.ts`**: Store simplificada para exibir notificações flutuantes (toasts) na aplicação.

* **`translation-map.ts`**: Traduz erros e variáveis do backend para português.

* **`api-error.ts`**: Padronizador de tratamento de respostas de erro do backend.

* **`request-formatter.ts`**: Utilitário para formatar números de pedido de diferentes tabelas (castração, emergência, adoção, etc.)

---

## 7. Constantes e Validações (`src/constants/`)


* **`constants.ts`**: Armazena listas fixas utilizadas em selects e filtros, como espécies (`DOG`, `CAT`), portes (`SMALL`, `MEDIUM`, `LARGE`), status de moradia e raças.

* **`interfaces.ts`**: Tipagens TypeScript globais que descrevem a estrutura de entidades (`User`, `Pet`, `NeuteringAppointment`, etc.) para diferentes rotas do backend.

* **`schemas.ts`**: Contém as validações do **Zod**, garantindo que formulários de CPFs, CEPs e envio de imagens sejam validados no lado do cliente (com o react hook form) antes de chamadas à API.

---

## 8. Grupos de Rotas da Aplicação (`src/app/`)


O projeto utiliza **Route Groups** (pastas entre parênteses) para separar lógicas sem alterar a URL final:

* **`(landing-page)` (Páginas Públicas)**: Acessíveis a todos os visitantes. Inclui a Home (`/`) e a galeria de Adoção (`/adoption`) com filtros de busca.


* **`(auth)` (Autenticação)**: Fluxos de Login (`/login`), Registro (`/register`), recuperação de conta (`/forgot-password`) e aceitação obrigatória de termos (`/accept-terms`).


* **`(dashboard)` (Painel do Cidadão)**: Painel logado para gerenciamento de pets, agendamento de Castrações (`/dashboard/neuterings`), Emergências e acompanhamento de Adoções.


* **`(admin)` (Painel Administrativo)**: Exclusivo para usuários com alto nível de permissão (`ADMIN` ou `MANAGER`). Contém gestão geral, configuração de Quotas (`/admin/dashboard/quotas`), controle de usuários (suspensões/alterações de cargos) e Fichas/Triagens.


* **Outros**: `(template)` para impressão de fichas oficiais e `(terms)` para Políticas de Privacidade.

---

## 9. Estrutura de Componentes (`src/components/`)

* **`ui/`**: Componentes genéricos de UI (ex: `Button`, `Input`, `Modal`, `Calendar`) estilizados com Tailwind CSS.

* **`features/`**: Lógica de negócios (ex: `LoginForm`, `CreatePetForm`, `NeuteringCalendar`, `SearchUserIdForm`).

* **`layout/`**: Componentes estruturais globais (`Header`, `Sidebar`, `Footer`).

* **`EmblaCarousel/`**: Controles para o slider de fotos e cards de adoção utilizando a lib EmblaCarousel.

---

## 10. Comandos de Uso

No diretório do projeto, você pode executar os seguintes scripts definidos no `package.json`:

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento local com hot-reload em [http://localhost:3000](http://localhost:3000). |
| `npm run build` | Compila e otimiza a aplicação para produção, gerando arquivos estáticos na pasta `.next`. |
| `npm run start` | Inicia o servidor em modo de produção (requer execução prévia do `npm run build`). |

---