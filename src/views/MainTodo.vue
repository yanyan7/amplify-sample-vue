<template>
  <div>
    <h1>Todo App</h1>

    <input type="text" v-model="name" placeholder="Todo name">
    <input type="text" v-model="description" placeholder="Todo description">

    <button v-on:click="createTodo">Create Todo</button>

    <div v-for="item in todos" :key="item.id">
      <h3>{{ item.name }}</h3>
      <p>{{ item.description }}</p>

      <button v-on:click="deleteTodo(item.id)">Delete Todo</button>

      <router-link :to="{name:'edit',params:{id:item.id}}">
        <button>Edit Todo</button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { API } from 'aws-amplify';
import { createTodo, deleteTodo } from '/src/graphql/mutations';
import { listTodos } from '/src/graphql/queries';
import { onCreateTodo } from '/src/graphql/subscriptions';

export default {
  name: 'MainTodo',
  components: {
  },
  async created() {
    this.getTodos();
    this.subscribe();
  },
  data() {
    return {
      name: '',
      description: '',
      todos: []
    }
  },
  methods: {
    async createTodo() {
      const { name, description } = this;
      if (!name || !description) return;
      const todo = { name, description };
      this.todos = [...this.todos, todo];
      await API.graphql({
        query: createTodo,
        variables: {input: todo},
      });
      this.name = '';
      this.description = '';
    },
    async getTodos() {
      const todos = await API.graphql({
        query: listTodos
      });
      this.todos = todos.data.listTodos.items;
    },
    async deleteTodo (id) {
      const todoDetails = {
        id: id,
      };
      await API.graphql({ query: deleteTodo, variables: {input: todoDetails}});
      this.getTodos();
    },
    subscribe() {
      API.graphql({ query: onCreateTodo })
        .subscribe({
          next: (eventData) => {
            let todo = eventData.value.data.onCreateTodo;
            if (this.todos.some(item => item.name === todo.name)) return; // remove duplications
            this.todos = [...this.todos, todo];
          }
        });
    }
  }
}
</script>
