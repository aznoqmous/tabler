/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/input-file-reader/src/input-file-reader.js":
/*!*****************************************************************!*\
  !*** ./node_modules/input-file-reader/src/input-file-reader.js ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return InputFileReader; });\nclass InputFileReader{\r\n  constructor(config){\r\n    this.config = Object.assign({\r\n      input: null, // must be declared on class instantiation\r\n      decimals: 0,\r\n\r\n      // callbacks\r\n      onFileSelect: null,\r\n      onProgress: null,\r\n      onLoaded: null\r\n    }, config)\r\n\r\n    this.bind()\r\n  }\r\n\r\n  bind(){\r\n    if(!this.config.input) console.warn('no input !')\r\n    this.config.input.addEventListener('change', (e)=>{\r\n      if(e.target.files.length) {\r\n        this.handleFileSelect(e.target.files[e.target.files.length-1])\r\n      }\r\n    })\r\n  }\r\n\r\n  handleFileSelect(f){\r\n    if(this.config.onFileSelect) this.config.onFileSelect(f)\r\n    this.readFile(f)\r\n  }\r\n\r\n  readFile(file){\r\n    let reader = new FileReader()\r\n    reader.onprogress = (e)=>{\r\n      if(this.config.onProgress) this.config.onProgress({\r\n        loaded: e.loaded,\r\n        total: e.total,\r\n        percent: Math.floor(e.loaded / e.total * Math.pow(10, this.config.decimals + 2) ) * 100 / Math.pow(10, this.config.decimals + 2) + '%'\r\n      })\r\n    }\r\n    reader.onloadend = (e)=>{\r\n      if (e.target.readyState == FileReader.DONE) {\r\n        if(this.config.onLoaded) this.config.onLoaded(e.srcElement.result)\r\n      }\r\n    }\r\n    reader.readAsBinaryString(file)\r\n  }\r\n\r\n\r\n  onFileSelect(callback){\r\n    this.config.onFileSelect = callback\r\n    return this\r\n  }\r\n  onProgress(callback){\r\n    this.config.onProgress = callback\r\n    return this\r\n  }\r\n  onLoaded(callback){\r\n    this.config.onLoaded = callback\r\n    return this\r\n  }\r\n\r\n}\r\n\n\n//# sourceURL=webpack:///./node_modules/input-file-reader/src/input-file-reader.js?");

/***/ }),

/***/ "./node_modules/table-util/src/table-util.js":
/*!***************************************************!*\
  !*** ./node_modules/table-util/src/table-util.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return TableUtil; });\n/**\r\n* TableUtil\r\n* Provide quick search + filters to ur tables\r\n*\r\n* <!> Please follow the html5 table structure <!>\r\n* table\r\n*\r\n*   thead --> filter / heading row\r\n*     tr --> filter / heading row\r\n*       th --> each filter / heading\r\n*\r\n*   tbody --> elements container\r\n*     tr --> each element\r\n*       td --> each element prop\r\n*\r\n*/\r\nclass TableUtil{\r\n  \r\n  constructor(config){\r\n    if(!document.body) {\r\n      document.addEventListener('DOMContentLoaded', ()=> this.init(config))\r\n    }else{\r\n      this.init(config)\r\n    }\r\n  }\r\n\r\n  init(config){\r\n\r\n    this.config = Object.assign({\r\n\r\n      table: document.getElementsByTagName('table')[0],\r\n\r\n      activeClass: 'table-search-active',\r\n      filterClass: 'table-search-filter',\r\n      activeFilterClass: 'table-search-filter-active',\r\n      reversedFilterClass: 'table-search-filter-reversed',\r\n\r\n      // true will take all table th\r\n      // u can also provide a class name if u want\r\n      filters: true,\r\n      search: true,\r\n      // sort attribute can be used in order to replace the default value used for sorting (default: element.innerText)\r\n      sortAttribute: \"data-sort\",\r\n\r\n      noResultText: \"<em>Aucuns résultats</em>\"\r\n\r\n    }, config)\r\n    this.build( this.config.element || this.config.table )\r\n    this.bind()\r\n  }\r\n\r\n  build(el){\r\n    this.table = el;\r\n    this.tbody = this.table.getElementsByTagName('tbody')[0]\r\n    this.els = [].slice.call(this.tbody.children)\r\n\r\n    if(this.config.search) {\r\n      this.search = document.createElement('input')\r\n      this.search.className = \"table-search\"\r\n      this.search.placeholder = 'Rechercher...'\r\n      this.table.parentElement.insertBefore(this.search, this.table)\r\n    }\r\n\r\n    this.noResultRow = document.createElement('tr')\r\n    this.noResultRow.className = \"no-results hidden\"\r\n    this.tbody.appendChild(this.noResultRow)\r\n    this.noResultRow.innerHTML = this.config.noResultText\r\n\r\n    if( this.config.filters ){\r\n\r\n      let defaultFilters = [].slice.call( this.table.getElementsByTagName('th') )\r\n      if( this.config.filters === true) this.filters = defaultFilters\r\n      else {\r\n        this.filters = [].slice.call( this.table.getElementsByClassName(this.config.filters) )\r\n      }\r\n\r\n      // set filters index\r\n      defaultFilters.map((df, i)=>{\r\n        this.filters.map((f)=>{\r\n          if(f == df) f.index = i;\r\n        })\r\n      })\r\n\r\n      this.filters.map((filter)=>{\r\n        filter.classList.add(this.config.filterClass)\r\n      })\r\n\r\n    }\r\n\r\n  }\r\n\r\n  bind(){\r\n    if(this.search) this.search.addEventListener('keyup', ()=>{\r\n      this.hideEls(this.els)\r\n      this.searchEls(this.search.value)\r\n    })\r\n\r\n\r\n    this.filters.map((filter)=>{\r\n      filter.addEventListener('click', ()=>{\r\n\r\n        this.cleanFilters()\r\n\r\n        if( this.activeFilter == filter.index ) filter.classList.add(this.config.reversedFilterClass)\r\n        filter.classList.add(this.config.activeFilterClass)\r\n\r\n        this.sort(filter.index, (this.activeFilter == filter.index))\r\n\r\n      })\r\n    })\r\n  }\r\n\r\n  refreshEls(){\r\n    this.clearEls()\r\n    this.appendEls()\r\n  }\r\n  appendEls(){\r\n    this.els.map((el)=>{\r\n      this.tbody.appendChild(el)\r\n    })\r\n  }\r\n  clearEls(){\r\n    this.tbody.innerHTML = ''\r\n  }\r\n  hideEls(){\r\n    this.cleanEls()\r\n    this.els.map(el => el.classList.add('hidden') )\r\n  }\r\n  searchEls(value){\r\n\r\n    value = value.toUpperCase()\r\n    let noResults = true\r\n\r\n    this.els.map( el => {\r\n\r\n      let content = '-' + el.innerText.toUpperCase() + '-'\r\n      if( content.split(value).length > 1 ) {\r\n\r\n        noResults = false\r\n        el.classList.remove('hidden')\r\n\r\n        if(value.length && el.children.length){\r\n          let children = [].slice.call(el.children)\r\n          children.map((child)=>{\r\n            let content = '-' + child.innerText.toUpperCase() + '-'\r\n            if( content.split(value).length > 1 ){\r\n              child.classList.add( this.config.activeClass )\r\n            }\r\n          })\r\n        }\r\n      }\r\n    })\r\n\r\n    if ( noResults ) this.noResultRow.classList.remove('hidden')\r\n    else this.noResultRow.classList.add('hidden')\r\n  }\r\n\r\n  cleanEls(){\r\n    let els = document.getElementsByClassName(this.config.activeClass)\r\n    if(els.length){\r\n      [].slice.call(els).map((el)=>{\r\n        el.classList.remove(this.config.activeClass)\r\n      })\r\n    }\r\n  }\r\n  cleanFilters(){\r\n    this.filters.map((filter)=>{\r\n      filter.classList.remove(this.config.activeFilterClass)\r\n      filter.classList.remove(this.config.reversedFilterClass)\r\n    })\r\n  }\r\n\r\n  sort(i, isReverse){\r\n    this.activeFilter = isReverse ? -1 : i;\r\n    let factor = 1\r\n    if(isReverse) factor = -1\r\n\r\n    this.els.sort((a, b)=>{\r\n      let asort = a.children[i].getAttribute(this.config.sortAttribute) || a.children[i].innerText\r\n      let bsort = b.children[i].getAttribute(this.config.sortAttribute) || b.children[i].innerText\r\n      if( asort > bsort ) return factor;\r\n      else if( asort < bsort ) return -factor;\r\n      return 0;\r\n    })\r\n\r\n    this.refreshEls()\r\n  }\r\n}\r\n\n\n//# sourceURL=webpack:///./node_modules/table-util/src/table-util.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var input_file_reader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! input-file-reader */ \"./node_modules/input-file-reader/src/input-file-reader.js\");\n/* harmony import */ var table_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! table-util */ \"./node_modules/table-util/src/table-util.js\");\n/* harmony import */ var _tabler_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tabler.js */ \"./src/tabler.js\");\n\r\n\r\n\r\n\r\ndocument.addEventListener('DOMContentLoaded', ()=>{\r\n\r\n  new input_file_reader__WEBPACK_IMPORTED_MODULE_0__[\"default\"]({\r\n    input: inputFile\r\n  })\r\n  .onLoaded((fileContent)=>{\r\n\r\n    let tabler = new _tabler_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"]({\r\n      data: fileContent\r\n    })\r\n\r\n    htmlArrayResult.innerHTML = ''\r\n\r\n    let exportBtn = document.createElement('button')\r\n    exportBtn.className=\"btn btn-primary\"\r\n    exportBtn.innerHTML = 'Export .csv'\r\n    exportBtn.addEventListener('click', ()=>{\r\n      console.log(tabler.export())\r\n    })\r\n    htmlArrayResult.appendChild(exportBtn)\r\n\r\n    let table = tabler.htmlArray()\r\n    htmlArrayResult.appendChild(table)\r\n\r\n    new table_util__WEBPACK_IMPORTED_MODULE_1__[\"default\"]({ table: table, search: false })\r\n\r\n  })\r\n\r\n})\r\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/tabler.js":
/*!***********************!*\
  !*** ./src/tabler.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Tabler; });\nclass Tabler{\r\n  constructor(config){\r\n    this.config = Object.assign({\r\n      data: null, // must be provided (raw .csv content)\r\n      eol: '\\n',\r\n      separator: ';',\r\n      isFirstLineFieldName: true\r\n\r\n    }, config)\r\n    this.init()\r\n    this.do()\r\n  }\r\n\r\n  init(){\r\n    this.fields = []\r\n    this.rows = []\r\n  }\r\n\r\n  do(){\r\n    if(this.config.isFirstLineFieldName) this.getFields()\r\n    this.getRows()\r\n  }\r\n\r\n  getFields(){\r\n    let firstLine = this.config.data.split(this.config.eol)[0]\r\n    this.fieldLine = firstLine\r\n    this.fields = this.fieldLine.split(this.config.separator)\r\n\r\n    let fields = []\r\n    this.fields.map(field => {\r\n      if(field == '') field = '_'\r\n      if(fields.includes(field)){\r\n        field += '('+fields.join('').split(field).length+')'\r\n      }\r\n      fields.push(field)\r\n    })\r\n    this.fields = fields\r\n  }\r\n  getRows(){\r\n    let rows = this.config.data.split(this.config.eol)\r\n    rows.map( row => {\r\n      if(row != this.fieldLine) this.addRow(row)\r\n    } )\r\n  }\r\n  addRow(row){\r\n    let values = row.split(this.config.separator)\r\n    let newRow = {}\r\n    this.fields.map( (field, i) => newRow[field] = values[i] )\r\n    this.rows.push(newRow)\r\n  }\r\n\r\n  json(){\r\n    return JSON.stringify(this.rows)\r\n  }\r\n  htmlArray(){\r\n      let table = document.createElement('table')\r\n      table.className = \"table\"\r\n      var tableHead = document.createElement('thead')\r\n      var tableHeadRow = document.createElement('tr')\r\n      table.appendChild(tableHead)\r\n      tableHead.appendChild(tableHeadRow)\r\n      this.fields.map(field =>{\r\n        let fieldEl = document.createElement('th')\r\n        fieldEl.innerHTML = field\r\n        tableHeadRow.appendChild(fieldEl)\r\n      })\r\n      var tableBody = document.createElement('tbody')\r\n      table.appendChild(tableBody)\r\n      this.rows.map((row, i) => {\r\n        var rowEl = document.createElement('tr')\r\n        rowEl.setAttribute('data-row', i)\r\n        tableBody.appendChild(rowEl)\r\n\r\n        this.fields.map(field => {\r\n          let fieldEl = document.createElement('td')\r\n          let fieldElInput = document.createElement('input')\r\n          fieldElInput.value = row[field]\r\n          fieldElInput.setAttribute('data-field', field)\r\n          rowEl.appendChild(fieldEl)\r\n          fieldEl.appendChild(fieldElInput)\r\n          fieldElInput.addEventListener('keyup', (e)=>{\r\n            let index = e.target.parentElement.parentElement.getAttribute('data-row')\r\n            let field = e.target.getAttribute('data-field')\r\n            this.rows[index][field] = e.target.value\r\n          })\r\n        })\r\n      })\r\n      return table;\r\n  }\r\n\r\n  export(){\r\n    let csv = '';\r\n    this.fields.map((field, i)=>{\r\n      csv += field\r\n      if(i < this.fields.length - 1) csv += this.config.separator\r\n    })\r\n    csv += this.config.eol\r\n    this.rows.map(row=>{\r\n      this.fields.map((field, i) =>{\r\n        csv += row[field]\r\n        if(i < this.fields.length - 1) csv += this.config.separator\r\n      })\r\n      csv += this.config.eol\r\n    })\r\n    return csv\r\n  }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/tabler.js?");

/***/ })

/******/ });