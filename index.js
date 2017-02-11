const { csvFormat } = require('d3-dsv');
const d3 = require('d3');
const Nightmare = require('nightmare');
const {readFileSync, writeFileSync } = require('fs');

const numbers = readFileSync('./tesco-title-numbers.csv', { encoding: 'utf8' }).trim().split('\n')

const START = 'http://ireports.wrapsnet.org/Interactive-Reporting/EnumType/Report?ItemPath=/rpt_WebArrivalsReports/MX%20-%20Arrivals%20by%20Nationality%20and%20Religion';

const getAddress = async date => {
  var data = '2/9/2017'
  console.log(`Now checking ${date}`);
  const nightmare = new Nightmare({ show: true });

  // Go to initial start page, navigate to "Detailed enquiry"
  try {
    await nightmare
      .goto(START)
      .wait('input[name="dnn$ctr513$View$ReportViewer1$ctl04$ctl07$txtValue"]')
      .type('input[name="dnn$ctr513$View$ReportViewer1$ctl04$ctl07$txtValue"]', date)
      .click('input[value="View Report"]');
      // .wait('.bodylinkcopy:first-child')
      // .click('.bodylinkcopy:first-child');
  } catch(e) {
    console.error(e);
  }

  // On the next page, type the title number into the appropriate box; click submit
  try {
    // await nightmare
    //   .wait('input[name="titleNo"]')
    //   .type('input[name="dnn$ctr513$View$ReportViewer1$ctl04$ctl07$txtValue"]', id)
    //   .click('input[value="Search »"]');
  } catch(e) {
    console.error(e);
  }

  try {
    const result = await nightmare
      .wait('.w80p')
      .evaluate(() => {
        return [...document.querySelectorAll('.w80p')].map(el => el.innerText);
      })
      .end();

      return { date, address: result[0], lease: result[1] };
  } catch(e) {
    console.error(e);
    return undefined;
  }
};

// getAddress(numbers[0]).then(a => console.dir(a));

const series = numbers.reduce(async (queue, number) => {
  const dataArray = await queue;
  dataArray.push(await getAddress(number));
  return dataArray;
}, Promise.resolve([]));

series.then(data => {
  const csvData = csvFormat(data.filter(i => i));
  writeFileSync('./output.csv', csvData, { encoding: 'utf8' })
})
.catch(e => console.error(e));
