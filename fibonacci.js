let btn = document.getElementById("btnIs");
let result = document.getElementById("result");
let loaderForNum = document.getElementById("loader-num");
let loaderForResult = document.getElementById('loader-result');
let reminderLarge = document.getElementById("reminderLarge");
let reminderSmall = document.getElementById("reminderSmall");
let inputNum = document.getElementById("input-num");
let serverError = document.getElementById("server-error");
let resultsList = document.getElementById('results-list');
let checkBox = document.getElementById("flexCheckDefault");
let numAsc = document.getElementById("num-asc");
let numDesc = document.getElementById("num-desc");
let dateAsc = document.getElementById("date-asc");
let dateDesc = document.getElementById("date-desc");
let Data;

// Local fibonacci function:
function localFibonacci(number) {
  const fib = [0, 1];
  for (let i = 2; i <= number; i++) {
    const newNum = fib[i - 2] + fib[i - 1];
    fib.push(newNum);
  }
  result.textContent = fib[number];
}

// fetch first server: Async / Await 
async function callFibonacciServerAsync(number, callback) {
  const response = await fetch(`http://localhost:5050/fibonacci/${number}`);
  if (!response.ok) {
    const message = await response.text();
    let newMessage = "Server Error: " + message;
    serverError.innerHTML = newMessage;
    loaderForNum.style.display = "none";
    loaderForResult.style.display = "none";
    serverError.style.display = "inline-block";
    
  } else {
    const data = await response.json();
    loaderForNum.style.display = "none";
    result.style.display = "block";
    result.textContent = data.result;
    callback();
  }
}

// fetch second server:
// Async / Await / FibonacciResultsServer
async function callFibonacciResultsAsync() {
  const response = await fetch("http://localhost:5050/getFibonacciResults");
  if (response.ok) {
    Data = await response.json();
    loaderForResult.style.display = "none";
    sortArrayByDateDesc(Data.results);
    updateLists(Data.results);
  } else { 
    const message = await response.text();
    console.log(message);
  }
}

// function: sort data by descending createdDate
function sortArrayByDateDesc(dataArray) { 
  dataArray.sort((a, b) => b.createdDate - a.createdDate);
}

function sortArrayByDateAsc(dataArray) {
  dataArray.sort((a, b) => a.createdDate - b.createdDate);
}

function sortArrayByNumAsc(dataArray) {
  dataArray.sort((a, b) => a.number - b.number);
}

function sortArrayByNumDesc(dataArray) {
  dataArray.sort((a, b) => b.number - a.number);
}


// function: present 8 list-items to <ul>
function updateLists(dataArray) {
  let listItem = "";
  for (let i = 0; i < 8; i++) {
    let dateString = new Date(dataArray[i].createdDate);
    listItem += `<li class="list-group-item ps-0">The Fibonacci Of <strong>${dataArray[i].number}</strong> is <strong>${dataArray[i].result}</strong>. Calculated at: ${dateString} </li>`;
  }
  resultsList.innerHTML = listItem;
}

// dropdown menu sort results by adding 'click' event :
const dropdownItems = [ numAsc, numDesc, dateAsc, dateDesc ];
const dropdownItemsFuncs = [ sortArrayByNumAsc, sortArrayByNumDesc, sortArrayByDateAsc, sortArrayByDateDesc];
for (let i = 0; i < dropdownItems.length; i++) {
  dropdownItems[ i ].addEventListener("click", () => { 
    dropdownItemsFuncs[i](Data.results);
    updateLists(Data.results);
  });
}

btn.addEventListener("click", (e) => {
  let val = document.getElementById("input-num").value;
  result.style.display = "none";
  serverError.style.display = "none";
  if (val >= 0 && val <= 50) {
    reminderLarge.style.display = "none";
    reminderSmall.style.display = "none";
    inputNum.style.border = "1px solid rgb(118, 118, 118)";
    inputNum.style.color = "black";
    if (!checkBox.checked) {
      localFibonacci(val);
      result.style.display = "block";
    } else {
      loaderForNum.style.display = "inline-block";
      // loaderForResult.style.display = "inline-block";
      callFibonacciServerAsync(val, callFibonacciResultsAsync);
    }
  } else { 
    if (val > 50) {
      reminderSmall.style.display = "none";
      reminderLarge.style.display = "block";
    } else {
      reminderLarge.style.display = "none";
      reminderSmall.style.display = "block";
    }
    inputNum.style.border = "1px solid #D9534F";
    inputNum.style.color = "#D9534F";
    inputNum.style.borderRadius = "4px";
  }  
});
