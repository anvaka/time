<template>
  <div>
    <h3>Choose your time log <small>or <a v-link="{path: '/create-time-log'}">create a new log</a></small></h3>
      <div class="collection">
        <a class="collection-item"
           v-for='file in files'
           v-link="{path: '/time-log/' + file.id}">{{file.name}}</a>
      </div>
  </div>
</template>

<script>
import appModel from './lib/appModel.js';

export default {
  data() {
    return appModel;
  },
};
</script>

<style>
</style>
