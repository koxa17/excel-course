const CODES = {
  A: 65,
  Z: 90,
}

function toCell(_, col) {
  return `<div class="cell" contenteditable data-col="${col}"></div>`
}

function toColumn(col, index) {
  return `
  <div class="column" data-type="resizeble" data-col="${index}">
    ${col}
    <div class="col-resize" data-resize="col"></div>
  </div>
  `
}

// строка
function createRow(index, content) {
  const resize = index ? `<div class="row-resize" data-resize="row"></div>` : ''
  return `
    <div class="row" data-type="resizeble">
        <div class="row-info" data-resize="row">
          ${index ? index : ''}
          ${resize}
        </div>
        <div class="row-data" >${content}</div>
    </div>
    `
}

// "_" - в параметрах означает что мы не юзаем, а нам нужен следующий параметр
function toChar(_, index) {
  return String.fromCharCode(CODES.A + index)
}

export function createTable(rowsCount = 15) {
  const colsCount = CODES.Z - CODES.A + 1
  const rows = []

  const cols = new Array(colsCount).fill('').map(toChar).map(toColumn).join('')

  rows.push(createRow(null, cols))

  for (let i = 0; i < rowsCount; i++) {
    const cells = new Array(colsCount).fill('').map(toCell).join('')
    rows.push(createRow(i + 1, cells))
  }

  return rows.join('')
}
