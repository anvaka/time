<template>
  <div>
    <form novalidate @submit.prevent='logIt'>
      <div>
        <label>Start <a href='#' @click.prevent='setNow("start")'>set to now</a></label>
        <input id='start' type='datetime-local' v-model='start'>
      </div>
      <div>
        <label>End <a href='#' @click.prevent='setNow("end")'>set to now</a></label>
        <input id='end' type='datetime-local' v-model='end'>
      </div>
      <div class='input-field'>
        <label for='start'>What?</label>
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
      <div class='fixed-action-btn' style='bottom: 45px; right: 24px;'>
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
import appModel from './lib/appModel.js';
import {getError, fetchLastRecords, logTime, getSheetTitle} from './lib/goog.js';

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
    editLink() {
      const sheetId = getSpreadsheetIdFromRoute(this);
      return `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;
    }
  },
  route: {
    data() {
      appModel.pageName = 'Loading data...';
      loadRecords(this).then(() => {
        const sheetId = getSpreadsheetIdFromRoute(this);
        getSheetTitle(sheetId, title => {
          appModel.pageName = title;
        });
      })
    }
  },

  methods: {
    refreshRecords() {
      loadRecords(this);
    },

    setNow(what) {
      this[what] = getNow();
    },

    logIt() {
      this.saveState = 'saving';

      const start = parseDate(this.start);
      const end = parseDate(this.end);
      const spreadsheetId = getSpreadsheetIdFromRoute(this);

      logTime(spreadsheetId, start, end, this.what)
        .then(() => {
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


function loadRecords(component) {
  component.recordsState = 'loading';

  return fetchLastRecords(getSpreadsheetIdFromRoute(component))
    .then((response) => {
      component.recordsState = 'loaded';
      const values = response.result.values || [];
      const lastRecords = values.reverse().slice(0, 100);
      component.lastRecords = lastRecords;
      const lastDate = getLastDate(lastRecords);
      if (lastDate) component.start = lastDate;
      else {
        component.start = getNow();
        component.end = getNow();
      }
    }, (response) => {
      console.error('failed to load range', response);
    });
}

function getSpreadsheetIdFromRoute(component) {
  return component.$route.params.sheetId;
}

function parseDate(str) {
  return parseDateObject(new Date(str));
}

function parseDateObject(dateObject) {
  return dateObject.toISOString().substr(0, '2016-09-27T02:10:00'.length)
    .replace(/T/, ' ')
    .replace(/-/g, '/');
}

function getNow() {
  return toDateInputStr(new Date());
}

function getLastDate(records) {
  if (records.length === 0) return '';

  const lastRecord = records[0];
  if (lastRecord.length < 2) return '';

  const lastEnd = lastRecord[1];

  if (!lastEnd) return '';

  const d = new Date(lastEnd);
  if (Number.isNaN(d.getDate())) return '';

  return toDateInputStr(d);
}

function toDateInputStr(d) {
  /* eslint prefer-template: 0 */
  return d.getFullYear() +
        '-' + pad(d.getMonth() + 1) +
        '-' + pad(d.getDate()) +
        'T' + pad(d.getHours()) +
        ':' + pad(d.getMinutes()) +
        ':' + pad(d.getSeconds());

  function pad(number) {
    if (number < 10) {
      return '0' + number;
    }
    return number;
  }
}

</script>

<style>
</style>
