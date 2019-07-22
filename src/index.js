import InputFileReader from 'input-file-reader'
import TableUtil from 'table-util'
import Tabler from './tabler.js'

document.addEventListener('DOMContentLoaded', ()=>{

  new InputFileReader({
    input: inputFile
  })
  .onLoaded((fileContent)=>{

    let tabler = new Tabler({
      data: fileContent
    })

    htmlArrayResult.innerHTML = ''

    let exportBtn = document.createElement('button')
    exportBtn.className="btn btn-primary"
    exportBtn.innerHTML = 'Export .csv'
    exportBtn.addEventListener('click', ()=>{
      console.log(tabler.export())
    })
    htmlArrayResult.appendChild(exportBtn)

    let table = tabler.htmlArray()
    htmlArrayResult.appendChild(table)

    new TableUtil({ table: table, search: false })

  })

})
