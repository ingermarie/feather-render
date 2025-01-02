import { html } from 'feather-render';
import { Todo, todos } from './store';

const TodoItem = ({ todo }: { todo: Todo }) => {
  return html`
    <li>${todo.title}</li>
  `;
};

export const TodoList = () => {
  return html`
    <ul>${todos.map(todo => TodoItem({ todo }))}</ul>
  `;
};

export const Document = () => html`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Feather</title>
    <script type="module" src="index.mjs"></script>
  </head>
  <body>
    ${TodoList()}
  </body>
  </html>
`;