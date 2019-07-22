export default class Tabler{
  constructor(config){
    this.config = Object.assign({
      data: null, // must be provided (raw .csv content)
      eol: '\n',
      separator: ';',
      isFirstLineFieldName: true

    }, config)
    this.init()
    this.do()
  }

  init(){
    this.fields = []
    this.rows = []
  }

  do(){
    if(this.config.isFirstLineFieldName) this.getFields()
    this.getRows()
  }

  getFields(){
    let firstLine = this.config.data.split(this.config.eol)[0]
    this.fieldLine = firstLine
    this.fields = this.fieldLine.split(this.config.separator)

    let fields = []
    this.fields.map(field => {
      if(field == '') field = '_'
      if(fields.includes(field)){
        field += '('+fields.join('').split(field).length+')'
      }
      fields.push(field)
    })
    this.fields = fields
  }
  getRows(){
    let rows = this.config.data.split(this.config.eol)
    rows.map( row => {
      if(row != this.fieldLine) this.addRow(row)
    } )
  }
  addRow(row){
    let values = row.split(this.config.separator)
    let newRow = {}
    this.fields.map( (field, i) => newRow[field] = values[i] )
    this.rows.push(newRow)
  }

  json(){
    return JSON.stringify(this.rows)
  }
  htmlArray(){
      let table = document.createElement('table')
      table.className = "table"
      var tableHead = document.createElement('thead')
      var tableHeadRow = document.createElement('tr')
      table.appendChild(tableHead)
      tableHead.appendChild(tableHeadRow)
      this.fields.map(field =>{
        let fieldEl = document.createElement('th')
        fieldEl.innerHTML = field
        tableHeadRow.appendChild(fieldEl)
      })
      var tableBody = document.createElement('tbody')
      table.appendChild(tableBody)
      this.rows.map((row, i) => {
        var rowEl = document.createElement('tr')
        rowEl.setAttribute('data-row', i)
        tableBody.appendChild(rowEl)

        this.fields.map(field => {
          let fieldEl = document.createElement('td')
          let fieldElInput = document.createElement('input')
          fieldElInput.value = row[field]
          fieldElInput.setAttribute('data-field', field)
          rowEl.appendChild(fieldEl)
          fieldEl.appendChild(fieldElInput)
          fieldElInput.addEventListener('keyup', (e)=>{
            let index = e.target.parentElement.parentElement.getAttribute('data-row')
            let field = e.target.getAttribute('data-field')
            this.rows[index][field] = e.target.value
          })
        })
      })
      return table;
  }

  export(){
    let csv = '';
    this.fields.map((field, i)=>{
      csv += field
      if(i < this.fields.length - 1) csv += this.config.separator
    })
    csv += this.config.eol
    this.rows.map(row=>{
      this.fields.map((field, i) =>{
        csv += row[field]
        if(i < this.fields.length - 1) csv += this.config.separator
      })
      csv += this.config.eol
    })
    return csv
  }
}
