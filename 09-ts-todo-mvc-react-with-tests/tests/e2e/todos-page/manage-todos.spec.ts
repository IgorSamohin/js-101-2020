import {todosEndpoint, getUserEndpoint, pageUrl} from '../../../src/consts/urls';

export function authorize() {
  cy.intercept(
    'GET',
    getUserEndpoint,
    {fixture: 'user.response.json'}
  ).as('authorize');

  cy.intercept(
    'GET',
    todosEndpoint,
    {fixture: 'empty-todos-list.response.json'}
  ).as('initialTodos');

  cy.visit(pageUrl)
    .wait('@authorize')
    .wait('@initialTodos');
}

export function createTodo() {
  const itemText = Math.random().toString() + '_' + Date.now();

  cy.get('[data-test-id=create-new-todo-form]').should('be.visible');
  cy.get('[data-test-id=create-new-todo-form__todo-text-input]').type(itemText);
  cy.get('[data-test-id=create-new-todo-form]').submit();
  return itemText;
}

beforeEach('', () => {
  cy.fixture('todo-item.response.json').then((todoItemResponse) => {
    cy.intercept(
      'POST',
      todosEndpoint,
      req => {
        const {body} = req;
        req.reply({
          statusCode: 200,
          body: JSON.stringify({
            ...todoItemResponse,
            text: body.text
          })
        });
      }
    ).as('createTodo');
  });
})

describe('Manage Todos', () => {
  context('Creation', () => {
    it('Create todo', () => {
      authorize();
      const itemText = createTodo();

      cy.wait('@createTodo');

      cy.get('[data-test-id=todos-list]').should('be.visible');

      cy.get('[data-test-id=todo-item]').should('be.visible');
      cy.get('[data-test-id=todo-item__checked-checkbox]').should('not.be.checked');
      cy.get('[data-test-id=todo-item__text-input]').should('have.value', itemText);
      cy.get('[data-test-id=todo-item__remove-action]').should('be.visible');
    });
  });

  context('Deletion', () => {
    it('Delete todo', () => {
      authorize();
      createTodo();

      cy.wait('@createTodo');

      cy.get('[data-test-id=todos-list]').should('be.visible');
      cy.get('[data-test-id=todo-item]').should('be.visible');
      cy.get('[data-test-id=todo-item__remove-action]').should('be.visible');
      cy.get('[data-test-id=todo-item__remove-action]').click({ force: true });

      cy.get('[data-test-id=todo-item]').should('not.exist');
    })
  })
});
