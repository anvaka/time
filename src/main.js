// This is the entry file.
import Vue from 'vue';
import VueRouter from 'vue-router';
import vueClap from 'vue-clap'
import vuemoment from 'vue-moment';

import App from './App';
import ListFiles from './ListFiles';
import TimeLog from './TimeLog';
import CreateTimeLog from './CreateTimeLog';

import {initializeGoogleApi} from './lib/goog.js';

Vue.use(VueRouter);
Vue.use(vueClap); // This is to properly handle tap and click events
Vue.use(vuemoment);


// Our routing is very simple, so there is no need to extract it into separate file
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

// We start our Vue application:
router.start(App, '#app');

// And immediately try to initialize Google API, even if Google client is not yet loaded:
initializeGoogleApi();
