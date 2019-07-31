export default class Tabler{
  constructor(config){
    this.config = Object.assign({
      data: null, // must be provided (raw .csv content)
      eol: '\n',
      eolToken: 'EOLEOLEOL',
      separator: ';',
      textDelimiter: '"',
      isFirstLineFieldName: true,
      offset: 0,
      limit: 20
    }, config)
    this.init()
    this.do()
  }

  init(){
    this.fields = []
    this.rows = []
    this.config.separator = this.guessSeparator(this.config.data)
    this.config.eol = this.guessEndOfLine(this.config.data)
  }
  guessEndOfLine(data){
    if(data.split('\r\n').length) return '\r\n';
    else return '\n';
  }
  guessSeparator(data){
    let separators = [',', ';']
    let maxMatchs = 0
    let maxMatchsSeparator = separators[0]
    separators.map( separator => {
      let matchs = data.split(separator).length
      if (matchs > maxMatchs) {
        maxMatchs = matchs
        maxMatchsSeparator = separator
      }
    })
    return maxMatchsSeparator;
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
    let textContents = this.config.data.match(new RegExp(`${this.config.separator}${this.config.textDelimiter}[^${this.config.separator}]*\n.*?${this.config.textDelimiter}${this.config.separator}`, 'g'))
    if(textContents) textContents.map( textContent => {
      this.config.data = this.config.data.replace(textContent, textContent.replace(new RegExp('\n', 'g'), this.config.eolToken))
    } )

    let rows = this.config.data.split(this.config.eol)
    rows.map( row => {
      if(row != this.fieldLine) this.addRow(row)
    } )
  }
  addRow(row){
    let values = row.split(this.config.separator)
    let newRow = {}
    this.fields.map( (field, i) => {
      let value = values[i]
      if(typeof(value) == 'string') value = value.replace(new RegExp(this.config.eolToken, 'g'), '\n')
      newRow[field] = value
    } )
    this.rows.push(newRow)
  }

  // objects methods
  renameField(oldFieldName, newFieldName){
    let i = this.fields.indexOf(oldFieldName)
    this.fields[i] = newFieldName
    this.rows.map(row => {
      row[newFieldName] = row[oldFieldName]
      delete row[oldFieldName]
    })
  }
  addField(fieldName){
    this.fields.push(fieldName)
    this.rows.map(row => {
      row[fieldName] = ''
    })
  }
  deleteField(fieldName){
    let i = this.fields.indexOf(fieldName)
    this.fields.splice(i, 1)
    this.rows.map(row => {
      delete row[fieldName]
    })
  }
  replaceValues(field, regex, value){
    this.rows.map( row => {
      if(row[field]) row[field] = row[field].replace(new RegExp(regex), value)
      if(!regex.length) row[field] = value
    })
  }

  // HTML CONTROLS
  htmlController(parentElement){
      let table = document.createElement('table')
      table.className = "table tabler"
      var tableHead = document.createElement('thead')
      var tableHeadRow = document.createElement('tr')
      var tableBody = document.createElement('tbody')

      table.appendChild(tableHead)
      tableHead.appendChild(tableHeadRow)
      table.appendChild(tableBody)
      parentElement.innerHTML = ''
      parentElement.appendChild(table)

      this.bindFields()
      this.loadRows()
  }

  bindFields(){
    this.fields.map(field =>{
      this.bindField(field)
    })
  }
  bindField(field){
    let tableHeadRow = document.querySelector('.tabler thead tr')
    let fieldEl = document.createElement('th')
    let fieldElInput = document.createElement('input')
    fieldElInput.classList.add('form-control')
    fieldElInput.value = field
    fieldElInput.setAttribute('data-field', field)
    tableHeadRow.appendChild(fieldEl)
    fieldEl.appendChild(fieldElInput)

    let controls = document.createElement('div')
    controls.className = 'controls'
    controls.setAttribute('data-field', field)

    let deleteControl = document.createElement('button')
    deleteControl.className = 'delete btn btn-danger'
    deleteControl.innerHTML = 'Delete'
    controls.appendChild(deleteControl)

    let searchControl = document.createElement('input')
    searchControl.className= 'search form-control'
    searchControl.placeholder = 'Search'
    let replaceControl = document.createElement('input')
    replaceControl.className= 'replace form-control'
    replaceControl.placeholder = 'Replace'
    controls.appendChild(searchControl)
    controls.appendChild(replaceControl)

    let prevControl = document.createElement('button')
    prevControl.className = 'icon btn btn-light'
    prevControl.innerHTML = '◀'
    let nextControl = document.createElement('button')
    nextControl.className = 'icon btn btn-light'
    nextControl.innerHTML = '▶'
    controls.appendChild(prevControl)
    controls.appendChild(nextControl)

    fieldEl.appendChild(controls)

    // binds
    searchControl.addEventListener('keyup', (e)=>{
      this.searchAction(e.target.parentElement.getAttribute('data-field'), e.target.value)
    })
    searchControl.addEventListener('focus', (e)=>{
      this.searchAction(e.target.parentElement.getAttribute('data-field'), e.target.value)
    })
    searchControl.addEventListener('blur', ()=>{this.clearSearchAction()})

    replaceControl.addEventListener('focus', (e)=>{
      this.searchAction(e.target.parentElement.getAttribute('data-field'), e.target.parentElement.querySelector('.search').value)
    })
    replaceControl.addEventListener('blur', ()=>{this.clearSearchAction()})
    replaceControl.addEventListener('keyup', (e)=>{
      if(e.key == 'Enter') this.replaceAction(e.target.parentElement.getAttribute('data-field'), e.target.parentElement.querySelector('.search').value, e.target.value)
    })

    prevControl.addEventListener('click', (e)=>{
      this.prevAction(e.target.parentElement.getAttribute('data-field'))
    })
    nextControl.addEventListener('click', (e)=>{
      this.nextAction(e.target.parentElement.getAttribute('data-field'))
    })

    deleteControl.addEventListener('click', (e)=>{ this.deleteAction(e.target.parentElement.getAttribute('data-field')) })

    fieldElInput.addEventListener('keyup', (e)=>{
      if(e.key == 'Enter') e.target.blur()
    })
    fieldElInput.addEventListener('blur', (e)=>{
      e.target.classList.remove('is-invalid')
      if(!this.fields.includes(e.target.value)) {
        this.renameField(e.target.getAttribute('data-field'), e.target.value)
        fieldElInput.setAttribute('data-field', e.target.value)
        fieldElInput.parentElement.querySelector('.controls').setAttribute('data-field', e.target.value)
      }
      else if(e.target.getAttribute('data-field') != e.target.value) {
        e.target.classList.add('is-invalid')
      }
    })
  }

  deleteAction(fieldName){
    let tableHeadRow = document.querySelector('.tabler thead tr')
    let tableBody = document.querySelector('.tabler tbody')
    let i = this.fields.indexOf(fieldName)
    this.deleteField(fieldName)
    let headField = tableHeadRow.children[i]
    headField.remove()
    let children = [].slice.call(tableBody.children)
    children.map(child =>{
      let field = child.children[i]
      field.remove()
    })
  }
  searchAction(fieldName, value){
    let tableBody = document.querySelector('.tabler tbody')
    if(!value.length) {
      this.clearSearchAction()
      return false
    }
    let rows = [].slice.call(tableBody.children)
    let i = this.fields.indexOf(fieldName)
    rows.map(row=>{
      let field = row.children[i]
      let fieldInput = field.children[0]
      let match = fieldInput.value.match(new RegExp(value))
      field.classList.remove('match')
      if(match) {
        field.classList.add('match')
      }
    })
  }
  clearSearchAction(){
    let searchField = [].slice.call(document.querySelectorAll('.match'))
    searchField.map(field => field.classList.remove('match'))
  }
  replaceAction(field, regex, value){
    this.replaceValues(field, regex, value)
    this.reloadTable()
  }
  // controls
  prevAction(field){
    let tableHeadRow = document.querySelector('.tabler thead tr')
    let i = this.fields.indexOf(field)
    let fieldEl = tableHeadRow.children[i]
    let prevIndex = ( i - 1 > 0)? i - 1 :0;
    this.fields.splice(i, 1)
    this.fields.splice(prevIndex, 0, field)
    tableHeadRow.insertBefore( fieldEl, tableHeadRow.children[prevIndex])
    this.reloadTable()
  }
  nextAction(field){
    let tableHeadRow = document.querySelector('.tabler thead tr')
    let i = this.fields.indexOf(field)
    let fieldEl = tableHeadRow.children[i]
    let nextIndex = ( i + 1 < this.fields.length)? i + 1 : i;
    this.fields.splice(i, 1)
    this.fields.splice(nextIndex, 0, field)
    tableHeadRow.insertBefore( fieldEl, tableHeadRow.children[nextIndex+1])
    this.reloadTable()
  }
  // html controls
  reloadTable(){
    this.clearTable()
    this.loadRows()
  }
  clearTable(){
    let tbody = document.querySelector('table.tabler tbody')
    if(tbody) tbody.innerHTML = ''
  }
  loadRows(offset, limit){
    this.clearTable()
    this.config.offset = ( offset )? parseInt(offset) : this.config.offset
    this.config.limit = ( limit )? parseInt(limit) : this.config.limit
    console.log(this.config.limit, this.config.offset)
    for(var i = this.config.offset; i < this.config.offset + this.config.limit; i++){
      if(i > 0 && i < this.rows.length) this.appendRow(i)
    }

  }
  appendRow(i){
    var row = this.rows[i]
    var rowEl = document.createElement('tr')
    let tbody = document.querySelector('table.tabler tbody')
    rowEl.setAttribute('data-row', i)
    tbody.appendChild(rowEl)

    this.fields.map(field => {
      let fieldEl = document.createElement('td')
      let fieldElInput = document.createElement('input')
      fieldElInput.classList.add('form-control')
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
  }

  // exports
  csv(){
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
  json(){
    return JSON.stringify(this.rows)
  }
}
