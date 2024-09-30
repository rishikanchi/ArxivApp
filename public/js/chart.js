
const { lightningChart, UIDraggingModes, RadialGradientFill, LinearGradientFill, IndividualPointFill, ColorRGBA, UIElementBuilders, SolidLine, SolidFill, transparentFill, emptyFill, AxisTickStrategies, emptyFillStyle, emptyLine, UIOrigins, Themes} = lcjs;

const colorMap = {
  "Astrophysics": ColorRGBA(245, 100, 100),
  "Condensed Material": ColorRGBA(245, 140, 100),
  "Computer Science": ColorRGBA(245, 200, 100),
  "Economics": ColorRGBA(230, 245, 100),
  "Electrical Engineering and Systems Science": ColorRGBA(190, 245, 100),
  "General Relativity and Quantum Cosmology": ColorRGBA(120, 245, 100),
  "High Energy Physics - Experiment": ColorRGBA(100, 245, 130),
  "High Energy Physics - Lattice": ColorRGBA(100, 245, 180),
  "High Energy Physics - Phenomenology": ColorRGBA(100, 245, 180),
  "High Energy Physics - Theory": ColorRGBA(100, 245, 220),
  "Mathematics": ColorRGBA(100, 230, 245),
  "Mathematical Physics": ColorRGBA(100, 170, 245),
  "Nonlinear Sciences": ColorRGBA(100, 100, 245),
  "Nuclear Experiment": ColorRGBA(130, 100, 245),
  "Nuclear Theory": ColorRGBA(200, 100, 245),
  "Physics": ColorRGBA(245, 100, 230),
  "Quantitative Biology": ColorRGBA(245, 100, 200),
  "Quantitative Finance": ColorRGBA(245, 100, 160),
  "Quantum Physics": ColorRGBA(245, 100, 130),
  "Statistics": ColorRGBA(245, 100, 110)
};

fetch('/api/mydata') // Fetch data from server endpoint
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse response body as JSON
  })
  .then(data => {
    let newArray = data.map(obj => {
        const { _id, ...rest } = obj;
        return rest; 
      });
      console.log("once more");

    var data_points = Object.entries(data).slice(0,100000);
    var clusters = Object.entries(data).slice(100000, Object.keys(data).length);
    
    
    // var chart;

    const chart = lightningChart({
      license: "0002-n3X9iO0Z5d9OhoPGWWdBxAQ6SdnSKwB0/bH5AezBWp6K2IHfmcHtrmGsuEfyKfMUywnFPEbJ/vz5wfxYNmTstcut-MEYCIQDBYzSNR+IpXP765q1bC8E4xWsWHfWS0CLLjh2DYiBi0wIhAOMmdh9c3bmnsXnk6b5Xd+ngHLhuM0pJSapgpHg21+Br",
      licenseInformation: {
          appTitle: "LightningChart JS Trial",
          company: "LightningChart Ltd."
      },
  }).ChartXY({
      container: 'chart',
      theme: Themes.light
    }).setTitle('Web of Research')
    
    chart.setBackgroundFillStyle(new SolidFill({ color: ColorRGBA(255, 255, 255, 255) }))
    chart.setBackgroundStrokeStyle(emptyLine)
    
    //   chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.Empty)
    //   chart.getDefaultAxisX().setTitleFillStyle(emptyFillStyle)
    //
    //   chart.getDefaultAxisY().setTickStrategy(AxisTickStrategies.Empty)
    //   chart.getDefaultAxisY().setTitleFillStyle(emptyFillStyle)

    
    // Remove the chart title
    chart.setTitle('')
    chart.pan({x: -700, y: 300})

    
    
        
    fetch('/api/mydata2') // Fetch data from server endpoint
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // Parse response body as JSON
    })
    .then(data => {
      chart.getDefaultAxisX().zoom(0, -4.9)
      chart.getDefaultAxisY().zoom(0, -4.9)
      console.log(data);

      function getIndexesOfNSmallestElements(arr, n) {
        // Step 1: Create an array of objects with value and index
        const indexedArray = arr.map((value, index) => ({ value, index }));
      
        // Step 2: Sort the array of objects based on the values
        indexedArray.sort((a, b) => a.value - b.value);
      
        // Step 3: Extract the first n elements from the sorted array
        const smallestElements = indexedArray.slice(0, n);
      
        // Step 4: Extract the indexes from these n elements
        const indexes = smallestElements.map(element => element.index);
      
        return indexes;
      }

      function mode(array)
          {
              if(array.length == 0)
                  return null;
              var modeMap = {};
              var maxEl = array[0], maxCount = 1;
              for(var i = 0; i < array.length; i++)
              {
                  var el = array[i];
                  if(modeMap[el] == null)
                      modeMap[el] = 1;
                  else
                      modeMap[el]++;  
                  if(modeMap[el] > maxCount)
                  {
                      maxEl = el;
                      maxCount = modeMap[el];
                  }
              }
              return maxEl;
          }

      var distances = [];
      var categories = [];

      data_points.forEach((datapoint) => {
          point = datapoint[1];
          distances.push(Math.pow((Math.pow(point.x - data.x, 2) + Math.pow(point.y - data.y, 2)), 0.5));
          
      })

      var closest_points = getIndexesOfNSmallestElements(distances, 100);

      closest_points.forEach((idx) => {
        categories.push(data_points[idx][1].category);
      })

      targetX = data.x;
      targetY = data.y;

      const xAxis = chart.getDefaultAxisX();
      const yAxis = chart.getDefaultAxisY();

      // Get the current view ranges
      const xMin = xAxis.getInterval().start;
      const xMax = xAxis.getInterval().end;
      const yMin = yAxis.getInterval().start;
      const yMax = yAxis.getInterval().end;

      // Calculate the current center
      const currentXCenter = (xMin + xMax) / 2;
      const currentYCenter = (yMin + yMax) / 2;

      // Get the current view ranges
      const xInterval = xAxis.getInterval();
      const yInterval = yAxis.getInterval();

      // Calculate the required delta to pan to the target coordinate
      const deltaX = targetX - currentXCenter;
      const deltaY = targetY - currentYCenter;

      const chartRect = chart.engine.container.getBoundingClientRect();
      const chartWidth = chartRect.width;
      const chartHeight = chartRect.height;

      // Convert the delta from data units to pixel values
      const deltaXInPixels = (deltaX / (xInterval.end - xInterval.start)) * chartWidth;
      const deltaYInPixels = (deltaY / (yInterval.end - yInterval.start)) * chartHeight;

      const XInPixels = ((targetX-0.5) / (xInterval.end - xInterval.start)) * chartWidth;
      const YInPixels = ((targetY-1.5) / (yInterval.end - yInterval.start)) * chartHeight;

      console.log(deltaXInPixels, deltaYInPixels);

      // Pan the chart
      chart.pan({ x: deltaXInPixels * 0.948, y: deltaYInPixels * 0.92});
      
      
      const lineSeries = chart.addLineSeries();

      console.log(mode(categories))

      lineSeries.setStrokeStyle(new SolidLine({
        thickness: 0.5,
        fillStyle: new SolidFill({ color: colorMap[mode(categories)] })


      
    })
      )

  //  const text = chart.addUIElement(UIElementBuilders.TextBox, { x: chart.getDefaultAxisX(), y: chart.getDefaultAxisY() })
  //    .setDraggingMode(UIDraggingModes.notDraggable)
  //    .setTextFont(f => f.setSize(30).setWeight(700).setStyle('normal'))
  //    .setTextFillStyle(new RadialGradientFill())
  //    .setBackground(b => b.setStrokeStyle(new SolidLine({
  //      thickness: 2,
  //      fillStyle: new LinearGradientFill()
  //    })))
  //    .setPosition({
  //      x: parseFloat(data_points[closest_points[0]][1].x),
  //      y: parseFloat(data_points[closest_points[0]][1].y),
  //    })
  //    .setText('Hello')
      


   closest_points.forEach((idx1) => {
    var point1 = data_points[idx1][1];
      lineSeries.add({x : point1.x, y : point1.y})
    })

    })

    // Add a line series
 

    

      const scatterSeries = chart.addPointSeries({colors : true})
    .setPointSize(1.5);

      

      scatterSeries.setCursorResultTableFormatter((tableBuilder, series, x, y, dataPoint) => {
        return tableBuilder
            .addRow(dataPoint.value.description);
    })


    scatterSeries.setPointFillStyle(new IndividualPointFill());
    // Add some data points
    data_points.forEach(point => {
        point = point[1];
        const color = colorMap[point.category] || '#000000'; // Default to black if category not found
        scatterSeries.add({ x: point.x, y: point.y, color : color, value : {"description" : point.description, "category" : point.category, "url" : point.url.substr(4, point.url.length)}});
      });

    chart.onSeriesBackgroundMouseDoubleClick((_, event) => {
      const nearestDataPoint = scatterSeries.solveNearestFromScreen(chart.engine.clientLocation2Engine(event.clientX, event.clientY)).location;
      window.open(nearestDataPoint.value.url, '_blank');
   })

  for (let i = 0; i < clusters.length; i++){

      var cluster_name = clusters[i][1].cluster_name;
      var color = colorMap[cluster_name.substr(0, cluster_name.length - 2)];
      color = color.setA(255);


      const axisX = chart.getDefaultAxisX()
      ;
    const axisY = chart.getDefaultAxisY()
      ;
        
      const text = chart.addUIElement(UIElementBuilders.TextBox, { x: axisX, y: axisY })
      .setText(cluster_name)
      .setTextFillStyle((style) => style
        .setColor(ColorRGBA(0, 0, 0)) // Set text color to black
      )
      .setBackground(background => background
        .setFillStyle(new SolidFill({ color: color }))
        .setStrokeStyle(new SolidLine({ color: ColorRGBA(0, 0, 0) }))
      )
            // NOTE: Axis coordinates!
        .setPosition({ x: clusters[i][1].x, y: clusters[i][1].y })
        // Stop user from moving the text
        .setMouseInteractions(false)
  }

  

      
    })


