import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ITodo, Todo } from '../todo.model';
import { TodoService } from '../service/todo.service';

@Component({
  selector: 'jhi-todo-update',
  templateUrl: './todo-update.component.html',
})
export class TodoUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    title: [],
    completed: [],
  });

  constructor(protected todoService: TodoService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ todo }) => {
      this.updateForm(todo);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const todo = this.createFromForm();
    if (todo.id !== undefined) {
      this.subscribeToSaveResponse(this.todoService.update(todo));
    } else {
      this.subscribeToSaveResponse(this.todoService.create(todo));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITodo>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(todo: ITodo): void {
    this.editForm.patchValue({
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
    });
  }

  protected createFromForm(): ITodo {
    return {
      ...new Todo(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      completed: this.editForm.get(['completed'])!.value,
    };
  }
}
