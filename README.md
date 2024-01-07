# Feather Render
![gzip](https://img.shields.io/badge/gzip-621_bytes-green)
![license](https://img.shields.io/badge/license-ISC-blue)
![version](https://img.shields.io/badge/npm-v1.1.7-blue)

✨ A feather light render framework ✨ 621 bytes minified and gzipped - no dependencies - SSR support

Companion frameworks:
- [feather-state](https://www.npmjs.com/package/feather-state)
- [feather-state-react](https://www.npmjs.com/package/feather-state-react)

Live examples:
- [Feather To-Do app](https://codesandbox.io/p/devbox/feather-to-do-app-k5ss8j)
- [Feather To-Do app (inline)](https://codesandbox.io/p/devbox/feather-to-do-inline-4zt7ls)

[![coffee](https://img.shields.io/badge/Buy_me_a_coffee%3F_❤️-634832)](https://www.paypal.com/paypalme/featherframework)

## Getting started
### Package
```
npm i feather-render
```

### ...or inline
```html
<head>
  <script src="feather-render.min.js"></script>
</head>
<body>
  <script>
    const { html, hydrate } = window.__feather__ || {};
  </script>
</body>
```

## Index
Usage
- [Basic syntax](#basic-syntax)
- [Server-Side Rendering (SSR)](#server-side-rendering-ssr)
- [Client hydration](#client-hydration)

Documentation
- [`html()`](#html)
- [`hydrate()`](#hydrate)

Examples
- [Re-rendering](#re-rendering)
- [Event listeners](#event-listeners)
- [Fetching](#fetching)

## Usage
### Basic syntax
```ts
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
Tip: Plugins for VSCode like lit-html or Inline HTML can be used for syntax highlighting.

### Server-Side Rendering (SSR)
```ts
import express from 'express';
import { Document } from './components/Document';

const server = express();

server
    .get('/', (req, res) => {
        res.send(Document().toString());
    })
    .get('/index.js', (req, res) => {
        res.sendFile(req.url, { root: './dist' });
    });

server.listen(5000);
```

### Client hydration
```ts
import { hydrate } from 'feather-render';
import { TodoList } from './components/TodoList.js';

hydrate(TodoList(), document.body);
```

## Documentation
### `html()`
```ts
const { refs, render, mount, unmount } = html`<div></div>`;
```

#### Parameters
- `string` - html template string to render

#### Return value: `Render`
- `refs` - list of id'ed elements
- `render` - return of functional component
- `mount()` - run callback on mount
- `unmount()` - run callback on unmount

### `html().mount()`
```ts
mount(() => {
  console.log('Component inserted in DOM');
});
```
#### Parameters
- `callback()` - function called when component is inserted in DOM

#### Return value
- `void`

### `html().unmount()`
```ts
unmount(() => {
  console.log('Component removed from DOM');
});
```
#### Parameters
- `callback()` - function called after component is removed from DOM

#### Return value
- `void`

### `hydrate()`
```ts
hydrate(App(), document.body);
```
#### Parameters
- `element` - `Render` from `html()`
- `target` - where to mount the DOM

#### Return value
- `void`

## Examples
- Re-rendering
  - [Primitive values](#primitive-values)
  - [Lists](#lists)
- Event listeners
  - [Form submission](#form-submission)
- Fetching
  - [Server and client](#server-and-client)
  - [Server or client](#server-or-client)
  - [On mount](#on-mount)

### Re-rendering
#### Primitive values
```ts
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
    refs.paragraph?.replaceChildren(next);
  });

  // Change greeting state
  setTimeout(() => {
    state.greeting = 'Hello, back!';
  }, 1000);

  return render;
};
```

#### Lists
```ts
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
    for (let todo of todoStore.todos) {
      const { element } = TodoItem({ todo });
      element && fragment.appendChild(element);
    }
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
#### Form submission
```ts
import { html } from 'feather-render';

const Component = () => {
  const { refs, render, mount, unmount } = html`
    <form id="form">
      <p id="status">Fill in form</p>
      <input type="text" />
      <button type="submit">Submit</button>
    </form>
  `;

  const handleSubmit = (event) => {
    event.preventDefault();
    refs.status?.replaceChildren('Submitting');
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

### Fetching
#### Server and client
```ts
const App = () => {
  const { render } = html``;

  fetch('http://localhost:5000/api/v1/user')
		.then(res => res.json())
		.then(res => console.log(res));

  return render;
};
```

#### Server or client
```ts
const isServer = () => typeof window === 'undefined';
const isClient = () => typeof window !== 'undefined';

const App = () => {  
  const { render } = html``;

  if (isServer()) {
    fetch('http://localhost:5000/api/v1/user')
      .then(res => res.json())
      .then(res => console.log(res));
  }

  if (isClient()) {
    fetch('http://localhost:5000/api/v1/user')
      .then(res => res.json())
      .then(res => console.log(res));
  }

  return render;
};
```

#### On mount
```ts
const App = () => {
  const { render, mount } = html``;

  mount(() => {
    fetch('http://localhost:5000/api/v1/user')
      .then(res => res.json())
      .then(res => console.log(res));
  });

  return render;
};
```

## Roadmap 🚀
- CLI tool
- Automatically hydrate child components
- Cleaner way of referencing values in `html`
- Binding values, re-renders and listeners
- Lazy and suspense components
- CSS in JS examples
