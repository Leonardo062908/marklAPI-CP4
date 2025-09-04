# Entrega – Automação de Testes de API Web (QA)

> **Conteúdo**: API mínima (Express), Dashboard Web (HTML/JS) e **10 testes automatizados** no Cypress.  
> **Objetivo da disciplina**: evidenciar **testes de integração de componentes** (API) com **Cypress** e boas práticas de verificação de status, dados e cenários negativos.

---

## 1) Requisitos

- **Node.js 18+** e **npm 10+**
- Windows/PowerShell (testado)
- Porta **3333** livre (API) e **3000** (web)

---

## 2) Estrutura do projeto

```text
QAprojetos/
├─ apps/
│  └─ markL/
│     ├─ api/           # API Express (CRUD de tarefas)
│     │  ├─ server.js
│     │  └─ package.json (scripts: dev/start)
│     └─ web/           # Dashboard HTML/JS (opcional p/ visual)
│        └─ index.html
└─ teste-api-web/       # Projeto Cypress (E2E de API)
   ├─ cypress/
   │  ├─ e2e/
   │  │  └─ tasks.api.cy.js   # 10 testes
   │  └─ support/e2e.js
   ├─ cypress.config.js
   ├─ package.json
   └─ package-lock.json
```
---

## 3) Como rodar

### 3.1 Subir a API (porta **3333**)

```powershell
cd C:\QAprojetos\apps\markL\api
npm install
npm run dev
```

Esperado no terminal: API up at http://localhost:3333

Healthcheck (opcional): abra http://localhost:3333/health → deve exibir {"status":"ok"}

### 3.2 (Opcional) Subir o Dashboard Web (porta 3000)

```powershell
cd C:\QAprojetos\apps\markL\web
npx http-server -p 3000
```
Abra http://localhost:3000 (consome a API: listar/criar/editar/patch/deletar).

### 3.3 Rodar os 10 testes no Cypress

```powershell
cd C:\QAprojetos\teste-api-web
npm install
npx cypress open
```
No runner: E2E Testing → escolha o navegador → execute cypress/e2e/tasks.api.cy.js → print “10 passed”.

Modo headless (sumário no terminal):

```powershell
cd C:\QAprojetos\teste-api-web
npx cypress run --spec "cypress/e2e/tasks.api.cy.js"
```
ℹ️ Os testes usam cy.request() (API pura). Como não há cy.visit(), a viewport mostra “Default blank page” — normal.

## 4) Evidências exigidas pela disciplina

As evidências necessárias para a entrega são:

- 📸 **Print do servidor no ar**: [http://localhost:3333/health](http://localhost:3333/health) → deve exibir `{"status":"ok"}`
- ✅ **Print do Cypress** com os **10 testes passando** (GUI com *“10 passed”* ou sumário do *run headless*)
- 📦 **ZIP do projeto** para upload no portal (detalhado na seção [7](#7-preparar-o-zip-para-o-portal))

Sugestão de pasta para evidências: `teste-api-web/evidencias/`

Arquivos esperados:
- `01-servidor-ok.png`
- `02-cypress-10-passed.png`
- *(opcional)* `03-dashboard-web.png`

---

## 5) Escopo da suíte (Cypress)

Arquivo principal: `cypress/e2e/tasks.api.cy.js`  
A suíte contém os seguintes cenários de teste:

1. **POST /tasks** cria → **201**
2. **GET /tasks** lista → **200 (array)**
3. **GET /tasks/:id** retorna → **200**
4. **PUT /tasks/:id** atualiza nome → **200**
5. **PATCH /tasks/:id** marca concluída → **200**
6. **PATCH /tasks/:id** desmarca concluída → **200**
7. **POST /tasks** sem `name` → **400**
8. **GET /tasks/:id** inexistente → **404**
9. **DELETE /tasks/:id** → **204** e depois **GET** → **404**
10. **PUT /tasks/:id** payload inválido (tipos errados) → **400**

## 6) Boas práticas aplicadas
- Validação de status code (200/201/204/400/404)

- Cenários negativos (payload inválido, id inexistente, campos obrigatórios)

- Isolamento de estado: limpeza dos recursos criados a cada teste

- Config central (baseUrl) em cypress.config.js

- CORS habilitado na API (app.use(cors()))

- Scripts npm para execução simples

## 7) Preparar o ZIP para o portal

Você pode preparar o pacote de entrega de duas formas:

---

### 🔹 Opção A – Apenas os testes (leve, recomendado)  
Compactar a pasta `C:\QAprojetos\teste-api-web` contendo:

- `cypress/` (incluindo `e2e/` e `support/`)
- `cypress.config.js`
- `package.json` e `package-lock.json`
- `README.md` (este arquivo)
- `evidencias/` com os **2 prints exigidos**

⚠️ **Atenção:** remova a pasta `node_modules/` antes de zipar.

---

### 🔹 Opção B – Pacote completo  
Criar a pasta `entrega-qa/` contendo:

- `apps/markL/api`
- `apps/markL/web`
- `teste-api-web`
- `evidencias/` (prints)

---

## 8) Troubleshooting

> ⚠️ Caso enfrente problemas, veja abaixo os cenários mais comuns e como corrigir:

- ❌ **Spec não aparece no runner**  
  ➜ Verifique `specPattern` em `cypress.config.js` e confirme que o nome termina com `*.cy.js`.

- ❌ **Erro “supportFile missing” (Cypress v15)**  
  ➜ Crie `cypress/support/e2e.js` ou defina `supportFile: false` no config.

- ❌ **ECONNREFUSED / Timeout**  
  ➜ A API não está rodando ou a porta não corresponde ao `baseUrl`.

- ❌ **CORS**  
  ➜ Já habilitado via `app.use(cors())` na API.

- ❌ **Porta ocupada**  
  ➜ Altere `const PORT = 3333` no `server.js` e ajuste `baseUrl` no Cypress.

- ❌ **Problemas com Node/pacotes**  
  ➜ Rode `npm cache clean --force` e depois `npm install` novamente.

---

## 9) Comentário de entrega (para o portal)

Para viabilizar a atividade, criei uma **API mínima em Node/Express** (CRUD de tarefas, rotas `/health` e `/tasks`, status `200/201/204/400/404`).  
Disponibilizo também um **dashboard web opcional** para visualizar o CRUD e uma **suíte com 10 testes Cypress** validando fluxos positivos e negativos.  

📎 Em anexo seguem:  
- Print do servidor no ar  
- Print dos 10 testes passando no Cypress  
- ZIP do projeto com README e passos de execução

---

## 10) Versões (exemplo)

- Node **18.x**  
- npm **10.x**  
- Cypress **15.x**  
- Express **4.x**  
- cors **2.x**  
- uuid **9.x**
