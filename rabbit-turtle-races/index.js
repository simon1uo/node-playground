import chalk from 'chalk-animation'


class Race extends Object {


  constructor() {
    super();

    this.rabbit = '🐇';
    this.turtle = '🐢';
    this.start = '🏁'
    this.finish = '🏁'
    this.pad = '_'

    this.rabbitStep = 0;
    this.turtleStep = 0;
    this.rabbitSpeed = 3;
    this.turtleSpeed = 1;

    // 随机刷新兔子停留的位置 大于30
    this.rabbitStopsAt = Math.floor(Math.random() * 30) + 30;
    this.length = 50;
  }

  getRaceTrack() {
    const { rabbit, turtle, start, finish, rabbitStep, turtleStep, pad, length } = this

    if (!rabbitStep && !turtleStep) {
      return `${rabbit}${turtle}${start}${pad.repeat(length)}${finish}`
    }

    const [[faster, fasterStr], [slower, slowerStr]] =
      [[turtleStep, turtle], [rabbitStep, rabbit]].sort((a, b) => b[0] - a[0])

    const prefix = `${pad.repeat((slower || 1) - 1)}`
    const middle = `${pad.repeat(faster - slower)}`
    const suffix = `${pad.repeat(length - faster)}`

    const _start = `${start}${prefix}${slowerStr}`
    const _finish = suffix ? `${fasterStr}${suffix}${finish}` : `${finish}${fasterStr}`

    return `${_start}${middle}${_finish}`
  }

  updateRaceTrack(chalk, state) {
    chalk.replace(state)
  }

  updateSteps() {
    if (this.turtleStep >= this.length) return;

    if (this.rabbitStep <= this.rabbitStopsAt) {
      this.rabbitStep += this.rabbitSpeed;
    }
    this.turtleStep += this.turtleSpeed;
  }



  race() {
    console.clear()
    const initState = this.getRaceTrack();
    const track = chalk.rainbow(initState);

    let t = 0;
    let timer = setInterval(() => {
      if (t <= 6) {
        t++;
        return;
      }

      const state = this.getRaceTrack()
      // console.log(state);
      this.updateRaceTrack(track, state)
      this.updateSteps()
    }, 150)
  }
}

const proxy = new Proxy(Race, {
  apply: (target, ctx, args) => {
    const race = new target(...args);
    return race.race()
  }
})

proxy()
