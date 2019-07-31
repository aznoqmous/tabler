import InputFileReader from 'input-file-reader'
import Req from 'req'
import TableUtil from 'table-util'
import Tabler from './tabler.js'

document.addEventListener('DOMContentLoaded', ()=>{

  let fileReader = new InputFileReader({
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
    window.t = tabler

    // FILE INFOS
    let getfilesize = (size)=>{
      let filesize = size + 'o'
      if((size+'').length > 3) filesize = Math.round(size / 100) / 10 + 'ko'
      if((size+'').length > 6) filesize = Math.round(size / 100000) / 10 + 'mo'
      if((size+'').length > 9) filesize = Math.round(size / 100000000) / 10 + 'go'
      return filesize;
    }
    var currentFile = inputFile.files[inputFile.files.length-1]
    fileName.innerHTML = currentFile.name
    fileSize.innerHTML = '('+getfilesize(currentFile.size)+')'
    rowCount.innerHTML = tabler.rows.length + ' rows'
    separator.innerHTML = JSON.stringify(tabler.config.separator)
    endOfLine.innerHTML = JSON.stringify(tabler.config.eol)

    // EXPORTS
    exports.innerHTML = ''
    let exportCSV = document.createElement('button')
    exportCSV.className="btn btn-primary m-2"
    exportCSV.innerHTML = '.csv'
    let buildCSV = new Req({url: "services/buildCSV.php", method: "POST" })
    exportCSV.addEventListener('click', ()=>{
      buildCSV.do({data: tabler.csv(), filename: currentFile.name})
      .then((res)=>{
        downloads.innerHTML += `<a href="${res.json}">Télécharger</a>`
      })
      .catch((err)=>{
        console.warn(err)
      })
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
    displayRowsAction()
    function displayRowsAction(){
      displayRows.innerHTML = `${tabler.config.offset}-${tabler.config.offset+tabler.config.limit}/${tabler.rows.length}`
    }
    offset.addEventListener('keyup', (e)=>{
      if(e.key != 'Enter') return false;
      tabler.clearTable()
      tabler.loadRows(offset.value, limit.value)
      displayRowsAction()
    })
    limit.addEventListener('keyup', (e)=>{
      if(e.key != 'Enter') return false;
      tabler.clearTable()
      tabler.loadRows(offset.value, limit.value)
      displayRowsAction()
    })
    prev.addEventListener('click', ()=>{
      let offsetValue = parseInt(offset.value)
      let limitValue = parseInt(limit.value)
      if(offsetValue - limitValue > 0) offset.value = offsetValue - limitValue
      else offset.value = 0
      tabler.loadRows(offset.value, limit.value)
      displayRowsAction()
    })
    next.addEventListener('click', ()=>{
      let offsetValue = parseInt(offset.value)
      let limitValue = parseInt(limit.value)
      if(offsetValue + limitValue < tabler.rows.length) offset.value = offsetValue + limitValue
      else offset.value = tabler.rows.length - limitValue
      tabler.clearTable()
      tabler.loadRows(offset.value, limit.value)
      displayRowsAction()
    })
    newFields.addEventListener('keyup', (e)=>{
      if(e.key == 'Enter') {
        let separator = tabler.guessSeparator(e.target.value)
        let fields = e.target.value.split(separator)
        fields.map(field=>{
          if(!field.length) field = 'New Field ' + (tabler.fields.length + 1)
          if(tabler.fields.includes(field)) return false;
          tabler.addField(field)
          tabler.bindField(field)
          tabler.reloadTable()
        })
        e.target.value = ''
      }
    })

    // HTML TABLE RENDER
    tabler.htmlController(htmlArrayResult)

    display.classList.remove('invisible')
  })



})
