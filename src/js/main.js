"use strict";

// service worker registration - remove if you're not going to use it

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('serviceworker.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

// place your code below
const tableBody = document.querySelector(".table__body--js");
let todayDate = new Date();
let lastMonthDate = newDate(todayDate);


const totalIncome = (incomes) => incomes.reduce((acc,income) => acc + income);

//this function return year-month date(getYearAndMonth)
function newDate(todayDate) {
  todayDate.setDate(1);
  todayDate.setMonth(todayDate.getMonth() - 1);
  return new Date(todayDate).toISOString().slice(0,7);
}

function lastMonthIncomeDate(incomes) {
  let lastMonth = incomes.filter(income => {
    const incomeDate = income.date.slice(0,7);
    if (incomeDate === lastMonthDate) {
      return true;
    }
    else {
      return false;
    }
  })
  return lastMonth;
};

function lastMonthIncomes(incomes) {
  let lastMonth = lastMonthIncomeDate(incomes);
  lastMonth = lastMonth.map(el => el.value);
  if (lastMonth.length > 0) {
    lastMonth = lastMonth.reduce((a, b) => {
      return parseFloat(a) + parseFloat(b)
    })
  } 
  else {
    lastMonth = 0;
  }
  return lastMonth;
}


async function companny (comp, companiesArray) {
  let companyIncomes = await fetch(`https://recruitment.hal.skygate.io/incomes/${comp.id}`);
  companyIncomes = await companyIncomes.json();
  companyIncomes = companyIncomes.incomes;
  const companyIncome = companyIncomes.map(comp => parseFloat(comp.value));

  const total = "" + Number(totalIncome(companyIncome)).toFixed(2);
  const average = "" + Number(total/(companyIncome.length + 1)).toFixed(2);
  const monthIncome = "" + Number(lastMonthIncomes(companyIncomes)).toFixed(2);

  const companyObj = {
    ...comp, 
    "totalIncome" : total, 
    "averageIncome" : average, 
    monthIncome
  };

  companiesArray.push(companyObj);
}

async function getCompaniesList() {
  let company = await fetch("https://recruitment.hal.skygate.io/companies");
  company = await company.json();
  const companiesArray = [];
  
  await Promise.all(company.map(comp => {
    return companny(comp, companiesArray);
  }));

  
  
  return companiesArray;
  
  
 
}

async function renderTable() {
  const companiesList = await getCompaniesList();
  let tableInnerHtml = "";

  for (const company of companiesList) {
    const {id, name, city, totalIncome, averageIncome, monthIncome} = company;
    tableInnerHtml += `
       <tr>
          <td>${id}</td>
          <td>${name}</td>
          <td>${city}</td>
          <td>${totalIncome}</td>
          <td>${averageIncome}</td>
          <td>${monthIncome}</td>
        </tr>
      `;
  }

  tableBody.innerHTML = tableInnerHtml;

}




//TESTING FEW SOLUTION OF PAGINATION

/*
headers.forEach(header => {
  header.addEventListener('click', (() => {
    const table = th.closest('table');
    Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
        .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
        .forEach(tr => table.appendChild(tr) );
})});
*/
renderTable().then(() => {
  const headers = document.querySelectorAll(".header");
  let table = document.querySelectorAll("tr");
  
 /* 
  headers.forEach(header => {
    header.addEventListener('click', (() => {
      Array.from(table))
          .sort(comparer(table, this.asc = !this.asc))
          .forEach(tr => table.appendChild(tr) );
  })});
  */
}
)
/*
function sortTable(table, col, reverse) {
  var tb = table.tBodies[0], // use `<tbody>` to ignore `<thead>` and `<tfoot>` rows
      tr = Array.prototype.slice.call(tb.rows, 0), // put rows into array
      i;
  reverse = -((+reverse) || -1);
  tr = tr.sort(function (a, b) { // sort rows
      return reverse // `-1 *` if want opposite order
          * (a.cells[col].textContent.trim() // using `.textContent.trim()` for test
              .localeCompare(b.cells[col].textContent.trim())
             );
  });
  for(i = 0; i < tr.length; ++i) tb.appendChild(tr[i]);

const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
    v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
    )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

    */