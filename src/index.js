import InputFileReader from 'input-file-reader'
import TableUtil from 'table-util'
import Tabler from './tabler.js'

document.addEventListener('DOMContentLoaded', ()=>{

  new InputFileReader({
    input: inputFile
  })
  .onFileSelect(()=>{
    progressBar.classList.remove('invisible')
  })
  .onProgress((state)=>{
    progressBar.children[0].style.width = state.percent
    progressBar.children[0].innerHTML = state.percent
  })
  .onLoaded((fileContent)=>{
    progressBar.classList.add('invisible')

    let tabler = new Tabler({
      data: fileContent
    })

    // FILE INFOS
    let getfilesize = (size)=>{
      let filesize = size + 'o'
      if((size+'').length > 3) filesize = Math.round(size / 100) / 10 + 'ko'
      if((size+'').length > 6) filesize = Math.round(size / 100000) / 10 + 'mo'
      if((size+'').length > 9) filesize = Math.round(size / 100000000) / 10 + 'go'
      return filesize;
    }
    let currentFile = inputFile.files[inputFile.files.length-1]
    fileName.innerHTML = currentFile.name
    fileSize.innerHTML = '('+getfilesize(currentFile.size)+')'
    rowCount.innerHTML = tabler.rows.length + ' rows'

    // EXPORTS
    exports.innerHTML = ''
    let exportCSV = document.createElement('button')
    exportCSV.className="btn btn-primary m-2"
    exportCSV.innerHTML = '.csv'
    exportCSV.addEventListener('click', ()=>{
      console.log(tabler.export())
    })
    exports.appendChild(exportCSV)

    let exportJson = document.createElement('button')
    exportJson.className="btn btn-primary m-2"
    exportJson.innerHTML = '.json'
    exportJson.addEventListener('click', ()=>{
      console.log(tabler.json())
    })
    exports.appendChild(exportJson)

    // GLOBAL CONTROLS
    offset.value = tabler.config.offset
    limit.value = tabler.config.limit
    offset.addEventListener('keyup', (e)=>{
      if(e.key != 'Enter') return false;
      tabler.clearTable()
      tabler.loadRows(offset.value, limit.value)
    })
    limit.addEventListener('keyup', (e)=>{
      if(e.key != 'Enter') return false;
      tabler.clearTable()
      tabler.loadRows(offset.value, limit.value)
    })
    prev.addEventListener('click', ()=>{
      let offsetValue = parseInt(offset.value)
      let limitValue = parseInt(limit.value)
      if(offsetValue - limitValue >= 0) offset.value = offsetValue - limitValue
      tabler.clearTable()
      tabler.loadRows(offset.value, limit.value)
    })
    next.addEventListener('click', ()=>{
      let offsetValue = parseInt(offset.value)
      let limitValue = parseInt(limit.value)
      if(offsetValue + limitValue < tabler.rows.length) offset.value = offsetValue + limitValue
      tabler.clearTable()
      tabler.loadRows(offsetValue, limitValue)
    })

    // HTML TABLE RENDER
    let table = tabler.htmlController()
    htmlArrayResult.innerHTML = ''
    htmlArrayResult.appendChild(table)
    tabler.loadRows()

    display.classList.remove('invisible')
  })



})
