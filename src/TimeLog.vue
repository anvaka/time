<template>
  <div>
    <h4>{{title}}</h4>
    <form>
      <div>
        <label for='start'>Start</label>
        <input id='start' type='datetime-local' v-model='start'>
      </div>
      <div>
        <label for='start'>End</label>
        <input id='end' type='datetime-local' v-model='end'>
      </div>
      <div class='input-field'>
        <label for='start'>What?</label>
        <input id='what' type='text' v-model='what'>
      </div>
    </form>
    <div class='row' v-if='saveState !== "saving"'>
      <a class='waves-effect waves-light btn col s12' @click='logIt'>Log time</a>
    </div>

    <div  v-if='saveState === "saving"'>
      <h4>Saving...</h4>
      <div class='progress'>
          <div class='indeterminate'></div>
      </div>
    </div>

    <div v-if='saveState === "error"' class='card-panel red-text'>
      <h4>Error...</h4>
      <pre><code>{{error}}</code></pre>
    </div>
    <table v-if='recordsState === "loaded"'>
      <thead>
        <tr>
          <th data-field='start'>Start</th>
          <th data-field='end'>End</th>
          <th data-field='what'>What?</th>
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

export default {
  created() {
    this.spreadsheetId = this.$route.params.sheetId;
    appModel.fetchLastRecords(this.spreadsheetId)
      .then((response) => {
        this.recordsState = 'loaded';
        const lastRecords = response.result.values.reverse().slice(0, 100);
        this.$set('lastRecords', lastRecords);
        const lastDate = getLastDate(lastRecords);
        if (lastDate) this.start = lastDate;
      }, (response) => {
        console.error('failed to load range', response);
      });
  },

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
    title() {
      for (let i = 0; i < appModel.files.length; ++i) {
        let file = appModel.files[i];
        if (file.id === this.$route.params.sheetId) {
          return file.name;
        }
      }

      return '';
    }
  },

  methods: {
    logIt() {
      this.saveState = 'saving';
      const start = parseDate(this.start);
      const end = parseDate(this.end);
      appModel.logTime(this.spreadsheetId, start, end, this.what)
        .then(() => {
          this.lastRecords.unshift([start, end, this.what]);
          this.start = this.end;
          this.end = getNow();
          this.what = '';
          this.saveState = 'done';
          this.error = '';
        }, (response) => {
          this.saveState = 'error';
          if (response.result && response.result.error) {
            this.error = response.result.error.message;
          } else {
            this.error = 'Unknown error :(';
          }
          console.error(response);
        });
    },
  },
};

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
