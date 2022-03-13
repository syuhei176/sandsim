const width = 320
const height = 320
let stage = initStage()
let isMouseDown = false
let selectedPowderType = 1

function initStage() {
  const stage = []
  for (let i = 0; i < width; i++) {
    stage[i] = []
    for (let j = 0; j < height; j++) {
      stage[i][j] = 0
    }
  }
  return stage
}

function putPowder(x, y, powder) {
  // console.log('putPowder', x, y)
  stage[x][y] = powder
}

function updatePowder(i, j, stage, nextStage, powder, maxP) {
  if (j < height) {
    for (let p = 0; p < maxP; p++) {
      if (stage[i + p][j + 1] === 0) {
        nextStage[i + p][j + 1] = powder
        return
      } else if (stage[i - p][j + 1] === 0) {
        nextStage[i + p][j + 1] = powder
        return
      }
    }
    nextStage[i][j] = powder
  }
}

function update() {
  const nextStage = initStage()
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      // 砂
      if (stage[i][j] === 1) {
        updatePowder(i, j, stage, nextStage, 1, 2)
      }
      // 水
      else if (stage[i][j] === 2) {
        updatePowder(i, j, stage, nextStage, 2, 5)
      }
      // 土
      else if (stage[i][j] === 3) {
        updatePowder(i, j, stage, nextStage, 3, 1)
      }
    }
  }
  stage = nextStage
}

function draw(stage) {
  const w = width * 2
  const h = height * 2
  const size = 2

  var canvas = document.getElementById('sample');
  if (canvas.getContext) {
    var context = canvas.getContext('2d');
    const imgData = context.getImageData(0, 0, w, h);

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const powder = stage[i][j]

        const indexes = [
          4 * (2 * i + 2 * j * w),
          4 * ((2 * i + 1) + 2 * j * w),
          4 * (2 * i + (2 * j + 1) * w),
          4 * ((2 * i + 1) + (2 * j + 1) * w),
        ]

        for (let index of indexes) {
          if (powder === 0) {
            imgData.data[index] = 50
            imgData.data[index + 1] = 50
            imgData.data[index + 2] = 50
            imgData.data[index + 3] = 255
          } else if (powder === 1) {
            imgData.data[index] = 200
            imgData.data[index + 1] = 180
            imgData.data[index + 2] = 100
            imgData.data[index + 3] = 255
          } else if (powder === 2) {
            imgData.data[index] = 150
            imgData.data[index + 1] = 150
            imgData.data[index + 2] = 200
            imgData.data[index + 3] = 255
          } else {
            imgData.data[index] = 100
            imgData.data[index + 1] = 100
            imgData.data[index + 2] = 100
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
    selectedPowderType = 1
    selected.innerText = 'Sand'
  }
  document.getElementById('water').onclick = function () {
    selectedPowderType = 2
    selected.innerText = 'Water'
  }
  document.getElementById('soil').onclick = function () {
    selectedPowderType = 3
    selected.innerText = 'soil'
  }


  function updateScreen(time) {
    update()
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

