// deno-lint-ignore-file no-explicit-any

import dayjs from 'npm:dayjs'
import parseXlsx from "npm:excel"

import { parse } from "https://deno.land/std@0.182.0/flags/mod.ts";
import _ from "npm:lodash@4.17";
import { Destination, download } from "https://deno.land/x/download/mod.ts";

const args = parse(Deno.args);
const year = args.year ? +args.year : 2023
const file = `work-stoppages-${year}.xlsx`
const url = `https://www.bls.gov/wsp/publications/monthly-details/XLSX/${file}`

const destination: Destination = {
  file,
  dir: ".",
};
await download(url, destination);
const sheet = await parseXlsx.default(file, 2)
const cols = [
  "Employers involved",
  "States",
  "Areas",
  "Ownership",
  "Industry code [1]",
  "Union",
  "Union acronym",
  "Union Local",
  "Work stoppage beginning date",
  "Work stoppage ending date",
  "Number of workers [2]",
  "Number of workdays [3]",
  "Days idle, cumulative for this work stoppage",
  "Notes"
]
const rows = sheet.slice(2).map(d => {
  const row = {}
  cols.forEach((col, i) => {
    const key = col.replace(/\s\[\d\]/, '')
    if (key.startsWith('Work stoppage') && key.endsWith('date')) {
      if (d[i] === '[4]') {
        row[key] = null
      } else {
        const days = +d[i] - 2
        const value = dayjs('1900-01-01').add(days, 'day').format('YYYY-MM-DD')
        row[key] = value
      }
    } else if (key.startsWith('Number of') || key.startsWith('Days idle')) {
      row[key] = + d[i]
    } else {
      row[key] = d[i]
    }
  })
  return row
}).filter(d => d.States !== "")

console.log(`Sorting`)
const sorted = _.orderBy(rows, ["Work stoppage beginning date", "Days idle, cumulative for this work stoppage"]);
const toSaveFile = file.replace('.xlsx', '.json')

console.log(`Saving to ${toSaveFile}`);
await Deno.writeTextFile(`./${toSaveFile}`, JSON.stringify(sorted, null, 2));

console.log(`Removing downloaded .xlsx file`)
await Deno.remove(file)
console.log(`All done`);