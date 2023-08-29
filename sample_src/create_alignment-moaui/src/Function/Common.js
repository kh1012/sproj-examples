export{ midasAPI, convertChartData, chartScaleSet }

async function midasAPI(method, subURL, body) {
  const baseURL = "https://api-beta.midasit.com:443/civil"
  const Mapi_Key = "eyJ1ciI6InlqdzA2MDhAbWlkYXNpdC5jb20iLCJwZyI6ImNpdmlsIiwiY24iOiJYQnJ2TldFMFNBIn0.0ecc30a1c43daf4a62d2812d9262814d6f9c8271dfc5d322f1d4023389c4e03e"
  let res
  if (method === "POST" || method === "PUT") {
    res = await fetch(baseURL + subURL, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "MAPI-Key": Mapi_Key
      },
      body: JSON.stringify(body)
    })
  } else {
    res = await fetch(baseURL + subURL, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "MAPI-Key": Mapi_Key
      }
    })
  }
  return await res.json();
  }

function convertChartData(layoutData) {
  let chartData = [{"id": "Line", "data": []}]
  for (let i = 0; i < layoutData[0].length; i++) {
    if (isNaN(layoutData[0][i]) || isNaN(layoutData[1][i])) {
      return false;
    } else {
      chartData[0].data[i] = {
        "x": layoutData[0][i],
        "y": layoutData[1][i],  
      }
    }
  }
  return chartData
}

function chartScaleSet(chartData) {
  const chartDataObject = chartData[0];
  const xlist = chartDataObject.data.map(dataItem => dataItem.x);
  const ylist = chartDataObject.data.map(dataItem => dataItem.y);

  let xmax = Math.max(...xlist);
  let xmin = Math.min(...xlist);
  let ymax = Math.max(...ylist);
  let ymin = Math.min(...ylist);

  let xlen = xmax - xmin;
  let ylen = ymax - ymin;

  let margin = 0.1;
  let baseX = 2;
  let baseY = 1;
  let baseRatio = baseY/baseX;
  let newBaseX = 2;
  let newBaseY = ylen/(xlen/baseX);
  let newRatio = newBaseY/newBaseX;
  
  let newXmax, newXmin, newYmax, newYmin;
  if (baseRatio > newRatio) {
    newXmax = xmax + Math.abs(xmax * margin);
    newXmin = xmin - Math.abs(xmin * margin);
    newYmax = (ymin + ymax)/2 + ylen/2*(baseY/newBaseY) + Math.abs(ymax * margin);
    newYmin = (ymin + ymax)/2 - ylen/2*(baseY/newBaseY) - Math.abs(ymin * margin);
  } else {
    newXmax = (xmax + xmin)/2 + xlen/2*(baseX/newBaseX) + Math.abs(xmax * margin);
    newXmin = (xmax + xmin)/2 - xlen/2*(baseX/newBaseX) - Math.abs(xmin * margin);
    newYmax = ymax + Math.abs(ymax * margin);
    newYmin = ymin - Math.abs(ymin * margin);
  }
  return [newXmax, newXmin, newYmax, newYmin]
}
