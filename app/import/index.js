const cliProgress = require('cli-progress');

// create new container
const multibar = new cliProgress.MultiBar({
  clearOnComplete: false,
  // hideCursor: true
  format: '{period} [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} '
}, cliProgress.Presets.shades_grey);

const moment = require('moment')
const {
  isMainThread, parentPort, workerData, threadId,
  MessageChannel, MessagePort, Worker
} = require('worker_threads')
const workerThread = require('./worker')


function mainThread() {
  const worker_count = parseInt(2 || process.env.THREADS)
  var BASE_PATH = process.argv[2]
  if (!BASE_PATH) {
    throw '找不到目標資料夾'
  }
  const startDate = process.argv[3] || '2015-01-01 00:00:00'
  const endDate = process.argv[4] || '2016-01-01 00:00:00'
  var duration = moment.duration(moment(endDate).diff(startDate))
  var peroid_length = parseInt((duration.asHours() + 1) / worker_count)

  console.log('startDate', startDate, 'endDate', endDate)
  console.log('peroid_length', peroid_length)

  // create worker
  for (let i = 0;i < worker_count; i++) {
    let startIndex = i * (peroid_length)
    let endDate = moment(startDate).add(startIndex + peroid_length-1, 'hours').format()
    let _workderData = {
      BASE_PATH,
      startDate: moment(startDate).add(startIndex, 'hours').format(),
      endDate
    }
    // console.log(i, '_workderData', 'startDate', _workderData.startDate, 'endDate', _workderData.endDate)


    const worker = new Worker(__filename, { workerData: _workderData })
    const format = 'YYYY/MM/DD HH'
    const bar = multibar.create(peroid_length, 0, {
      period: `${moment(_workderData.startDate).format(format)} ~ ${moment(_workderData.endDate).format(format)}`
    })
    worker.on('message', msg => {
      if (msg.progress) {
        // console.log(msg)
        bar.increment(msg.progress)
      }
    })

    worker.on('exit', code => {
      console.log(`main: worker stopped with exit code ${code}`);
      bar.stop()
    })
  }
}

if (isMainThread) {
  mainThread()
} else {
  workerThread()
}


moment = require('moment')
startDate = moment('2016-06-09')
var i = 0

while ( startDate.isSame(moment('2016-11-17') ) ) {
  let DATE = startDate.add(i, 'day')
  console.log(`http://web.archive.org/web/20190417034627/http://tisvcloud.freeway.gov.tw/history/TDCS/M06A/M06A_${DATE.format('YYYYMMDD')}.tar.gz`)

  if(i % 50 == 0) {
    console.log('---')
  }
  i++
}