<template>
  <div>
    <form novalidate @submit.prevent='logIt'>
      <date-time label='Start' :value='start'></date-time>
      <date-time label='End' :value='end'></date-time>
      <div class='input-field'>
        <label for='what'>What?</label>
        <input id='what' type='text' v-model='what'>
      </div>

      <div class='row' v-if='saveState !== "saving"'>
        <input type='submit' class='waves-effect waves-light btn col s12' value='Log time'/>
      </div>
    </form>

    <div  v-if='saveState === "saving"'>
      <h4>Saving...</h4>
      <div class='progress'>
          <div class='indeterminate'></div>
      </div>
    </div>

    <div v-if='saveState === "error"' class='card-panel red-text'>
      <h4>Error...</h4>
      <pre><code>{{error}}</code></pre>
      <div>
        Refresh the page maybe?
      </div>
    </div>
    <div v-if='recordsState === "loaded"'>
      <table >
        <thead>
          <tr>
            <th data-field='start'>Start</th>
            <th data-field='end'>End</th>
            <th data-field='what'>
              What?
              <a href='#' @click.prevent='refreshRecords' class='right' title='refresh'>&#x21bb;</a>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='record in lastRecords'>
            <td>{{record[0]}}</td>
            <td>{{record[1]}}</td>
            <td>{{record[2]}}</td>
          </tr>
        </tbody>
      </table>
      <div class='fixed-action-btn' style='bottom: 12px; right: 12px;'>
        <a class='btn-floating btn-small red' :href='editLink' title='Edit records...' target='_blank'>
          <i class='small material-icons'>mode_edit</i>
        </a>
      </div>
    </div>

    <div v-if='recordsState === "loading"'>
      <h4>Loading records...</h4>
      <div class='progress'>
          <div class='indeterminate'></div>
      </div>
    </div>
  </div>
</template>

<script>
// This is the heart of the application. This file may not be the prettiest.
import appModel from './lib/appModel.js';
import {getError, logTime, getSheetTitle} from './lib/goog.js';
import {convertDateToSheetsDateString, getNow} from './lib/dateUtils.js';
import getLastRecordsForComponent from './lib/getLastRecordsForComponent.js';
import getSpreadsheetIdFromComponentRoute from './lib/getSpreadsheetIdFromComponentRoute.js';
import DateTime from './DateTime.vue';

export default {
  data() {
    return {
      recordsState: 'loading',
      lastRecords: [],
      start: '',
      end: getNow(),
      what: '',
      saveState: '',
    };
  },
  computed: {
    /**
     * Provides a Google Docs link to edit a spreadsheet
     */
    editLink() {
      const sheetId = getSpreadsheetIdFromComponentRoute(this);
      return `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;
    }
  },
  components: {
    DateTime
  },
  route: {
    data() {
      appModel.pageName = 'Loading data...';

      getLastRecordsForComponent(this).then(() => {
        const sheetId = getSpreadsheetIdFromComponentRoute(this);
        getSheetTitle(sheetId, title => {
          appModel.pageName = title;
        });
      })
    }
  },

  methods: {
    refreshRecords() {
      getLastRecordsForComponent(this);
    },

    logIt() {
      this.saveState = 'saving';

      const start = convertDateToSheetsDateString(this.start);
      const end = convertDateToSheetsDateString(this.end);
      const spreadsheetId = getSpreadsheetIdFromComponentRoute(this);

      logTime(spreadsheetId, start, end, this.what)
        .then(() => {
          // TODO: This is not very reliable.
          this.lastRecords.unshift([start, end, this.what]);
          this.start = this.end;
          this.end = getNow();

          this.what = '';
          this.saveState = 'done';
          this.error = '';
        }, response => {
          this.saveState = 'error';
          this.error = getError(response);
        });
    },
  },
};
</script>
