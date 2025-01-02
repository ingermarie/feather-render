import { hydrate } from 'feather-render';
import { TodoList } from './basic-syntax';

hydrate(TodoList(), document.body);
