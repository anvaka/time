<template>
  <div>
    <div class="navbar-fixed">
      <nav>
        <div class='nav-wrapper'>
          <a href='#' class='brand-logo'>{{pageName}}</a>
          <a href='#' data-activates='mobile-demo' class='button-collapse'><i class='material-icons'>menu</i></a>
          <ul id='nav-mobile' class='right hide-on-med-and-down'>
            <li v-if='authenticated'><a href='#' @click.prevent='onSignOutClick'>Sign out</a></li>
          </ul>
          <ul class='side-nav' id='mobile-demo'>
            <li v-if='authenticated'><a href='#' @click.prevent='onSignOutClick'>Sign out</a></li>
          </ul>
        </div>
      </nav>
    </div>
    <div class='container'>
      <div v-if='unknown'>
        <h3>Checking authentication...<h3>
      </div>
      <div v-if='apiLoaded'>
        <router-view class='view' keep-alive></router-view>
      </div>
      <div v-if='needsAuthentication'>
        <h1>Welcome!</h1>
        <p>
          This is a simple interface to Google Sheets, that allows you to
          log your time. Log it here, and analyze from Google Sheets later
        </p>
        <a class='waves-effect waves-light btn' @click='onSignInClick'>Sign in to Google Sheets</a>
      </div>
    </div>
  </div>
</template>

<script>
import appModel from './lib/appModel.js';
import {signIn, signOut} from './lib/goog.js';

export default {
  ready() {
    $('.button-collapse').sideNav();
  },
  data() {
    return appModel;
  },

  methods: {
    onSignInClick() {
      signIn();
    },
    onSignOutClick() {
      signOut(() => window.location.reload());
    }
  },
  computed: {
    unknown() {
      return appModel.authenticated === undefined;
    },

    apiLoaded() {
      return appModel.authenticated && appModel.sheetsAPIReady;
    },

    needsAuthentication() {
      return appModel.authenticated === false;
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
  min-height: 100vh;
  flex-direction: column;
}

nav .brand-logo {
  margin-left: 12px;
}

@media only screen and (max-width: 992px) {
  nav .brand-logo {
    max-width: 200px;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-left: 0;
  }
}
</style>
