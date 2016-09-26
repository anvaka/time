<template>
  <div>
    <form>
      <div class='row'>
        <label for='start'>Start</label>
        <input id='start' type='datetime-local' v-model='start'>
      </div>
      <div class='row'>
        <label for='start'>End</label>
        <input id='end' type='datetime-local' v-model='end'>
      </div>
      <div class='input-field row'>
        <label for='start'>What?</label>
        <input id='what' type='text' v-model='what'>
      </div>
    </form>
    <div class='row'>
      <a class='waves-effect waves-light btn col s12' @click='logIt'>Log time</a>
    </div>
    <table>
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
  </div>
</template>

<script>
import appModel from './lib/appModel.js';

export default {
  created() {
    this.spreadsheetId = this.$route.params.sheetId;
    appModel.fetchLastRecords(this.spreadsheetId)
      .then((response) => {
        const lastRecords = response.result.values.reverse().slice(0, 100);
        this.$set('lastRecords', lastRecords)
      }, (response) => {
        console.error('failed to load range', response);
      });
  },

  data() {
    return {
      lastRecords: [],
      start: '',
      end: '',
      what: '',
    };
  },

  methods: {
    logIt() {
      appModel.logTime(this.spreadsheetId, this.start, this.end, this.what)
       .then(() => {
         this.lastRecords.unshift([this.start, this.end, this.what]);
         this.start = '';
         this.end = '';
         this.what = '';
       });
    },
  },
};
</script>

<style>
</style>
