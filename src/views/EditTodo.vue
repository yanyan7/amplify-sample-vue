<template>
  <div>
    <h1>EditTodo</h1>

    <input type="text" v-model="name" placeholder="Todo name">
    <input type="text" v-model="description" placeholder="Todo description">

    <button v-on:click="updateTodo()">Update Todo</button>
  </div>
</template>

<script>
import { API } from 'aws-amplify';
import { updateTodo } from '/src/graphql/mutations';
import { getTodo } from '/src/graphql/queries';
import router from '../router'

export default {
  name: 'EditTodo',
  data() {
    return {
      id: '',
      name: '',
      description: ''      
    }
  },
  mounted () {
    this.getTodo();
  },
  methods: {
    async getTodo () {
      const todo = await API.graphql({
        query: getTodo,
        variables: {id: this.$route.params.id},
      });

      this.id = todo.data.getTodo.id;
      this.name = todo.data.getTodo.name;
      this.description = todo.data.getTodo.description;
    },

    async updateTodo () {
      const todo = {
        id: this.id,
        name: this.name,
        description: this.description
      };

      await API.graphql({
        query: updateTodo,
        variables: {input: todo},
      });
      this.name = '';
      this.description = '';

      router.push('/')
    }
  }
}
</script>
