<template>
  <div>
    <div v-if='empty'>
      <h3>No time sheets?</h3>
      <p>I could not find any time logs in your account. <a v-link="{path: '/create-time-log'}">Create a new time log</a>.
      </p>
    </div>
    <div v-else>
      <h3>Choose your time log <small>or <a v-link="{path: '/create-time-log'}">create a new time log</a></small></h3>
      <div class="collection">
        <a class="collection-item"
           v-for='file in files'
           v-link="{path: '/time-log/' + file.id}">{{file.name}}</a>
      </div>
    </div>
  </div>
</template>

<script>
import appModel from './lib/appModel.js';

export default {
  data() {
    return appModel;
  },

  computed: {
    empty() {
      return appModel.files.length === 0;
    }
  }
};
</script>

<style>
</style>
