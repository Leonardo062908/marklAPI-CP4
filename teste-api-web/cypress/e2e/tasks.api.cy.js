const rnd = () => Math.random().toString(36).slice(2, 8);

describe("API de Tarefas - CRUD + Erros", () => {
  let createdIds = [];

  afterEach(() => {
    createdIds.forEach((id) => {
      cy.request({
        method: "DELETE",
        url: `/tasks/${id}`,
        failOnStatusCode: false,
      });
    });
    createdIds = [];
  });

  it("1) POST cria tarefa -> 201", () => {
    const name = `tarefa-${rnd()}`;
    cy.request("POST", "/tasks", { name, is_done: false }).then(
      ({ status, body }) => {
        expect(status).to.eq(201);
        expect(body).to.have.property("id");
        expect(body).to.include({ name, is_done: false });
        createdIds.push(body.id);
      }
    );
  });

  it("2) GET lista -> 200 (array)", () => {
    cy.request("GET", "/tasks").then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body).to.be.an("array");
    });
  });

  it("3) GET por ID -> 200", () => {
    const name = `tarefa-${rnd()}`;
    cy.request("POST", "/tasks", { name, is_done: false }).then(({ body }) => {
      const id = body.id;
      createdIds.push(id);
      cy.request("GET", `/tasks/${id}`).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body).to.include({ id, name });
      });
    });
  });

  it("4) PUT atualiza nome -> 200", () => {
    const name = `tarefa-${rnd()}`;
    const novoNome = `tarefa-edit-${rnd()}`;
    cy.request("POST", "/tasks", { name, is_done: false }).then(({ body }) => {
      const id = body.id;
      createdIds.push(id);
      cy.request("PUT", `/tasks/${id}`, {
        name: novoNome,
        is_done: false,
      }).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body).to.include({ id, name: novoNome });
      });
    });
  });

  it("5) PATCH marca concluída -> 200", () => {
    const name = `tarefa-${rnd()}`;
    cy.request("POST", "/tasks", { name, is_done: false }).then(({ body }) => {
      const id = body.id;
      createdIds.push(id);
      cy.request("PATCH", `/tasks/${id}`, { is_done: true }).then(
        ({ status, body }) => {
          expect(status).to.eq(200);
          expect(body).to.include({ id, is_done: true });
        }
      );
    });
  });

  it("6) PATCH desmarca concluída -> 200", () => {
    const name = `tarefa-${rnd()}`;
    cy.request("POST", "/tasks", { name, is_done: true }).then(({ body }) => {
      const id = body.id;
      createdIds.push(id);
      cy.request("PATCH", `/tasks/${id}`, { is_done: false }).then(
        ({ status, body }) => {
          expect(status).to.eq(200);
          expect(body).to.include({ id, is_done: false });
        }
      );
    });
  });

  it("7) POST sem name -> 400", () => {
    cy.request({
      method: "POST",
      url: "/tasks",
      body: { is_done: false },
      failOnStatusCode: false,
    }).then(({ status }) => {
      expect(status).to.eq(400);
    });
  });

  it("8) GET ID inexistente -> 404", () => {
    cy.request({
      method: "GET",
      url: "/tasks/00000000-0000-0000-0000-000000000000",
      failOnStatusCode: false,
    }).then(({ status }) => {
      expect(status).to.eq(404);
    });
  });

  it("9) DELETE existente -> 204 e depois GET -> 404", () => {
    const name = `tarefa-${rnd()}`;
    cy.request("POST", "/tasks", { name, is_done: false }).then(({ body }) => {
      const id = body.id;
      cy.request("DELETE", `/tasks/${id}`).then(({ status }) => {
        expect(status).to.eq(204);
      });
      cy.request({
        method: "GET",
        url: `/tasks/${id}`,
        failOnStatusCode: false,
      }).then(({ status }) => expect(status).to.eq(404));
    });
  });

  it("10) PUT payload inválido -> 400", () => {
    const name = `tarefa-${rnd()}`;
    cy.request("POST", "/tasks", { name, is_done: false }).then(({ body }) => {
      const id = body.id;
      createdIds.push(id);
      cy.request({
        method: "PUT",
        url: `/tasks/${id}`,
        body: { name: 123, is_done: "nope" },
        failOnStatusCode: false,
      }).then(({ status }) => {
        expect(status).to.eq(400);
      });
    });
  });
});
