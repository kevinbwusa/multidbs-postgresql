jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TodoService } from '../service/todo.service';
import { ITodo, Todo } from '../todo.model';

import { TodoUpdateComponent } from './todo-update.component';

describe('Component Tests', () => {
  describe('Todo Management Update Component', () => {
    let comp: TodoUpdateComponent;
    let fixture: ComponentFixture<TodoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let todoService: TodoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TodoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(TodoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TodoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      todoService = TestBed.inject(TodoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const todo: ITodo = { id: 456 };

        activatedRoute.data = of({ todo });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(todo));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Todo>>();
        const todo = { id: 123 };
        jest.spyOn(todoService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ todo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: todo }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(todoService.update).toHaveBeenCalledWith(todo);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Todo>>();
        const todo = new Todo();
        jest.spyOn(todoService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ todo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: todo }));
        saveSubject.complete();

        // THEN
        expect(todoService.create).toHaveBeenCalledWith(todo);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Todo>>();
        const todo = { id: 123 };
        jest.spyOn(todoService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ todo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(todoService.update).toHaveBeenCalledWith(todo);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
