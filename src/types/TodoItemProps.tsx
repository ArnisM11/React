import {Todo} from "../types/Todo";

export type TodoItemProps = {
    todo: Todo;
    onCheckboxChange: () => void;
    onDelete: () => void;
    onTodoSave: (newTitle: string) => void;
  };