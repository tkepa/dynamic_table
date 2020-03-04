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
const jakis = [];


function totalIncome(incomes) {
  let total = incomes.map(obj => {
    return parseFloat(obj.value)
  })
  total = total.reduce( (a,b) => a + b);
  
  return total;
};

function newDate(todayDate) {
  todayDate.setDate(1);
  todayDate.setMonth(todayDate.getMonth() - 3);
  return new Date(todayDate).toISOString().slice(0,7);
}

function lastMonthIncomes(incomes) {
  let lastMonth = incomes.filter(income => {
    const incomeDate = income.date.slice(0,7);
    if (incomeDate === lastMonthDate) {
      return true;
    }
    else {
      return false;
    }
  })
  lastMonth = lastMonth.map(el => el.value);
  lastMonth = lastMonth.reduce((a, b) => {
    return parseFloat(a) + parseFloat(b);
  })
  return lastMonth;
}


async function Companies() {
  let company = await fetch("https://recruitment.hal.skygate.io/companies");
  company = await company.json();
  const companyObj = [];
  company.map(async comp => {
    const ID = comp.id;
    let incomes = await fetch(`https://recruitment.hal.skygate.io/incomes/${ID}`);
    incomes = await incomes.json();
    incomes = incomes.incomes;
    const asd = incomes.map(a => parseFloat(a.value));
    companyObj.push(asd);
    //incomes = incomes.reduce((a,b) => {
    //  return (a + b);
    //})

    
    // incomes
    const total = "" + Number(totalIncome(incomes)).toFixed(2);
    const average = "" + Number(total/(incomes.length + 1)).toFixed(2);
    const lastMonthIncome = "" + Number(lastMonthIncomes(incomes)).toFixed(2);

    
    /*
    if (lastMonthIncome) {
      companyObj.push({...comp, "totalIncome" : total, "AverageIncome" : average, "LastMonthIncome" : lastMonthIncome});
    }
    else if (average) {
      companyObj.push({...comp, "totalIncome" : 0, "AverageIncome" : 0, "LastMonthIncome" : 0});
    }
    else {
      companyObj.push({...comp, "totalIncome" : 0, "AverageIncome" : 0, "LastMonthIncome" : 0});
    }
    */
    
  });
  
 

  console.log(companyObj);
  
  for (const obj of companyObj) {
    console.log(obj);
    //const (a, b, c, d, e, f) = comp;
    tableBody.innerHTML += `
      <tr>
        <td>${ID}<td>
        <td>${name}<td>
        <td>${city}<td>
        <td>${total}<td>
        <td>${average}<td>
        <td>${income}<td>
      </tr>
    `
  }
}

Companies();



