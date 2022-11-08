const cols = document.querySelectorAll('.col')
const windowWidth = window.innerWidth
const header = document.querySelector('.header')

function mobileHeader() {
  if (windowWidth.toString() <= 650) {
    header.textContent = 'Tap to refresh the colors'
  }
}


document.addEventListener('touchstart', event => {
  if (event.type.toLowerCase() === 'touchstart') {
    setRandomColors()
  }
})

document.addEventListener('keydown', event => {
  event.preventDefault()
  if (event.code.toLowerCase() === 'space') {
    setRandomColors()
  }
})

document.addEventListener('click', event => {
  const type = event.target.dataset.type
  if (type === 'lock') {
    const node = event.target.tagName.toLowerCase() === 'i'
      ? event.target
      : event.target.children[0]
    node.classList.toggle('fa-lock-open')
    node.classList.toggle('fa-lock')
  } else if (type === 'copy') {
    copyToClipBoard(event.target.textContent)
  }
})

function generateRandomColor() {
  const hexCodes = '0123456789ABCDEF'
  let color = ''
  for (let i = 0; i < 6; i++) {
    color += hexCodes[Math.floor(Math.random() * hexCodes.length)]
  }
  return '#' + color
}

function copyToClipBoard(text) {
  navigator.clipboard.writeText(text)
}

function setRandomColors(isInitial) {
  const colors = isInitial ? getColorsFromHash() : []
  cols.forEach((col, index) => {
    const isLocked = col.querySelector('i').classList.contains('fa-lock')
    const text = col.querySelector('h2')
    const button = col.querySelector('button')

    if (isLocked) {
      colors.push(text.textContent)
      return
    }

    const color = isInitial
      ? colors[index]
        ? colors[index]
        : chroma.random()
      : chroma.random()

    if (!isInitial) {
      colors.push(color)
    }

    text.textContent = color

    col.style.background = generateRandomColor()

    setTextColor(text, color)
    setTextColor(button, color)
  })

  updateColorsHash(colors)
}

function setTextColor(text, color) {
  const luminance = chroma(color).luminance()
  text.style.color = luminance > 0.3 ? 'black' : 'white'
}

function updateColorsHash(colors = []) {
  document.location.hash = colors.map((col) => {
    return col.toString().substring(1)
  }).join('-')
}

function getColorsFromHash() {
  if (document.location.hash.length > 1) {
    return document.location.hash
      .substring(1)
      .split('-')
      .map(color => '#' + color)
  }
  return []
}

setRandomColors(true)
mobileHeader()
