<template>
  <div>
    <div v-if='empty'>
      <h3>No time sheets?</h3>
      <p>I could not find any time logs in your account. <a v-link="{path: '/create-time-log'}">Create new time log</a>.
      </p>
    </div>
    <div v-if='filesLoaded && !empty'>
      <h4>Your Sheets</h4>
      <div class="collection">
        <a class="collection-item"
           v-for='file in files'
           v-link="{path: '/time-log/' + file.id}">{{file.name}}</a>
      </div>
      <div class='fixed-action-btn'>
        <a class='btn-floating btn-small red' v-link="{path: '/create-time-log'}" title='Create new time log'>
          <i class='small material-icons'>add</i>
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
  route: {
    data() {
      appModel.pageName = 'Select Sheet';
    }
  },

  computed: {
    empty() {
      return appModel.files.length === 0 && appModel.filesLoaded;
    }
  }
};
</script>
