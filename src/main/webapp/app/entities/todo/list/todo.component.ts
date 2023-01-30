import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITodo } from '../todo.model';
import { TodoService } from '../service/todo.service';
import { TodoDeleteDialogComponent } from '../delete/todo-delete-dialog.component';

@Component({
  selector: 'jhi-todo',
  templateUrl: './todo.component.html',
})
export class TodoComponent implements OnInit {
  todos?: ITodo[];
  isLoading = false;

  constructor(protected todoService: TodoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.todoService.query().subscribe(
      (res: HttpResponse<ITodo[]>) => {
        this.isLoading = false;
        this.todos = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ITodo): number {
    return item.id!;
  }

  delete(todo: ITodo): void {
    const modalRef = this.modalService.open(TodoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.todo = todo;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
