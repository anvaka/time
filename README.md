# [time](https://time.anvaka.com/)

A very simple interface to Google Sheets, that allows you to track time.
Every time when you work on something - you can log time [here](https://time.anvaka.com/),
and edit it in Google Sheets later.

# Demo

![animated demo](https://raw.githubusercontent.com/anvaka/time/master/docs/demo_time.gif)

# [Video](https://www.youtube.com/watch?v=5e8K0LMdTmw)

# How?

The entire time tracking "database" has only three columns:

`Start time | End time | What is done?`

I'm using the simplest possible UI to enter this information on the website,
and send this data to Google Sheets via [Google Sheets API](https://developers.google.com/sheets/).

*NOTE: Once [time.anvaka.com](https://time.anvaka.com/#!/) is loaded, all communication
happens directly between your browser and Google Sheets. So, your privacy (and mine)
is kept intact*

I crafted UI based on my own usage patterns. The `Start time` of a new record is
always set to the `End time` of the last record. So I can immediately log what I've done
since last entry (see GIF file above).

# Why?

I was just curios. I had this idea of `Google Sheets as a Database` for a while,
and wanted to have a tool to track time that is tailored to my needs. So it was
a good excuse to play with it, and have one more tool in my professional toolset :).

After all, it took only ~10.5 hours to build this website.

I liked the API and hope you will find this project helpful for your learning and inspiration!

# License

The code is fully available under MIT license.

# Development

If you want to develop this tool on your computer, simply do the following:

```
git clone https://github.com/anvaka/time.git
cd time
npm install
```

Now you are ready to run dev server:

```
npm run dev
```

Then open [http://localhost:8091](http://localhost:8091).

The tool uses [vue](http://v1.vuejs.org/guide/) and [materialize](http://materializecss.com/).
The hosting and secure certificates are provided by https://www.netlify.com/ - free
for open source projects.
