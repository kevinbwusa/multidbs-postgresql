package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Todo;
import com.mycompany.myapp.repository.TodoRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Todo}.
 */
@Service
@Transactional
public class TodoService {

    private final Logger log = LoggerFactory.getLogger(TodoService.class);

    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    /**
     * Save a todo.
     *
     * @param todo the entity to save.
     * @return the persisted entity.
     */
    public Todo save(Todo todo) {
        log.debug("Request to save Todo : {}", todo);
        return todoRepository.save(todo);
    }

    /**
     * Partially update a todo.
     *
     * @param todo the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Todo> partialUpdate(Todo todo) {
        log.debug("Request to partially update Todo : {}", todo);

        return todoRepository
            .findById(todo.getId())
            .map(existingTodo -> {
                if (todo.getTitle() != null) {
                    existingTodo.setTitle(todo.getTitle());
                }
                if (todo.getCompleted() != null) {
                    existingTodo.setCompleted(todo.getCompleted());
                }

                return existingTodo;
            })
            .map(todoRepository::save);
    }

    /**
     * Get all the todos.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Todo> findAll() {
        log.debug("Request to get all Todos");
        return todoRepository.findAll();
    }

    /**
     * Get one todo by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Todo> findOne(Long id) {
        log.debug("Request to get Todo : {}", id);
        return todoRepository.findById(id);
    }

    /**
     * Delete the todo by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Todo : {}", id);
        todoRepository.deleteById(id);
    }
}
