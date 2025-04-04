const fs = require('fs')
const path = require('path')
const util = require('util')
const dayjs = require('dayjs')
const duration = require('dayjs/plugin/duration')
const ffmpeg = require('fluent-ffmpeg')

dayjs.extend(duration)


const open = util.promisify(fs.open)
const read = util.promisify(fs.read)

// 定义一个函数，用于格式化时间
function formatDuration(duration) {
  // 使用dayjs库将时间转换为秒，并格式化为HH:mm:ss格式
  return dayjs.duration(duration, 'seconds').format('HH:mm:ss')
}

function getVideoDuration(file) {
  return new Promise((resolve, reject) => {
    ffmpeg(file)
      .ffprobe((err, data) => {
        if (err) {
          reject(err);
          return;
        }
        const duration = data.format.duration;
        resolve(parseFloat(duration));
      });
  });
}


; (async function () {
  const dir = path.resolve(__dirname + '/videos')
  const files = fs.readdirSync(dir).map(file => path.resolve(dir, file))


  const videos = await Promise.all(
    files.map(async (file) => {
      const duration = await getVideoDuration(file)
      return { file, duration }
    })
  )

  const res = {
    amount: videos.length,
    totalDuration: formatDuration(videos.reduce((acc, cur) => acc + cur.duration, 0))
  }
  console.log({ res });
})()
