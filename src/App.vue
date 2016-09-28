<template>
  <div class='container'>
    <div v-if="unknown">
      <h3>Checking authentication...<h3>
    </div>
    <div v-if="loaded">
      <router-view class="view" keep-alive></router-view>
    </div>
    <div v-if="needsAuth">
      <h1>Welcome to Sheetime!</h1>
      <p>
        This is just a simple interface to Google Sheets, that allows you to
        log your time. Log it here, and analyze from Google Sheets later
      </p>
      <a class="waves-effect waves-light btn" @click='onSigninClick'>Sign in to Google Sheets</a>
    </div>

  </div>
</template>

<script>
import appModel from './lib/appModel.js';
import {signin} from './lib/googInit.js';

export default {
  data() {
    return appModel;
  },
  methods: {
    onSigninClick() {
      signin();
    },
  },
  computed: {
    unknown() {
      return appModel.authStatus === 'unknown';
    },
    loaded() {
      const isLoaded = appModel.authStatus === 'ok' && appModel.sheetsReady;
      return isLoaded;
    },

    needsAuth() {
      return appModel.authStatus === 'error';
    },
  },
};
</script>

<style>
html {
  height: 100%;
}

body {
  display: flex;
  height: 100%;
}
</style>
