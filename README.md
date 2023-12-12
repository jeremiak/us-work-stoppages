# Work stoppages in the US

The US Bureau of Labor Statistics (BLS) keeps track of the work stoppages in the US with at least 1,000 workers [here](https://www.bls.gov/wsp/data/tables/).

The `scrape.ts` script will download all of the work stoppages for a year and convert the Excel file into a `.json` file.

It runs on Github Actions once a day to update the data for the current year. If the icon below is green, the last scrape was successful. If the scrape failed the icon will be red.

[![Scrape work stoppages](https://github.com/jeremiak/us-work-stoppages/actions/workflows/scrape.yml/badge.svg)](https://github.com/jeremiak/us-work-stoppages/actions/workflows/scrape.yml)
