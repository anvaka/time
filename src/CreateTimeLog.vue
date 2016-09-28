<template>
  <div>
    <h3>Create new time log</h3>
    <form @submit.prevent='create' v-if='false'>
      <div class='input-field'>
        <label for='name'>File name:</label>
        <input id='name' type='text' v-model='name'>
      </div>
      <input type='submit' class='waves-effect waves-light btn col s12' value='Create new file'/>
    </form>
    This is not implemented yet. <a href='#/'>Go home</a>
  </div>
</template>

<script>
import appModel from './lib/appModel.js';
import {createFile} from './lib/googInit.js';

export default {
  data() {
    return appModel;
  },
  methods: {
    create() {
      createFile(this.name);
    },
  },
};
</script>

<style>
</style>
