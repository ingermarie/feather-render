# Feather Render
![gzip](https://img.shields.io/badge/gzip-629_bytes-green)
![license](https://img.shields.io/badge/license-ISC-blue)
![version](https://img.shields.io/badge/npm-v1.1.6-blue)

✨ A feather light render framework ✨ 629 bytes minified and gzipped - no dependencies - SSR support

Companion frameworks:
- State - [feather-state](https://www.npmjs.com/package/feather-state)
- State React - [feather-state-react](https://www.npmjs.com/package/feather-state-react)

Live examples:
- [Feather To-Do app](https://codesandbox.io/p/devbox/feather-to-do-app-k5ss8j)
- [Feather To-Do app (inline)](https://codesandbox.io/p/devbox/feather-to-do-inline-4zt7ls)

[![coffee](https://img.shields.io/badge/Buy_me_a_coffee%3F_❤️-724e2c)](https://www.paypal.com/paypalme/featherframework)

## Getting started
```
npm i feather-render
```

## Usage
```typescript
import { html } from 'feather-render';

const TodoItem = ({ todo }) => {
  return html`
    <li>${todo.title}</li>
  `;
};

const TodoList = () => {
  return html`
    <ul>${todos.map(todo => TodoItem({ todo })).join('')}</ul>
  `;
};

const Document = () => html`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Feather</title>
      <script type="module" src="index.js"></script>
    </head>
    <body>
      ${TodoList()}
    </body>
  </html>
`;
```
Plugins for VSCode like lit-html or Inline HTML can be used to get syntax highlighting.

### SSR (Server-Side Rendering)
```typescript
import express from 'express';
import { Document } from './Document.js';

const server = express();

server.use('/', (req, res) => {
  if (req.url === '/index.js') {
    return res.status(200).sendFile(req.url, { root: './dist' });
  }
  res.status(200).send(Document().toString());
});

server.listen(5000);
```

### DOM hydration
```typescript
import { hydrate } from 'feather-render';
import { TodoList } from './components/TodoList.js';

hydrate(TodoList(), document.body);
```

## Documentation
### `html()`
```typescript
html`<div>...</div>` => { refs, render, mount(), unmount() }
```
#### Parameters
- `string` - html template string to render

#### Return value: `Render`
- `refs` - list of id'ed elements
- `render` - return of functional component
- `mount()` - run callback on mount
- `unmount()` - run callback on unmount

---

### `html().mount()`
```typescript
mount(() => void) => void;
```
#### Parameters
- `callback()` - function called when component is inserted in DOM

#### Return value
- `void`

---

### `html().unmount()`
```typescript
unmount(() => void) => void;
```
#### Parameters
- `callback()` - function called after component is removed from DOM.

#### Return value
- `void`

---

### `hydrate()`
```typescript
(element: Render, target: HTMLElement) => void;
```
#### Parameters
- `element` - `Render` from `html()`
- `target` - where to mount the DOM

#### Return value
- `void`

## Examples
### Re-rendering
#### Primitive values
```typescript
import { store } from 'feather-state';
import { html } from 'feather-render';

const { watch, ...state } = store({
  greeting: 'Hello, World'
});

const Component = () => {
  const { refs, render } = html`
    <p id="paragraph">${state.greeting}</p>
  `;

  // Watch greeting + update DOM
  watch(state, 'greeting', (next) => {
    refs.paragraph.textContent = next;
  });

  // Change greeting state
  setTimeout(() => {
    state.greeting = 'Hello, back!';
  }, 1000);

  return render;
};
```

#### Lists
```typescript
import { store } from 'feather-state';
import { html } from 'feather-render';

const { watch, ...state  } = store({
  todos: ['Todo 1', 'Todo 2'];
});

const TodoItem = ({ todo }) => {
  return html`
    <li>${todo}</ul>
  `;
};

const TodoList = () => {
  const { refs, render, mount } = html`
    <ul id="todoList">
      ${state.todos.map(todo => (
        TodoItem({ todo })
      )).join('')}
    </ul>
  `;

  const reRenderTodos = () => {
    const fragment = new DocumentFragment();
    state.todos.forEach((todo) => {
      const { element } = TodoItem({ todo });
      element && fragment.appendChild(element);
    });
    refs.todoList?.replaceChildren(fragment);
  };

  // Watch todos + update DOM
  watch(state, 'todos', () => {
    reRenderTodos();
  });

  // Hydrate TodoItems
  mount(() => {
    reRenderTodos();
  });

  // Append todo in state
  setTimeout(() => {
    state.todos = [...state.todos, 'Todo 3'];
  }, 1000);

  return render;
};
```

### Event listeners
```typescript
import { html } from 'feather-render';

const Component = () => {
  const { refs, render, mount, unmount } = html`
    <form id="form">
      <p id="status">Fill in form</p>
      <input type="text" />
      <button type="submit">Submit</button>
    </form>
  `;

  const handleSubmit = () => {
    refs.status.textContent = 'Submitting';
  };

  mount(() => {
    refs.form?.addEventListener('submit', handleSubmit);
  });
  unmount(() => {
    refs.form?.removeEventListener('submit', handleSubmit);
  });

  return render;
};
```

## Roadmap 🚀
- CLI tool
- Minified version via CDN
- Automatically hydrate child components
- Cleaner way of referencing values in `html`
- Adding value references to `refs` somehow?
- Support CSS in JS
