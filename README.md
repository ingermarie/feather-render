# Feather Render
![gzip](https://img.shields.io/badge/gzip-707_bytes-green)
![license](https://img.shields.io/badge/license-ISC-blue)
![version](https://img.shields.io/badge/npm-v1.3.3-blue)

✨ A feather light render framework ✨ 721 bytes minified and gzipped - no dependencies - SSR support

Companion framework:
- [feather-state](https://www.npmjs.com/package/feather-state)

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

Definitions
- [`Render`](#render)
- [`FR`](#fr) / [`FP`](#fp)

Examples
- [Re-rendering](#re-rendering)
- [Event listeners](#event-listeners)
- [Fetching](#fetching)
- [Async components](#async-components)
- [Lazy / Suspense](#lazy--suspense)
- [Unique id's](#unique-ids)
- [CSS in JS](#css-in-js)

## Usage
### Basic syntax
```ts
import { FR, html } from 'feather-render';
import { TodoItemProps } from './TodoItem.types';

const TodoItem: FR<TodoItemProps> = ({ todo }) => {
  return html`
    <li>${todo.title}</li>
  `;
};

const TodoList: FR = () => {
  return html`
    <ul>${todos.map(todo => TodoItem({ todo }))}</ul>
  `;
};

const Document: FR = () => html`
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
```
Tip: Plugins for VSCode like lit-html or Inline HTML can be used for syntax highlighting.

### Server-Side Rendering (SSR)
```ts
import express from 'express';
import { Document } from './components/Document';

const server = express();

server.use(express.static('dist'));

server.get('/', (req, res) => {
  const document = Document({ req });
  res.send(document.toString());
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
const render = html`<div></div>`;
```

#### Parameters
- `string` - html template string to render

#### Return value
- [`Render`](#render)

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
- `element` - [`Render`](#render) from [`html()`](#html)
- `target` - where to mount the element

#### Return value
- `void`

## Definitions
### `Render`
Return from [`html()`](#html)

```ts
const { refs, render, element, mount, unmount } = html`<div></div>`;
```

- `refs` - list of id'ed elements
- `render` - `this`
- `element` - element to insert in DOM
- [`mount()`](#htmlmount) - set callback for mount
- [`unmount()`](#htmlunmount) - set callback for unmount

### `FR`
Feather Render

```ts
const Page: FR<Props> = (props) => {
  return html`
    <main>
      ${props.title}
    </main>
  `;
};
```

### `FP`
Feather Render Promise

```ts
const Page: FP<Props> = async (props) => {
  const pageData = await fetchPageData(props);

  return html`
    <main>
      ${pageData.title}
    </main>
  `;
};
```

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
- Other
  - [Async components](#async-components)
  - [Lazy / Suspense](#lazy--suspense)
  - [Unique id's](#unique-ids)
  - [CSS in JS](#css-in-js)

### Re-rendering
#### Primitive values
```ts
import { store } from 'feather-state';
import { FR, html } from 'feather-render';

const { watch, ...state } = store({
  greeting: 'Hello, World'
});

const Component: FR = () => {
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
import { FR, html } from 'feather-render';
import { TodoItemProps } from './TodoItem.types';

const { watch, ...state  } = store({
  todos: ['Todo 1', 'Todo 2'];
});

const TodoItem: FR<TodoItemProps> = ({ todo }) => {
  return html`
    <li>${todo}</ul>
  `;
};

const TodoList: FR = () => {
  const { refs, render } = html`
    <ul id="todoList">
      ${state.todos.map(todo => (
        TodoItem({ todo })
      ))}
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
import { FR, html } from 'feather-render';

const Component: FR = () => {
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

### Async components
#### Server
```ts
import express from 'express';
import { Document } from './components/Document';

const server = express();

server.get('/', async (req, res) => {
  const document = await Document({ req });
  res.send(document.toString());
});

server.listen(5000);
```

#### Client hydration
```ts
import { hydrate } from 'feather-render';
import { fetchPage } from './Document.helpers';

fetchPage('/').then(page => {
  hydrate(page, document.body);
});
```

#### Document helper
```ts
import { Render } from 'feather-render';
import { ErrorPage } from './ErrorPage';
import { Page } from './Page';

export const fetchPage = async (path: string): Promise<Render> => {
  try {
    const pageData = await (await fetch(`/api/page${path}`)).json();
    return pageData ? Page({ pageData }) : ErrorPage({ code: 404 });
  } catch {
    return ErrorPage({ code: 500 });
  }
};
```

#### Document
```ts
import { Request } from 'express';
import { FP, html } from 'feather-render';
import { fetchPage } from './Document.helpers';

type Props = {
  req: Request;
};

const Document: FP<Props> = async ({ req }) => html`
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Feather</title>
    <script type="module" src="/index.mjs"></script>
  </head>
  <body>
    ${await fetchPage({ path: req.path })}
  </body>
  </html>
`;
```

### Fetching
#### Server and client
```ts
import { FR, html } from 'feather-render';

const App: FR = () => {
  const { render } = html``;

  fetch('http://localhost:5000/api/v1/user')
    .then(res => res.json())
    .then(res => console.log(res));

  return render;
};
```

#### Server or client
```ts
import { FR, html } from 'feather-render';

const isServer = () => typeof window === 'undefined';
const isClient = () => typeof window !== 'undefined';

const App: FR = () => {
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
import { FR, html } from 'feather-render';

const App: FR = () => {
  const { render, mount } = html``;

  mount(() => {
    fetch('http://localhost:5000/api/v1/user')
      .then(res => res.json())
      .then(res => console.log(res));
  });

  return render;
};
```

### Lazy / Suspense
```ts
import { FR, html } from 'feather-render';

const App: FR = () => {
  const { render } = html`
    <div id="lazyParent"></div>
  `;

  import('./LazyComponent').then(({ LazyComponent }) => {
    const { element } = LazyComponent();
    element && refs.lazyParent?.replaceChildren(element);
  });

  return render;
};
```

### Unique id's
```ts
let i = 0;
export function id(name: string) {
  return `${name}_${i++}`;
}
```

```ts
import { FR, html } from 'feather-render';
import { id } from '../helpers/id';

const App: FR = () => {
  const uniqueId = id('unique');

  const { refs, render, mount } = html`
    <div id=${uniqueId}></div>
  `;

  mount(() => {
    refs[uniqueId]?.replaceChildren('Component mounted');
  });

  return render;
};
```

### CSS in JS
#### Components
```ts
import { FR, html } from 'feather-render';
import { css } from '@emotion/css';

const Page: FR = () => html`
  <main class=${css`background: red;`}>
  </main>
`;
```

#### Server-Side Rendering (SSR)
```ts
import { FR, html } from 'feather-render';
import createEmotionServer from '@emotion/server/create-instance';
import { cache } from '@emotion/css';
import { Page } from './Page';

const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);

const Document: FR = () => {
  const page = Page();
  const chunks = extractCriticalToChunks(page.toString());
  const styles = constructStyleTagsFromChunks(chunks);

  return html`
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Feather</title>
      <script type="module" src="/index.mjs"></script>
      ${styles}
    </head>
    <body>
      ${page}
    </body>
    </html>
  `;
};
```

## Roadmap 🚀
- CLI tool
- Cleaner way of referencing values in `html`
- Binding values, re-renders and listeners
- Router example
