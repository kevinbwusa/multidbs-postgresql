import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITodo, getTodoIdentifier } from '../todo.model';

export type EntityResponseType = HttpResponse<ITodo>;
export type EntityArrayResponseType = HttpResponse<ITodo[]>;

@Injectable({ providedIn: 'root' })
export class TodoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/todos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(todo: ITodo): Observable<EntityResponseType> {
    return this.http.post<ITodo>(this.resourceUrl, todo, { observe: 'response' });
  }

  update(todo: ITodo): Observable<EntityResponseType> {
    return this.http.put<ITodo>(`${this.resourceUrl}/${getTodoIdentifier(todo) as number}`, todo, { observe: 'response' });
  }

  partialUpdate(todo: ITodo): Observable<EntityResponseType> {
    return this.http.patch<ITodo>(`${this.resourceUrl}/${getTodoIdentifier(todo) as number}`, todo, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITodo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITodo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTodoToCollectionIfMissing(todoCollection: ITodo[], ...todosToCheck: (ITodo | null | undefined)[]): ITodo[] {
    const todos: ITodo[] = todosToCheck.filter(isPresent);
    if (todos.length > 0) {
      const todoCollectionIdentifiers = todoCollection.map(todoItem => getTodoIdentifier(todoItem)!);
      const todosToAdd = todos.filter(todoItem => {
        const todoIdentifier = getTodoIdentifier(todoItem);
        if (todoIdentifier == null || todoCollectionIdentifiers.includes(todoIdentifier)) {
          return false;
        }
        todoCollectionIdentifiers.push(todoIdentifier);
        return true;
      });
      return [...todosToAdd, ...todoCollection];
    }
    return todoCollection;
  }
}
