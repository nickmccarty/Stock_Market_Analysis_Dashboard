// Roadmap
// FUnction to initialize page, create dropdown using sql list of stocks.
// Selects the drop down element./value
//init function calls the build table FUnction
// build table makes a call to  another flask endpoint(news data)
//flask endpoint will call the url and parse response,return response
// build table then takes the formatted response from the call and builds table.

////////////////////////////////////////////////////////
// Create Event listener for dropdown date input, table button selection,
// and functions to build the market table section.
//
/////////////////////////////////////////////////////////

// $(document).ready(function() {
//   $('input[name=marketwatch]').click(function() {
//     // if (this.name == 'marketwatch')
//     var tableselection = this.value;
//     console.log(tableselection);
//     buildMarketStats(tableselection);
//   });
// });

// $(document).ready(function(){
//   $('input[name=marketsymbol]').on('click', function(){
//     var symbolselection = this.value;
//     console.log(this.value);
//
//     optionChanged(symbolselection);
//   });
//
// });

var input = document.querySelector('#datepicker');

$(document).ready(function() {
    $('input[name=marketwatch]').click(function() {
    // if (this.name == 'marketwatch')
    let table = document.querySelector('#marketwatch')
    // table.innerHTML = ''
    var tableselection = this.value;
    console.log(tableselection);
    if (tableselection == 'econcal' ) {
      buildEconCal('today')
      input.addEventListener('change', element => {
        var searchInput = element.target.value
        console.log(searchInput);
        if (searchInput) {
          buildEconCal(searchInput);
        } else {
          searchInput = 'today'
          buildEconCal(searchInput)
        }; //End if searchInput
      });// End event listener
    } else {
        buildMarketStats(tableselection);
    };// End if
  }); //End .click(function())
}); // End .ready(function())


function buildEconCal(dateinput) {
  let url =  `/econcal/${dateinput}`
  d3.json(url).then((response) => {
    // console.log(response);
    let table = document.getElementById('market-tables');
    table.innerHTML = ''; // clear previos table
    /////////////////////////////////////////////////// Build table header
    let header = table.createTHead();
    let columns = Object.keys(response[0]);
    let header_row = header.insertRow(0);
    for (let i=0;i< columns.length;i++) {
      let cell = header_row.insertCell(i);
      cell.innerHTML = `<b>${columns[i]}</b>`;
    }; // End for(i < columns.length)
    /////////////////////////////////////////////////////// Build Table body
    let tablebody = table.createTBody();
    // tablebody.innerHTML = ''
    for (let i=0; i < response.length; i++) { // Iterate through article
      let datarow = response[i];
      // console.log(datarow);
      // let keys = Object.keys(datarow)
      // console.log(keys);
      let row = tablebody.insertRow(i);
      for (let j = 0; j < columns.length;j++) { // Iterate through article keys
        let key = columns[j];
        let cell = row.insertCell(j);
        cell.innerText = datarow[key];
      }; // End for j
    };// End for i
  });// End D3.json
};// End buildEconCal

function buildMarketStats(input) {
  let url = `/marketstats/${input}`
  d3.json(url).then((response)=> {
    // console.log(response);
    let table = document.getElementById('market-tables');
    table.innerHTML = ''; // clear previos table
    /////////////////////////////////////////////////// Build table header
    let header = table.createTHead();
    let columns = Object.keys(response[0]);
    let header_row = header.insertRow(0);
    for (let i=0;i< columns.length;i++) {
      let cell = header_row.insertCell(i);
      cell.innerHTML = `<b>${columns[i]}</b>`;
    }; // End for(i < columns.length)
    /////////////////////////////////////////////////////// Build Table body
    let tablebody = table.createTBody();
    // tablebody.innerHTML = ''
    for (let i=0; i < response.length; i++) { // Iterate through article
      let datarow = response[i];
      // console.log(datarow);
      // let keys = Object.keys(datarow)
      // console.log(keys);
      let row = tablebody.insertRow(i);
      for (let j = 0; j < columns.length;j++) { // Iterate through article keys
        let key = columns[j];
        let cell = row.insertCell(j);
        if ( key == 'Symbol') {
          cell.innerText = datarow[key];
          // cell.innerHTML =  `<a rel="noopener noreferrer" href=${article[key]} target="_blank">Read Article</a>`;
          // cell.innerHTML = `<input type="radio" id="markettick" name="marketsymbol" value=${datarow[key]}><label for=${datarow[key]}>${datarow[key]}</label>`;
        } else if (true){
              cell.innerText = datarow[key];
        };//end if
      }; // End for j
    };// End for i
  });// End D3.json
}; // End function buildEcon


// function buildMarketStats(input) {
//   let url = `/marketstats/${input}`
//   d3.json(url).then((response)=> {
//     // console.log(response);
//     let table = document.querySelector('#marketwatch');
//     table.innerHTML = ''
//     for (let i=0; i < response.length; i++) { // Iterate through article
//       let datarow = response[i];
//       // console.log(datarow);
//       let keys = Object.keys(datarow)
//       // console.log(keys);
//       let row = table.insertRow(i)
//       for (let j = 0; j < keys.length;j++) { // Iterate through article keys
//         let key = keys[j];
//         let cell = row.insertCell(j);
//         if ( key == 'Symbol') {
//           // cell.innerHTML =  `<a rel="noopener noreferrer" href=${article[key]} target="_blank">Read Article</a>`;
//           cell.innerHTML = `<input type="radio" id="markettick" name="marketsymbol" value=${datarow[key]}><label for=${datarow[key]}>${datarow[key]}</label>`;
//         } else if (true){
//               cell.innerText = datarow[key];
//         };//end if
//       }; // End for j
//     };// End for i
//   });// End D3.json
// }; // End function buildEcon



///////////////////////////////////////////////////////
// Function to build news table and plot news points
///////////////////////////////////////////////////////
var plotData = [];

function buildTable(symbol) {
  let url = `/newstable/${symbol}`;
  d3.json(url).then((response) => {
    let tablebody = document.querySelector('tbody');
    tablebody.innerHTML = ''
    for (let i=0; i < response.length; i++) { // Iterate through article
      let article= response[i];
      let spec_keys = ['publishDate','title','url']
      let row = tablebody.insertRow(i)
      for (let j = 0; j < spec_keys.length;j++) { // Iterate through article keys
        let key = spec_keys[j];
        let cell = row.insertCell(j);
        if ( key == 'url') {
          cell.innerHTML =  `<a rel="noopener noreferrer" href=${article[key]} target="_blank">Read Article</a>`;
        } else if (true){
              cell.innerText = article[key];
        };//end if
      }; // End for j
    };// End for i
    plotAll(plotData, response, symbol)
  }); //End d3.json reuest handling
}// End function


///////////////////////////////////////////////////////////////
// Alpha Vantage API Call and Plot functions
//////////////////////////////////////////////////////////////



// for 5 min intervals, 12 window period is an hour
function rollingAverage(arr, windowPeriod = 12) {
  rollingAverageValues = [];
  for (var i = windowPeriod - 1; i < arr.length; i++) {
    let ctr = 0;
    let newVal = arr[i];
    if (arr[i] == null) {
      ctr += 1;
    };
    for (var j = 1; j < windowPeriod; j++) {
      newVal += arr[i-j];
      if (arr[i-j] == null) {
        ctr += 1;
      };
    };
    rollingAverageValues.push(newVal / (windowPeriod - ctr));
  }
  return rollingAverageValues;
};


function plotAll(priorData, response, symbol) {

  var allData = [];
  priorData.forEach(function(x) {
      allData.push(x);
  });
  response.forEach(function(x) {
    let y = new Date(x.discoverDate);
    if (y > priorData[0].date && y < priorData[priorData.length - 1].date) {
      allData.push(
        {
          date: new Date(x.discoverDate),
          close: null,
          volume: null,
          newsVal: "insert",
          newsTitle: x.title
        }
      ); 
    }
  });


 
  allData.sort(function(first, second) {
    return first.date - second.date;
  });


  var values = [];
  for (var i=0; i<allData.length; i ++) {
    if (allData[i].newsVal == "insert") {
      var nextY
      var nextTime
      for (var k=1; k<allData.length - i; k++) {
        if (allData[i+k].close !== null) {
          nextY = allData[i+k].close;
          nextTime = allData[i+k].date;
          break
        }
      }
      var previousY
      var previousTime

      for (var k=1; k<=i; k++) {
        if (allData[i-k].close !== null) {
          previousY = allData[i-k].close;
          previousTime = allData[i-k].date;
          break
        }
      }

      let m = (nextY - previousY)/(nextTime - previousTime);
      let newY = (allData[i].date - previousTime)*m + previousY;
      allData[i].newsVal = newY;
      values.push(newY);
    }
  };

  let dates = [];
  let closeValues = [];
  let volumeValues = [];
  let newsValues = [];
  let newsTitles = [];


  allData.forEach(function(x) {
    dates.push(`${x.date.getMonth()+1}/${x.date.getDate()} ${x.date.getHours()}:${x.date.getMinutes()}`);
    closeValues.push(x.close);
    volumeValues.push(x.volume);
    newsValues.push(x.newsVal);
    newsTitles.push(x.newsTitle);
  });

 
  var trace2 = {
    x: dates,
    y: closeValues,
    type: "scatter",
    name: "Closing Price"
  };

    // rolling average plot with period pre-defined so that the x values stay correct with any period
  var rollingAveragePeriod = 12;
  var trace3 = {
    x: dates.slice(rollingAveragePeriod - 1, dates.length),
    y: rollingAverage(closeValues, rollingAveragePeriod),
    type: "scatter",
    name: "One Hour MA"
  };

    // trace for Volume
  var trace1 = {
    x: dates,
    y: volumeValues,
    yaxis: "y2",
    type: "bar",
    name: "Volume",
    opacity: 0.5
  };

  var trace4 = {
    x: dates,
    y: newsValues,
    mode: "markers",
    text: newsTitles,
    type: "scatter",
    name: "News"
  };



  var data = [trace1, trace2, trace3, trace4];
  
  var layout = {
    title: {
      text: `<b>${symbol}</b> Closing Prices`,
      font: {
        family: 'Arial, sans-serif',
        size: 20
      }
    },
    xaxis: {
      textfont: {
        family: 'Arial, sans-serif',
        size: 18,
      }
    },
    yaxis: {
      autorange: true,
      type: "linear",
      textfont: {
        family: 'Arial, sans-serif',
        size: 18,
        color: 'blue'
      }
    },
    yaxis2: {
      title: "Volume",
      overlaying: 'y',
      side: "right",
      anchor: "x",
      font: {
        family: 'Arial, sans-serif',
        size: 18,
        color: 'green'
      } 
    },
    showlegend: true,
    legend: {
      x: 0,
      y: 5
    },
    margin: {
      b: 100
    },
    plot_bgcolor: "lightgrey",
    paper_bgcolor: "lightgrey"
  };

  return Plotly.newPlot("plot",data,layout);
}


function alphaVantagePullnPlot(stockTicker) {
  d3.json(`/stockpull/${stockTicker}`).then(function(dataResponse) {
    var metaData = dataResponse["Meta Data"];
    var timeDelta = metaData["4. Interval"];
    var stockData =  dataResponse[`Time Series (${timeDelta})`];

    var dates = [];
    var closeValues = [];
    var volumeValues = [];

    Object.entries(stockData).forEach(function(d) {
      plotData.push(
        {
          date: new Date(d[0]),
          close: +d[1]["4. close"],
          volume: +d[1]["5. volume"],
          newsVal: null,
          newsTitle: null
        }
      )
    });
    



    plotData.sort(function(first, second) {
      return first.date - second.date;
    });

    plotData.forEach(function(x) {
      dates.push(`${x.date.getMonth()+1}/${x.date.getDate()} ${x.date.getHours()}:${x.date.getMinutes()}`);
      closeValues.push(x.close);
      volumeValues.push(x.volume);
    });
    
    
    var trace2 = {
      x: dates,
      y: closeValues,
      type: "scatter",
      name: "Closing Price"
    };

    var rollingAveragePeriod = 12;
    var trace3 = {
      x: dates.slice(rollingAveragePeriod - 1, dates.length),
      y: rollingAverage(closeValues, rollingAveragePeriod),
      type: "scatter",
      name: "One Hour MA"
    };

    var trace1 = {
      x: dates,
      y: volumeValues,
      yaxis: "y2",
      type: "bar",
      name: "Volume",
      opacity: 0.5
    };

    var data = [trace1, trace2, trace3]

    
    var layout = {
      title: {
        text: `<b>${stockTicker}</b> Closing Prices`,
        font: {
          family: 'Arial, sans-serif',
          size: 20
        }
      },
      xaxis: {
        textfont: {
          family: 'Arial, sans-serif',
          size: 18,
        }
      },
      yaxis: {
        autorange: true,
        type: "linear",
        textfont: {
          family: 'Arial, sans-serif',
          size: 18,
          color: 'blue'
        }
      },
      yaxis2: {
        title: "Volume",
        overlaying: 'y',
        side: "right",
        anchor: "x",
        font: {
          family: 'Arial, sans-serif',
          size: 18,
          color: 'green'
        }
      },
      showlegend: true,
      legend: {
        x: 0,
        y: 5
      },
      margin: {
        b: 100
      },
      plot_bgcolor: "lightgrey",
      paper_bgcolor: "lightgrey"
    };

    Plotly.newPlot("plot",data,layout);

  });
};



/////////////////////////////////////////////////////////////
// Plot the history data
/////////////////////////////////////////////////////////////
var historyData;
var stockSymbol;

function getHistoryData(stock, typePull = "full") {

  historyData = d3.json(`/stockhistory/${stock}`);
  stockSymbol = `${stock}`

};

function historyPlot(stockSymbol,years) {

  var nowDate = new Date();
  var fromDate = nowDate.getFullYear() - years + '-01-01';
  var currentMonth = nowDate.getMonth() + 1;
  var currentDate = nowDate.getDate();

  if (currentMonth < 10) {
    currentMonth = '0' + currentMonth;
  }

  if (currentDate < 10) {
    currentDate = '0' + currentDate;
  }

  var toDate = nowDate.getFullYear() + '-' + currentMonth + '-' + currentDate;

  console.log(nowDate);
  console.log("from " + fromDate + " to " + toDate);

  // Getting the stock data to plot into a list format
  var historyDates = [];
  var historyOpen = [];
  var historyHigh = [];
  var historyLow = [];
  var historyClose = [];

  historyData.then(function(data) {

    var stockData =  data[`Monthly Time Series`];
    console.log(data);

    Object.entries(stockData).forEach(function(d) {

      if (d[0] >= fromDate && d[0] <= toDate) {

        historyDates.push(d[0]);
        historyOpen.push(+d[1]["1. open"]);
        historyHigh.push(+d[1]["2. high"]);
        historyLow.push(+d[1]["3. low"]);
        historyClose.push(+d[1]["4. close"]);
      }

    });

    console.log("dates: " + historyDates);
    console.log("openingPrices: " + historyOpen);
    console.log("closingPrices: " + historyClose);

    // Plot the graph
    var trace1 = {
      x: historyDates,
      close: historyClose,
      high: historyHigh,
      low: historyLow,
      open: historyOpen,
      type: "candlestick",
      increasing: {line: {color: '#17BECF'}},
      decreasing: {line: {color: 'black'}},
      xaxis: "x",
      yaxis: "y"
    };

    var data = [trace1];

    var layout = {
      title: `${stockSymbol} ${years} years historical data`,
      dragmode: 'zoom',
      margin: {
        r: 10,
        t: 25,
        b: 40,
        l: 60
      },
      xaxis: {
        autorange: false,
        range: [fromDate, toDate],
        // rangeslider: {range: [fromDate, toDate]},
        rangeslider: {visible: false},
        title: "Date",
        type: "date"
      },
      yaxis: {
        autorange: true,
        type: "candlestick"
      },
      plot_bgcolor: "lightgray",
      paper_bgcolor: "lightgray"
    };

    Plotly.newPlot("historyPlot", data, layout);
  });
};

function changedYears(selYears) {

  console.log("selYears: " + selYears)
  historyYears = selYears;
  historyPlot(stockSymbol,historyYears);

};


///////////////////////////////////////////////////////////////
//Initialize/Render page elements based on menu selection
//////////////////////////////////////////////////////////////

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  // Route /tipicks returns a list of strings
  d3.json("/tickpicks").then((tickers) => {
    console.log(tickers);
    tickers.forEach((symbol) => {
      selector
        .append("option")
        .text(symbol)
        .property("value", symbol);
    });

    //Use the first sample from the list to build the initial plots
    const firstSymbol = tickers[0];
    buildTable(firstSymbol);
    alphaVantagePullnPlot(firstSymbol);
    let stockSymbol = tickers[0];
    const historyYears = 3;
    getHistoryData(stockSymbol);
    historyPlot(stockSymbol,historyYears);
  });
  buildMarketStats('mostactivebysharevol')
};

function optionChanged(newSymbol) {
  // Fetch new data each time a new sample is selected
  plotData = [];
  alphaVantagePullnPlot(newSymbol);
  buildTable(newSymbol);
  let stockSymbol = newSymbol;
  getHistoryData(stockSymbol);
  let historyYears = 3;
  historyPlot(stockSymbol,historyYears);
};

// Initialize the dashboard
init();
