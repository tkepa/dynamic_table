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
//getCellValue compare innerText and textContent if the table row is empty then it's pull data form textContent
const getCellValue = (tableRow, columnIndex) => (tableRow.children[columnIndex].innerText || tableRow.children[columnIndex].textContent);

const comparer = (columnIndex, sortAscending) => (a, b) => {
  const v1 = getCellValue(sortAscending ? a : b, columnIndex);
  const v2 = getCellValue(sortAscending ? b : a, columnIndex);
  if (v1 === "" || v2 === "" || isNaN(v1) || isNaN(v2)) {
    return v1.toString().localeCompare(v2);
  }
  return v1 - v2;
};

const checkValue = (text) => (rows) => {
  return Array.from(rows.children).some( (row) => {
    const fieldValue = row.innerText.toLowerCase();
    return (fieldValue.substring(0, text.length) === text);
  });
};
    


renderTable().then( () => {

  //Sorting table

  const headers = Array.from(document.querySelectorAll(".header"));
  const wholeTable = document.querySelector("table");
  const tableQuery = wholeTable.querySelector(".table__body--js");
  const tableRows = Array.from(wholeTable.querySelector("tbody").rows);

  let ascOrDsc = false;

  headers.forEach(th =>
    th.addEventListener("click", e => {
      ascOrDsc = !ascOrDsc;
      const indexOfTh = Array.from(th.parentNode.children).indexOf(th);
      tableRows
        .sort(comparer(indexOfTh, ascOrDsc))
        .forEach(tr => tableQuery.appendChild(tr));
    })
  );

  //Search in table
  
  const inputQuery = document.querySelector(".input__field--js");
  
  
  

  inputQuery.addEventListener("keyup", e => {
    const text = inputQuery.value.toLowerCase();
    const tableQ = wholeTable.querySelector("tbody");
    const tableBody = document.createElement('tbody');
    console.log(text);
    tableRows.filter(checkValue(text)).forEach(row => {
      tableBody.appendChild(row);
    });
    
    

    
    wholeTable.replaceChild(tableBody, tableQ);
    
    
  })
  
})

