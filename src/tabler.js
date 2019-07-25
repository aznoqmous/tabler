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
    let textContents = this.config.data.match(new RegExp(';'+this.config.textDelimiter+'[^;]*\n.*?'+this.config.textDelimiter+';', 'g'))
    if(textContents) textContents.map( textContent => {
      console.log(textContent)
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

  renameField(oldFieldName, newFieldName){
    let i = this.fields.indexOf(oldFieldName)
    this.fields[i] = newFieldName
    this.rows.map(row => {
      row[newFieldName] = row[oldFieldName]
      delete row[oldFieldName]
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
      if(row[field]) row[field] = row[field].replace(regex, value)
    })
  }

  // html table generator
  htmlController(){
      let table = document.createElement('table')
      table.className = "table tabler"
      var tableHead = document.createElement('thead')
      var tableHeadRow = document.createElement('tr')
      table.appendChild(tableHead)
      tableHead.appendChild(tableHeadRow)
      var tableBody = document.createElement('tbody')
      table.appendChild(tableBody)

      // HEADERS
      this.fields.map(field =>{
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

        fieldEl.appendChild(controls)

        // controls
        let deleteField = (fieldName)=>{
          let r = confirm('Are you sure you want to delete ' + fieldName + ' field  ?')
          if(r) {
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
        }
        let search = (fieldName, value)=>{
          if(!value.length) {
            clearSearch()
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
        let clearSearch = ()=>{
          let searchField = [].slice.call(document.querySelectorAll('.match'))
          searchField.map(field => field.classList.remove('match'))
        }
        let replace = (field, regex, value)=>{
          this.replaceValues(field, new RegExp(regex), value)
          this.reloadTable()
        }

        // binds
        searchControl.addEventListener('keyup', (e)=>{
          search(e.target.parentElement.getAttribute('data-field'), e.target.value)
        })
        searchControl.addEventListener('focus', (e)=>{
          search(e.target.parentElement.getAttribute('data-field'), e.target.value)
        })
        searchControl.addEventListener('blur', clearSearch)

        replaceControl.addEventListener('focus', (e)=>{
          search(e.target.parentElement.getAttribute('data-field'), e.target.parentElement.querySelector('.search').value)
        })
        replaceControl.addEventListener('blur', clearSearch)
        replaceControl.addEventListener('keyup', (e)=>{
          if(e.key == 'Enter') replace(e.target.parentElement.getAttribute('data-field'), e.target.parentElement.querySelector('.search').value, e.target.value)
        })

        deleteControl.addEventListener('click', (e)=>{ deleteField(e.target.parentElement.getAttribute('data-field')) })
        fieldElInput.addEventListener('keyup', (e)=>{
          if(e.key == 'Enter') e.target.blur()
          if(e.key == 'Backspace' && e.target.value == '') {
            deleteField(e.target.getAttribute('data-field'))
          }
        })

        fieldElInput.addEventListener('blur', (e)=>{
          e.target.classList.remove('is-invalid')
          if(!this.fields.includes(e.target.value)) {
            this.renameField(e.target.getAttribute('data-field'), e.target.value)
          }
          else if(e.target.getAttribute('data-field') != e.target.value) {
            e.target.classList.add('is-invalid')
          }
        })

      })


      return table;
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
    console.log(offset, limit)
    offset = parseInt(offset) || 0
    limit = parseInt(limit) || this.config.limit
    for(var i = offset; i < offset + limit; i++){
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

  json(){
    return JSON.stringify(this.rows)
  }
}
