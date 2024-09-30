const { lightningChart, UIDraggingModes, RadialGradientFill, LinearGradientFill, IndividualPointFill, ColorRGBA, UIElementBuilders, SolidLine, SolidFill, transparentFill, emptyFill, AxisTickStrategies, emptyFillStyle, emptyLine, UIOrigins, Themes} = lcjs;

const colorMap = {
  "Astrophysics" : ColorRGBA(245, 66, 66),
  "Condensed Material" : ColorRGBA(245, 111, 66),
  "Computer Science" : ColorRGBA(245, 167, 66),
 "Economics" : ColorRGBA(227, 245, 66),
  "Electrical Engineering and Systems Science" : ColorRGBA(182, 245, 66),
  "General Relativity and Quantum Cosmology" : ColorRGBA(111, 245, 66),
  "High Energy Physics - Experiment" : ColorRGBA(66, 245, 108),
  "High Energy Physics - Lattice" : ColorRGBA(66, 245, 153),
  "High Energy Physics - Phenomenology" : ColorRGBA(66, 245, 153),
  "High Energy Physics - Theory" : ColorRGBA(66, 245, 200),
  "Mathematics" : ColorRGBA(66, 227, 245),
  "Mathematical Physics" : ColorRGBA(66, 164, 245),
  "Nonlinear Sciences" : ColorRGBA(66, 90, 245),
  "Nuclear Experiment" : ColorRGBA(123, 66, 245),
  "Nuclear Theory" : ColorRGBA(185, 66, 245),
  "Physics" : ColorRGBA(245, 66, 227),
  "Quantitative Biology" : ColorRGBA(245, 66, 182),
  "Quantitative Finance" : ColorRGBA(245, 66, 147),
  "Quantum Physics" : ColorRGBA(245, 66, 114),
  "Statistics" : ColorRGBA(245, 66, 93)
};

fetch('/api/mydata')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    let newArray = data.map(obj => {
        const { _id, ...rest } = obj;
        return rest; 
      });
      console.log("once more");

    var data_points = Object.entries(data).slice(0,100000);
    var clusters = Object.entries(data).slice(100000, Object.keys(data).length);

    const chart = lightningChart({
      license: "0002-n3X9iO0Z5d9OhoPGWWdBxAQ6SdnSKwB0/bH5AezBWp6K2IHfmcHtrmGsuEfyKfMUywnFPEbJ/vz5wfxYNmTstcut-MEYCIQDBYzSNR+IpXP765q1bC8E4xWsWHfWS0CLLjh2DYiBi0wIhAOMmdh9c3bmnsXnk6b5Xd+ngHLhuM0pJSapgpHg21+Br",
      licenseInformation: {
          appTitle: "LightningChart JS Trial",
          company: "LightningChart Ltd."
      },
    }).ChartXY({
      container: 'chartContainer',
      theme: Themes.light
    }).setTitle('Web of Research')
    
    chart.setBackgroundFillStyle(new SolidFill({ color: ColorRGBA(255, 255, 255, 255) }))
    chart.setBackgroundStrokeStyle(emptyLine)
    
    // Remove the chart title
    chart.setTitle('')
    chart.pan({x: -700, y: 300})

    // Change axes colors and text to white
    const axisX = chart.getDefaultAxisX()
    const axisY = chart.getDefaultAxisY()
    
    // Set tick strategy to modify tick appearance and remove grid lines
    axisX.setTickStrategy(AxisTickStrategies.Numeric, (strategy) => 
      strategy
        .setMajorTickStyle((major) => major
          .setLabelFillStyle(new SolidFill({ color: ColorRGBA(255, 255, 255) }))
          .setGridStrokeStyle(emptyLine)
        )
        .setMinorTickStyle((minor) => minor
          .setLabelFillStyle(new SolidFill({ color: ColorRGBA(255, 255, 255) }))
          .setGridStrokeStyle(emptyLine)
        )
    )
    axisY.setTickStrategy(AxisTickStrategies.Numeric, (strategy) => 
      strategy
        .setMajorTickStyle((major) => major
          .setLabelFillStyle(new SolidFill({ color: ColorRGBA(255, 255, 255) }))
          .setGridStrokeStyle(emptyLine)
        )
        .setMinorTickStyle((minor) => minor
          .setLabelFillStyle(new SolidFill({ color: ColorRGBA(255, 255, 255) }))
          .setGridStrokeStyle(emptyLine)
        )
    )
    
    // Set axis line color
    axisX.setStrokeStyle(new SolidLine({ thickness: 2, fillStyle: new SolidFill({ color: ColorRGBA(255, 255, 255) }) }))
    axisY.setStrokeStyle(new SolidLine({ thickness: 2, fillStyle: new SolidFill({ color: ColorRGBA(255, 255, 255) }) }))

    fetch('/api/mydata2')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      chart.getDefaultAxisX().zoom(0, -4.9)
      chart.getDefaultAxisY().zoom(0, -4.9)
      console.log(data);

      function getIndexesOfNSmallestElements(arr, n) {
        const indexedArray = arr.map((value, index) => ({ value, index }));
        indexedArray.sort((a, b) => a.value - b.value);
        const smallestElements = indexedArray.slice(0, n);
        const indexes = smallestElements.map(element => element.index);
        return indexes;
      }

      function mode(array) {
          if(array.length == 0)
              return null;
          var modeMap = {};
          var maxEl = array[0], maxCount = 1;
          for(var i = 0; i < array.length; i++) {
              var el = array[i];
              if(modeMap[el] == null)
                  modeMap[el] = 1;
              else
                  modeMap[el]++;  
              if(modeMap[el] > maxCount) {
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

      const xMin = xAxis.getInterval().start;
      const xMax = xAxis.getInterval().end;
      const yMin = yAxis.getInterval().start;
      const yMax = yAxis.getInterval().end;

      const currentXCenter = (xMin + xMax) / 2;
      const currentYCenter = (yMin + yMax) / 2;

      const xInterval = xAxis.getInterval();
      const yInterval = yAxis.getInterval();

      const deltaX = targetX - currentXCenter;
      const deltaY = targetY - currentYCenter;

      const chartRect = chart.engine.container.getBoundingClientRect();
      const chartWidth = chartRect.width;
      const chartHeight = chartRect.height;

      const deltaXInPixels = (deltaX / (xInterval.end - xInterval.start)) * chartWidth;
      const deltaYInPixels = (deltaY / (yInterval.end - yInterval.start)) * chartHeight;

      const XInPixels = ((targetX-0.5) / (xInterval.end - xInterval.start)) * chartWidth;
      const YInPixels = ((targetY-1.5) / (yInterval.end - yInterval.start)) * chartHeight;

      console.log(deltaXInPixels, deltaYInPixels);

      chart.pan({ x: deltaXInPixels * 0.948, y: deltaYInPixels * 0.92});
      
      const lineSeries = chart.addLineSeries();

      console.log(mode(categories))

      lineSeries.setStrokeStyle(new SolidLine({
        thickness: 0.5,
        fillStyle: new SolidFill({ color: colorMap[mode(categories)] })
      }))

      // Create a new point series for the selected points
      const selectedPointsSeries = chart.addPointSeries({ colors: true })
        .setPointSize(6); // Increased size for selected points

      selectedPointsSeries.setPointFillStyle(new IndividualPointFill());

      closest_points.forEach((idx1) => {
        var point1 = data_points[idx1][1];
        lineSeries.add({x : point1.x, y : point1.y})

        // Add the point to the selectedPointsSeries
        const color = colorMap[point1.category] || '#000000';
        selectedPointsSeries.add({ 
          x: point1.x, 
          y: point1.y, 
          color: color, 
          value: {
            "description": point1.description, 
            "category": point1.category, 
            "url": point1.url.substr(4, point1.url.length)
          }
        });
      })

      // Enable double-click functionality for selected points
      selectedPointsSeries.onMouseDoubleClick((_, event) => {
        const nearestDataPoint = selectedPointsSeries.solveNearestFromScreen(chart.engine.clientLocation2Engine(event.clientX, event.clientY)).location;
        if (nearestDataPoint) {
          window.open(nearestDataPoint.value.url, '_blank');
        }
      });
    })

    const scatterSeries = chart.addPointSeries({colors : true})
      .setPointSize(1.5);  // Changed from 3 to 1.5 to make non-selected points smaller

    scatterSeries.setCursorResultTableFormatter((tableBuilder, series, x, y, dataPoint) => {
      return tableBuilder
          .addRow(dataPoint.value.description);
    })

    scatterSeries.setPointFillStyle(new IndividualPointFill());

    data_points.forEach(point => {
        point = point[1];
        const color = colorMap[point.category] || '#000000';
        scatterSeries.add({ x: point.x, y: point.y, color : color, value : {"description" : point.description, "category" : point.category, "url" : point.url.substr(4, point.url.length)}});
    });

    chart.onSeriesBackgroundMouseDoubleClick((_, event) => {
      const nearestDataPoint = scatterSeries.solveNearestFromScreen(chart.engine.clientLocation2Engine(event.clientX, event.clientY)).location;
      if (nearestDataPoint) {
        window.open(nearestDataPoint.value.url, '_blank');
      }
    })

    for (let i = 0; i < clusters.length; i++){
      var cluster_name = clusters[i][1].cluster_name;
      var color = colorMap[cluster_name.substr(0, cluster_name.length - 2)];
      color = color.setA(255);

      const axisX = chart.getDefaultAxisX();
      const axisY = chart.getDefaultAxisY();
      
      const text = chart.addUIElement(UIElementBuilders.TextBox, { x: axisX, y: axisY })
        .setText(cluster_name)
        .setTextFillStyle((style) => style
          .setColor(ColorRGBA(0, 0, 0))
        )
        .setBackground(background => background
          .setFillStyle(new SolidFill({ color: color }))
          .setStrokeStyle(new SolidLine({ color: ColorRGBA(0, 0, 0) }))
        )
        .setPosition({ x: clusters[i][1].x, y: clusters[i][1].y })
        .setMouseInteractions(false)
    }
  })
