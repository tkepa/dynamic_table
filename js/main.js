!function(n){var c={};function t(e){if(c[e])return c[e].exports;var l=c[e]={i:e,l:!1,exports:{}};return n[e].call(l.exports,l,l.exports,t),l.l=!0,l.exports}t.m=n,t.c=c,t.d=function(n,c,e){t.o(n,c)||Object.defineProperty(n,c,{enumerable:!0,get:e})},t.r=function(n){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})},t.t=function(n,c){if(1&c&&(n=t(n)),8&c)return n;if(4&c&&"object"==typeof n&&n&&n.__esModule)return n;var e=Object.create(null);if(t.r(e),Object.defineProperty(e,"default",{enumerable:!0,value:n}),2&c&&"string"!=typeof n)for(var l in n)t.d(e,l,function(c){return n[c]}.bind(null,l));return e},t.n=function(n){var c=n&&n.__esModule?function(){return n.default}:function(){return n};return t.d(c,"a",c),c},t.o=function(n,c){return Object.prototype.hasOwnProperty.call(n,c)},t.p="",t(t.s=0)}([function(module,exports,__webpack_require__){"use strict";eval('\r\n\r\n// service worker registration - remove if you\'re not going to use it\r\n\r\nif (\'serviceWorker\' in navigator) {\r\n  window.addEventListener(\'load\', function() {\r\n    navigator.serviceWorker.register(\'serviceworker.js\').then(function(registration) {\r\n      // Registration was successful\r\n      console.log(\'ServiceWorker registration successful with scope: \', registration.scope);\r\n    }, function(err) {\r\n      // registration failed :(\r\n      console.log(\'ServiceWorker registration failed: \', err);\r\n    });\r\n  });\r\n}\r\n\r\n// place your code below\r\nconst tableBody = document.querySelector(".table__body--js");\r\nlet todayDate = new Date();\r\nlet lastMonthDate = newDate(todayDate);\r\n\r\n\r\nconst totalIncome = (incomes) => incomes.reduce((acc,income) => acc + income);\r\n\r\n//this function return year-month date(getYearAndMonth)\r\nfunction newDate(todayDate) {\r\n  todayDate.setDate(1);\r\n  todayDate.setMonth(todayDate.getMonth() - 1);\r\n  return new Date(todayDate).toISOString().slice(0,7);\r\n}\r\n\r\nfunction lastMonthIncomeDate(incomes) {\r\n  let lastMonth = incomes.filter(income => {\r\n    const incomeDate = income.date.slice(0,7);\r\n    if (incomeDate === lastMonthDate) {\r\n      return true;\r\n    }\r\n    else {\r\n      return false;\r\n    }\r\n  })\r\n  return lastMonth;\r\n};\r\n\r\nfunction lastMonthIncomes(incomes) {\r\n  let lastMonth = lastMonthIncomeDate(incomes);\r\n  lastMonth = lastMonth.map(el => el.value);\r\n  if (lastMonth.length > 0) {\r\n    lastMonth = lastMonth.reduce((a, b) => {\r\n      return parseFloat(a) + parseFloat(b)\r\n    })\r\n  } \r\n  else {\r\n    lastMonth = 0;\r\n  }\r\n  return lastMonth;\r\n}\r\n\r\n\r\nasync function companny (comp, companiesArray) {\r\n  let companyIncomes = await fetch(`https://recruitment.hal.skygate.io/incomes/${comp.id}`);\r\n  companyIncomes = await companyIncomes.json();\r\n  companyIncomes = companyIncomes.incomes;\r\n  const companyIncome = companyIncomes.map(comp => parseFloat(comp.value));\r\n\r\n  const total = "" + Number(totalIncome(companyIncome)).toFixed(2);\r\n  const average = "" + Number(total/(companyIncome.length + 1)).toFixed(2);\r\n  const monthIncome = "" + Number(lastMonthIncomes(companyIncomes)).toFixed(2);\r\n\r\n  const companyObj = {\r\n    ...comp, \r\n    "totalIncome" : total, \r\n    "averageIncome" : average, \r\n    monthIncome\r\n  };\r\n\r\n  companiesArray.push(companyObj);\r\n}\r\n\r\nasync function getCompaniesList() {\r\n  let company = await fetch("https://recruitment.hal.skygate.io/companies");\r\n  company = await company.json();\r\n  const companiesArray = [];\r\n  \r\n  await Promise.all(company.map(comp => {\r\n    return companny(comp, companiesArray);\r\n  }));\r\n\r\n  \r\n  \r\n  return companiesArray;\r\n  \r\n  \r\n \r\n}\r\n\r\nasync function renderTable() {\r\n  const companiesList = await getCompaniesList();\r\n  let tableInnerHtml = "";\r\n\r\n  for (const company of companiesList) {\r\n    const {id, name, city, totalIncome, averageIncome, monthIncome} = company;\r\n    tableInnerHtml += `\r\n       <tr>\r\n          <td>${id}</td>\r\n          <td>${name}</td>\r\n          <td>${city}</td>\r\n          <td>${totalIncome}</td>\r\n          <td>${averageIncome}</td>\r\n          <td>${monthIncome}</td>\r\n        </tr>\r\n      `;\r\n  }\r\n\r\n  tableBody.innerHTML = tableInnerHtml;\r\n\r\n}\r\n\r\n\r\n\r\n\r\n//TESTING FEW SOLUTION OF PAGINATION\r\n//getCellValue compare innerText and textContent if the table row is empty then it\'s pull data form textContent\r\nconst getCellValue = (tableRow, columnIndex) => (tableRow.children[columnIndex].innerText || tableRow.children[columnIndex].textContent);\r\n\r\nconst comparer = (columnIndex, sortAscending) => (a, b) => {\r\n  const v1 = getCellValue(sortAscending ? a : b, columnIndex);\r\n  const v2 = getCellValue(sortAscending ? b : a, columnIndex);\r\n  if (v1 === "" || v2 === "" || isNaN(v1) || isNaN(v2)) {\r\n    return v1.toString().localeCompare(v2);\r\n  }\r\n  return v1 - v2;\r\n};\r\n\r\nconst checkValue = (text) => (rows) => {\r\n  return Array.from(rows.children).some( (row) => {\r\n    const fieldValue = row.innerText.toLowerCase();\r\n    return (fieldValue.substring(0, text.length) === text);\r\n  });\r\n};\r\n    \r\n\r\n\r\nrenderTable().then( () => {\r\n\r\n  //Sorting table\r\n\r\n  const headers = Array.from(document.querySelectorAll(".header"));\r\n  const wholeTable = document.querySelector("table");\r\n  const tableQuery = wholeTable.querySelector(".table__body--js");\r\n  const tableRows = Array.from(wholeTable.querySelector("tbody").rows);\r\n\r\n  let ascOrDsc = false;\r\n\r\n  headers.forEach(th =>\r\n    th.addEventListener("click", e => {\r\n      ascOrDsc = !ascOrDsc;\r\n      const indexOfTh = Array.from(th.parentNode.children).indexOf(th);\r\n      tableRows\r\n        .sort(comparer(indexOfTh, ascOrDsc))\r\n        .forEach(tr => tableQuery.appendChild(tr));\r\n    })\r\n  );\r\n\r\n  //Search in table\r\n  \r\n  const inputQuery = document.querySelector(".input__field--js");\r\n  \r\n  \r\n  \r\n\r\n  inputQuery.addEventListener("keyup", e => {\r\n    const text = inputQuery.value.toLowerCase();\r\n    const tableQ = wholeTable.querySelector("tbody");\r\n    const tableBody = document.createElement(\'tbody\');\r\n    console.log(text);\r\n    tableRows.filter(checkValue(text)).forEach(row => {\r\n      tableBody.appendChild(row);\r\n    });\r\n    \r\n    \r\n\r\n    \r\n    wholeTable.replaceChild(tableBody, tableQ);\r\n    \r\n    \r\n  })\r\n  \r\n})\r\n\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvanMvbWFpbi5qcz85MjkxIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFhOztBQUViOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0EsaUZBQWlGLFFBQVE7QUFDekY7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7OztBQUlIOzs7O0FBSUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsV0FBVyx3REFBd0Q7QUFDbkU7QUFDQTtBQUNBLGdCQUFnQixHQUFHO0FBQ25CLGdCQUFnQixLQUFLO0FBQ3JCLGdCQUFnQixLQUFLO0FBQ3JCLGdCQUFnQixZQUFZO0FBQzVCLGdCQUFnQixjQUFjO0FBQzlCLGdCQUFnQixZQUFZO0FBQzVCO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7OztBQUlBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBOztBQUVBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7Ozs7QUFLTDs7O0FBR0EsR0FBRzs7QUFFSCxDQUFDIiwiZmlsZSI6IjAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuXHJcbi8vIHNlcnZpY2Ugd29ya2VyIHJlZ2lzdHJhdGlvbiAtIHJlbW92ZSBpZiB5b3UncmUgbm90IGdvaW5nIHRvIHVzZSBpdFxyXG5cclxuaWYgKCdzZXJ2aWNlV29ya2VyJyBpbiBuYXZpZ2F0b3IpIHtcclxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoJ3NlcnZpY2V3b3JrZXIuanMnKS50aGVuKGZ1bmN0aW9uKHJlZ2lzdHJhdGlvbikge1xyXG4gICAgICAvLyBSZWdpc3RyYXRpb24gd2FzIHN1Y2Nlc3NmdWxcclxuICAgICAgY29uc29sZS5sb2coJ1NlcnZpY2VXb3JrZXIgcmVnaXN0cmF0aW9uIHN1Y2Nlc3NmdWwgd2l0aCBzY29wZTogJywgcmVnaXN0cmF0aW9uLnNjb3BlKTtcclxuICAgIH0sIGZ1bmN0aW9uKGVycikge1xyXG4gICAgICAvLyByZWdpc3RyYXRpb24gZmFpbGVkIDooXHJcbiAgICAgIGNvbnNvbGUubG9nKCdTZXJ2aWNlV29ya2VyIHJlZ2lzdHJhdGlvbiBmYWlsZWQ6ICcsIGVycik7XHJcbiAgICB9KTtcclxuICB9KTtcclxufVxyXG5cclxuLy8gcGxhY2UgeW91ciBjb2RlIGJlbG93XHJcbmNvbnN0IHRhYmxlQm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGFibGVfX2JvZHktLWpzXCIpO1xyXG5sZXQgdG9kYXlEYXRlID0gbmV3IERhdGUoKTtcclxubGV0IGxhc3RNb250aERhdGUgPSBuZXdEYXRlKHRvZGF5RGF0ZSk7XHJcblxyXG5cclxuY29uc3QgdG90YWxJbmNvbWUgPSAoaW5jb21lcykgPT4gaW5jb21lcy5yZWR1Y2UoKGFjYyxpbmNvbWUpID0+IGFjYyArIGluY29tZSk7XHJcblxyXG4vL3RoaXMgZnVuY3Rpb24gcmV0dXJuIHllYXItbW9udGggZGF0ZShnZXRZZWFyQW5kTW9udGgpXHJcbmZ1bmN0aW9uIG5ld0RhdGUodG9kYXlEYXRlKSB7XHJcbiAgdG9kYXlEYXRlLnNldERhdGUoMSk7XHJcbiAgdG9kYXlEYXRlLnNldE1vbnRoKHRvZGF5RGF0ZS5nZXRNb250aCgpIC0gMSk7XHJcbiAgcmV0dXJuIG5ldyBEYXRlKHRvZGF5RGF0ZSkudG9JU09TdHJpbmcoKS5zbGljZSgwLDcpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsYXN0TW9udGhJbmNvbWVEYXRlKGluY29tZXMpIHtcclxuICBsZXQgbGFzdE1vbnRoID0gaW5jb21lcy5maWx0ZXIoaW5jb21lID0+IHtcclxuICAgIGNvbnN0IGluY29tZURhdGUgPSBpbmNvbWUuZGF0ZS5zbGljZSgwLDcpO1xyXG4gICAgaWYgKGluY29tZURhdGUgPT09IGxhc3RNb250aERhdGUpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH0pXHJcbiAgcmV0dXJuIGxhc3RNb250aDtcclxufTtcclxuXHJcbmZ1bmN0aW9uIGxhc3RNb250aEluY29tZXMoaW5jb21lcykge1xyXG4gIGxldCBsYXN0TW9udGggPSBsYXN0TW9udGhJbmNvbWVEYXRlKGluY29tZXMpO1xyXG4gIGxhc3RNb250aCA9IGxhc3RNb250aC5tYXAoZWwgPT4gZWwudmFsdWUpO1xyXG4gIGlmIChsYXN0TW9udGgubGVuZ3RoID4gMCkge1xyXG4gICAgbGFzdE1vbnRoID0gbGFzdE1vbnRoLnJlZHVjZSgoYSwgYikgPT4ge1xyXG4gICAgICByZXR1cm4gcGFyc2VGbG9hdChhKSArIHBhcnNlRmxvYXQoYilcclxuICAgIH0pXHJcbiAgfSBcclxuICBlbHNlIHtcclxuICAgIGxhc3RNb250aCA9IDA7XHJcbiAgfVxyXG4gIHJldHVybiBsYXN0TW9udGg7XHJcbn1cclxuXHJcblxyXG5hc3luYyBmdW5jdGlvbiBjb21wYW5ueSAoY29tcCwgY29tcGFuaWVzQXJyYXkpIHtcclxuICBsZXQgY29tcGFueUluY29tZXMgPSBhd2FpdCBmZXRjaChgaHR0cHM6Ly9yZWNydWl0bWVudC5oYWwuc2t5Z2F0ZS5pby9pbmNvbWVzLyR7Y29tcC5pZH1gKTtcclxuICBjb21wYW55SW5jb21lcyA9IGF3YWl0IGNvbXBhbnlJbmNvbWVzLmpzb24oKTtcclxuICBjb21wYW55SW5jb21lcyA9IGNvbXBhbnlJbmNvbWVzLmluY29tZXM7XHJcbiAgY29uc3QgY29tcGFueUluY29tZSA9IGNvbXBhbnlJbmNvbWVzLm1hcChjb21wID0+IHBhcnNlRmxvYXQoY29tcC52YWx1ZSkpO1xyXG5cclxuICBjb25zdCB0b3RhbCA9IFwiXCIgKyBOdW1iZXIodG90YWxJbmNvbWUoY29tcGFueUluY29tZSkpLnRvRml4ZWQoMik7XHJcbiAgY29uc3QgYXZlcmFnZSA9IFwiXCIgKyBOdW1iZXIodG90YWwvKGNvbXBhbnlJbmNvbWUubGVuZ3RoICsgMSkpLnRvRml4ZWQoMik7XHJcbiAgY29uc3QgbW9udGhJbmNvbWUgPSBcIlwiICsgTnVtYmVyKGxhc3RNb250aEluY29tZXMoY29tcGFueUluY29tZXMpKS50b0ZpeGVkKDIpO1xyXG5cclxuICBjb25zdCBjb21wYW55T2JqID0ge1xyXG4gICAgLi4uY29tcCwgXHJcbiAgICBcInRvdGFsSW5jb21lXCIgOiB0b3RhbCwgXHJcbiAgICBcImF2ZXJhZ2VJbmNvbWVcIiA6IGF2ZXJhZ2UsIFxyXG4gICAgbW9udGhJbmNvbWVcclxuICB9O1xyXG5cclxuICBjb21wYW5pZXNBcnJheS5wdXNoKGNvbXBhbnlPYmopO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBnZXRDb21wYW5pZXNMaXN0KCkge1xyXG4gIGxldCBjb21wYW55ID0gYXdhaXQgZmV0Y2goXCJodHRwczovL3JlY3J1aXRtZW50LmhhbC5za3lnYXRlLmlvL2NvbXBhbmllc1wiKTtcclxuICBjb21wYW55ID0gYXdhaXQgY29tcGFueS5qc29uKCk7XHJcbiAgY29uc3QgY29tcGFuaWVzQXJyYXkgPSBbXTtcclxuICBcclxuICBhd2FpdCBQcm9taXNlLmFsbChjb21wYW55Lm1hcChjb21wID0+IHtcclxuICAgIHJldHVybiBjb21wYW5ueShjb21wLCBjb21wYW5pZXNBcnJheSk7XHJcbiAgfSkpO1xyXG5cclxuICBcclxuICBcclxuICByZXR1cm4gY29tcGFuaWVzQXJyYXk7XHJcbiAgXHJcbiAgXHJcbiBcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gcmVuZGVyVGFibGUoKSB7XHJcbiAgY29uc3QgY29tcGFuaWVzTGlzdCA9IGF3YWl0IGdldENvbXBhbmllc0xpc3QoKTtcclxuICBsZXQgdGFibGVJbm5lckh0bWwgPSBcIlwiO1xyXG5cclxuICBmb3IgKGNvbnN0IGNvbXBhbnkgb2YgY29tcGFuaWVzTGlzdCkge1xyXG4gICAgY29uc3Qge2lkLCBuYW1lLCBjaXR5LCB0b3RhbEluY29tZSwgYXZlcmFnZUluY29tZSwgbW9udGhJbmNvbWV9ID0gY29tcGFueTtcclxuICAgIHRhYmxlSW5uZXJIdG1sICs9IGBcclxuICAgICAgIDx0cj5cclxuICAgICAgICAgIDx0ZD4ke2lkfTwvdGQ+XHJcbiAgICAgICAgICA8dGQ+JHtuYW1lfTwvdGQ+XHJcbiAgICAgICAgICA8dGQ+JHtjaXR5fTwvdGQ+XHJcbiAgICAgICAgICA8dGQ+JHt0b3RhbEluY29tZX08L3RkPlxyXG4gICAgICAgICAgPHRkPiR7YXZlcmFnZUluY29tZX08L3RkPlxyXG4gICAgICAgICAgPHRkPiR7bW9udGhJbmNvbWV9PC90ZD5cclxuICAgICAgICA8L3RyPlxyXG4gICAgICBgO1xyXG4gIH1cclxuXHJcbiAgdGFibGVCb2R5LmlubmVySFRNTCA9IHRhYmxlSW5uZXJIdG1sO1xyXG5cclxufVxyXG5cclxuXHJcblxyXG5cclxuLy9URVNUSU5HIEZFVyBTT0xVVElPTiBPRiBQQUdJTkFUSU9OXHJcbi8vZ2V0Q2VsbFZhbHVlIGNvbXBhcmUgaW5uZXJUZXh0IGFuZCB0ZXh0Q29udGVudCBpZiB0aGUgdGFibGUgcm93IGlzIGVtcHR5IHRoZW4gaXQncyBwdWxsIGRhdGEgZm9ybSB0ZXh0Q29udGVudFxyXG5jb25zdCBnZXRDZWxsVmFsdWUgPSAodGFibGVSb3csIGNvbHVtbkluZGV4KSA9PiAodGFibGVSb3cuY2hpbGRyZW5bY29sdW1uSW5kZXhdLmlubmVyVGV4dCB8fCB0YWJsZVJvdy5jaGlsZHJlbltjb2x1bW5JbmRleF0udGV4dENvbnRlbnQpO1xyXG5cclxuY29uc3QgY29tcGFyZXIgPSAoY29sdW1uSW5kZXgsIHNvcnRBc2NlbmRpbmcpID0+IChhLCBiKSA9PiB7XHJcbiAgY29uc3QgdjEgPSBnZXRDZWxsVmFsdWUoc29ydEFzY2VuZGluZyA/IGEgOiBiLCBjb2x1bW5JbmRleCk7XHJcbiAgY29uc3QgdjIgPSBnZXRDZWxsVmFsdWUoc29ydEFzY2VuZGluZyA/IGIgOiBhLCBjb2x1bW5JbmRleCk7XHJcbiAgaWYgKHYxID09PSBcIlwiIHx8IHYyID09PSBcIlwiIHx8IGlzTmFOKHYxKSB8fCBpc05hTih2MikpIHtcclxuICAgIHJldHVybiB2MS50b1N0cmluZygpLmxvY2FsZUNvbXBhcmUodjIpO1xyXG4gIH1cclxuICByZXR1cm4gdjEgLSB2MjtcclxufTtcclxuXHJcbmNvbnN0IGNoZWNrVmFsdWUgPSAodGV4dCkgPT4gKHJvd3MpID0+IHtcclxuICByZXR1cm4gQXJyYXkuZnJvbShyb3dzLmNoaWxkcmVuKS5zb21lKCAocm93KSA9PiB7XHJcbiAgICBjb25zdCBmaWVsZFZhbHVlID0gcm93LmlubmVyVGV4dC50b0xvd2VyQ2FzZSgpO1xyXG4gICAgcmV0dXJuIChmaWVsZFZhbHVlLnN1YnN0cmluZygwLCB0ZXh0Lmxlbmd0aCkgPT09IHRleHQpO1xyXG4gIH0pO1xyXG59O1xyXG4gICAgXHJcblxyXG5cclxucmVuZGVyVGFibGUoKS50aGVuKCAoKSA9PiB7XHJcblxyXG4gIC8vU29ydGluZyB0YWJsZVxyXG5cclxuICBjb25zdCBoZWFkZXJzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmhlYWRlclwiKSk7XHJcbiAgY29uc3Qgd2hvbGVUYWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ0YWJsZVwiKTtcclxuICBjb25zdCB0YWJsZVF1ZXJ5ID0gd2hvbGVUYWJsZS5xdWVyeVNlbGVjdG9yKFwiLnRhYmxlX19ib2R5LS1qc1wiKTtcclxuICBjb25zdCB0YWJsZVJvd3MgPSBBcnJheS5mcm9tKHdob2xlVGFibGUucXVlcnlTZWxlY3RvcihcInRib2R5XCIpLnJvd3MpO1xyXG5cclxuICBsZXQgYXNjT3JEc2MgPSBmYWxzZTtcclxuXHJcbiAgaGVhZGVycy5mb3JFYWNoKHRoID0+XHJcbiAgICB0aC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XHJcbiAgICAgIGFzY09yRHNjID0gIWFzY09yRHNjO1xyXG4gICAgICBjb25zdCBpbmRleE9mVGggPSBBcnJheS5mcm9tKHRoLnBhcmVudE5vZGUuY2hpbGRyZW4pLmluZGV4T2YodGgpO1xyXG4gICAgICB0YWJsZVJvd3NcclxuICAgICAgICAuc29ydChjb21wYXJlcihpbmRleE9mVGgsIGFzY09yRHNjKSlcclxuICAgICAgICAuZm9yRWFjaCh0ciA9PiB0YWJsZVF1ZXJ5LmFwcGVuZENoaWxkKHRyKSk7XHJcbiAgICB9KVxyXG4gICk7XHJcblxyXG4gIC8vU2VhcmNoIGluIHRhYmxlXHJcbiAgXHJcbiAgY29uc3QgaW5wdXRRdWVyeSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuaW5wdXRfX2ZpZWxkLS1qc1wiKTtcclxuICBcclxuICBcclxuICBcclxuXHJcbiAgaW5wdXRRdWVyeS5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZSA9PiB7XHJcbiAgICBjb25zdCB0ZXh0ID0gaW5wdXRRdWVyeS52YWx1ZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgY29uc3QgdGFibGVRID0gd2hvbGVUYWJsZS5xdWVyeVNlbGVjdG9yKFwidGJvZHlcIik7XHJcbiAgICBjb25zdCB0YWJsZUJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0Ym9keScpO1xyXG4gICAgY29uc29sZS5sb2codGV4dCk7XHJcbiAgICB0YWJsZVJvd3MuZmlsdGVyKGNoZWNrVmFsdWUodGV4dCkpLmZvckVhY2gocm93ID0+IHtcclxuICAgICAgdGFibGVCb2R5LmFwcGVuZENoaWxkKHJvdyk7XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgXHJcblxyXG4gICAgXHJcbiAgICB3aG9sZVRhYmxlLnJlcGxhY2VDaGlsZCh0YWJsZUJvZHksIHRhYmxlUSk7XHJcbiAgICBcclxuICAgIFxyXG4gIH0pXHJcbiAgXHJcbn0pXHJcblxyXG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///0\n')}]);