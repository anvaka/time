<template>
  <div>
    <div v-if='empty'>
      <h3>No time sheets?</h3>
      <p>I could not find any time logs in your account. <a v-link="{path: '/create-time-log'}">Create new time log</a>.
      </p>
    </div>
    <div v-if='filesLoaded && !empty'>
      <h4>Files</h4>
      <div class="collection">
        <a class="collection-item"
           v-for='file in files'
           v-link="{path: '/time-log/' + file.id}">{{file.name}}</a>
      </div>
      <div class='fixed-action-btn' style='bottom: 45px; right: 24px;'>
        <a class='btn-floating btn-large red' v-link="{path: '/create-time-log'}" title='Create new time log'>
          <i class='large material-icons'>add</i>
        </a>
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
      return appModel.files.length === 0 && appModel.filesLoaded;
    }
  }
};
</script>

<style>
</style>
