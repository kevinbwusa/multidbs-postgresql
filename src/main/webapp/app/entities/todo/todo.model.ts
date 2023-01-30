export interface ITodo {
  id?: number;
  title?: string | null;
  completed?: boolean | null;
}

export class Todo implements ITodo {
  constructor(public id?: number, public title?: string | null, public completed?: boolean | null) {
    this.completed = this.completed ?? false;
  }
}

export function getTodoIdentifier(todo: ITodo): number | undefined {
  return todo.id;
}
