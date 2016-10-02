// This is the entry file.
//
// First, patch for https://github.com/Dogfalo/materialize/issues/1229
window.jQuery = require('jquery');
require('materialize-css/bin/materialize.js');
require('materialize-css/bin/materialize.css');

import Vue from 'vue';
import VueRouter from 'vue-router';
import vueClap from 'vue-clap'

import App from './App';
import ListFiles from './ListFiles';
import TimeLog from './TimeLog';
import CreateTimeLog from './CreateTimeLog';

import {initializeGoogleApi} from './lib/goog.js';

Vue.use(VueRouter);
Vue.use(vueClap);

const router = new VueRouter();
router.map({
  '': {
    component: ListFiles
  },
  '/time-log/:sheetId': {
    component: TimeLog
  },
  '/create-time-log': {
    component: CreateTimeLog
  },
});

router.start(App, '#app');

// We immadiately try to initialize google API, even if client is not
// yet loaded:
initializeGoogleApi();
