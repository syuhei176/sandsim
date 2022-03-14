const EMPTY = 0
const SAND = 1
const WATER = 2
const SOIL = 3
const LAVA = 4

const width = 300
const height = 300
let stage = initStage()
let isMouseDown = false
let selectedPowderType = SAND


function initStage() {
  const stage = []
  for (let i = 0; i < width; i++) {
    stage[i] = Array(height)
    stage[i].fill(EMPTY)
  }
  return stage
}

function putPowder(x, y, powder) {
  // console.log('putPowder', x, y)
  stage[x][y] = powder
}

function updatePowder(i, j, stage, nextStage, powder, maxP) {
  if (j < height) {
    if ((stage[i][j] === WATER && stage[i][j + 1] === LAVA) || (
      stage[i][j + 1] === WATER && stage[i][j] === LAVA
    )) {
      nextStage[i][j] = SAND
      nextStage[i][j + 1] = SAND
      return
    }

    for (let p = 0; p < maxP; p++) {
      if (i + p >= width || j + p >= height) break
      if (i - p < 0 || j - p < 0) break

      if (stage[i + p][j + 1] === EMPTY) {
        nextStage[i + p][j + 1] = powder
        return
      }

      if (powder !== WATER) {
        if (stage[i + p][j + 1] === WATER) {
          nextStage[i + p][j + 1] = powder
          nextStage[i][j] = WATER
          return
        }
      }

      if (stage[i + p][j + 1] !== EMPTY && stage[i + p][j + 1] !== powder) {
        break
      }
    }

    for (let p = 0; p < maxP; p++) {
      if (i + p >= width || j + p >= height) break
      if (i - p < 0 || j - p < 0) break

      if (stage[i - p][j + 1] === EMPTY) {
        nextStage[i - p][j + 1] = powder
        return
      }

      if (powder !== WATER) {
        if (stage[i - p][j + 1] === WATER) {
          nextStage[i - p][j + 1] = powder
          nextStage[i][j] = WATER
          return
        }
      }

      if (stage[i - p][j + 1] !== EMPTY && stage[i - p][j + 1] !== powder) {
        break
      }
    }

    if (nextStage[i][j] === EMPTY) {
      nextStage[i][j] = powder
    }
  }
}

function update(stage) {
  const nextStage = initStage()
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      let viscosity = 0
      if (stage[i][j] === SAND) {
        viscosity = 2
      } else if (stage[i][j] === WATER) {
        viscosity = 20
      } else if (stage[i][j] === SOIL) {
        viscosity = 1
      } else if (stage[i][j] === LAVA) {
        viscosity = 5
      }
      if (viscosity > 0) {
        updatePowder(i, j, stage, nextStage, stage[i][j], viscosity)
      }
    }
  }
  return nextStage
}

function draw(stage) {
  const size = 2
  const w = width * size
  const h = height * size

  var canvas = document.getElementById('sample');
  if (canvas.getContext) {
    var context = canvas.getContext('2d');
    const imgData = context.getImageData(0, 0, w, h);

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const powder = stage[i][j]

        const indexes = [
          4 * (size * i + size * j * w),
          4 * ((size * i + 1) + size * j * w),
          4 * (size * i + (size * j + 1) * w),
          4 * ((size * i + 1) + (size * j + 1) * w),
        ]

        for (let index of indexes) {
          if (powder === EMPTY) {
            imgData.data[index] = 50
            imgData.data[index + 1] = 50
            imgData.data[index + 2] = 50
            imgData.data[index + 3] = 255
          } else if (powder === SAND) {
            imgData.data[index] = 200
            imgData.data[index + 1] = 180
            imgData.data[index + 2] = 100
            imgData.data[index + 3] = 255
          } else if (powder === WATER) {
            imgData.data[index] = 120
            imgData.data[index + 1] = 120
            imgData.data[index + 2] = 210
            imgData.data[index + 3] = 255
          } else if (powder === SOIL) {
            imgData.data[index] = 100
            imgData.data[index + 1] = 100
            imgData.data[index + 2] = 100
            imgData.data[index + 3] = 255
          } else {
            imgData.data[index] = 200
            imgData.data[index + 1] = 70
            imgData.data[index + 2] = 70
            imgData.data[index + 3] = 255
          }
        }
      }
    }

    context.putImageData(imgData, 0, 0);
  }
}


window.onload = function () {
  const selected = document.getElementById('selected')
  document.getElementById('sand').onclick = function () {
    selectedPowderType = SAND
    selected.innerText = 'Sand'
  }
  document.getElementById('water').onclick = function () {
    selectedPowderType = WATER
    selected.innerText = 'Water'
  }
  document.getElementById('soil').onclick = function () {
    selectedPowderType = SOIL
    selected.innerText = 'soil'
  }
  document.getElementById('lava').onclick = function () {
    selectedPowderType = LAVA
    selected.innerText = 'lava'
  }


  function updateScreen(time) {
    stage = update(stage)
    draw(stage)
    requestAnimationFrame(updateScreen);
  }
  requestAnimationFrame(updateScreen);
}

window.onmousedown = function (e) {
  isMouseDown = true
}

window.onmousemove = function (e) {
  var rect = e.target.getBoundingClientRect();
  x = e.clientX - rect.left;
  y = e.clientY - rect.top;

  if (isMouseDown) {
    putPowder(Math.floor(x / 2), Math.floor(y / 2), selectedPowderType)
  }
}

window.onmouseup = function (e) {
  isMouseDown = false
}

