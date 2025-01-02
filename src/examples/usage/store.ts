import { store } from 'feather-state';

export type Todo = {
  title: string;
};
export type TodoItemProps = {
  todo: Todo;
};

export const { todos } = store({ todos: [] });
