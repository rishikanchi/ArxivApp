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



async function fetchGPTResponse(paperTitle) {
  const url = `https://free-chatgpt-api.p.rapidapi.com/chatask?prompt=Create%20a%20possible%20100-word%20abstract%20for%20a%20research%20paper%20given%20a%20paper%20title.%20I%20just%20want%20basic%20text%2C%20do%20not%20add%20anything%20else.%20Here%20is%20the%20${encodeURIComponent(paperTitle)}`;
  console.log(url);

  const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'f1bc9ba595msh1d207e7406e9a7ap101e7cjsna32e09462bdd',
        'x-rapidapi-host': 'free-chatgpt-api.p.rapidapi.com'
      }
  };

  try {
      const response = await fetch(url, options);
      const result = await response.text();
      return result;  // Assuming the response is a simple text
  } catch (error) {
      console.error('Error fetching GPT response:', error);
      return 'Unable to fetch description.';
  }
}

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

    var data_points = Object.entries(data).slice(0,100000);
    var clusters = Object.entries(data).slice(100000, Object.keys(data).length);
    
    const chart = lightningChart({
        license: "0002-n96ucKX1C700BOZwz7IAGHHjEuT4KwDfrkmx7QCyIBztfxcK2B2YdzqRkuyh0bv4JWu/viN/aCm4HYmBbVnGHphV-MEUCIQCoAbM5nVG3lu6EAeoZcsrvewNpdn+DEGKL6UpNeDXEbAIgCV8gVBAZ3XKPAkbuQDarCfg/BnBK4sN+L00cqoYMu5E=",
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
    
    chart.setTitle('')
    chart.pan({x: -700, y: 300})
    
    const scatterSeries = chart.addPointSeries({colors : true})
        .setPointSize(4) // Increased point size

    scatterSeries.setCursorResultTableFormatter((tableBuilder, series, x, y, dataPoint) => {
        return tableBuilder
            .addRow(dataPoint.value.description);
    })

    scatterSeries.setPointFillStyle(new IndividualPointFill());

    // Add paper details panel interaction
    const paperDetails = document.querySelector('.paper-details');
    const paperTitle = paperDetails.querySelector('.paper-title');
    const paperCategory = paperDetails.querySelector('.paper-category');
    const paperDescription = paperDetails.querySelector('.paper-description');
    const paperLink = paperDetails.querySelector('.paper-link');

    // Show paper details on click
    chart.onSeriesBackgroundMouseClick((_, event) => {
        const nearestDataPoint = scatterSeries.solveNearestFromScreen(
            chart.engine.clientLocation2Engine(event.clientX, event.clientY)
        ).location;

        if (nearestDataPoint) {
          // Show paper details panel
          paperDetails.classList.add('active');
      
          // Update paper details
          const titleText = nearestDataPoint.value.description.split('.')[0] + '.';
          paperTitle.textContent = titleText;
          paperCategory.textContent = nearestDataPoint.value.category;
      
          // Initially set the description to loading message
          paperDescription.textContent = 'Loading AI analysis of paper abstract...';
      
          // Fetch and update the paper description using GPT
          // Fetch and update the paper description using GPT
          fetchGPTResponse(titleText).then(gptResponse => {
            // Parse the response and extract the 'response' field
              const parsedResponse = JSON.parse(gptResponse);
              paperDescription.textContent = parsedResponse.response || 'No description available.'; // Display the GPT response
          }).catch(error => {
              paperDescription.textContent = 'Unable to fetch description.'; // Handle error
          });

          // Update the link
          paperLink.href = "https://" + nearestDataPoint.value.url.split("//")[1];

          // Update category color
          const categoryColor = colorMap[nearestDataPoint.value.category];
          if (categoryColor) {
              paperCategory.style.backgroundColor = `rgba(${categoryColor.r}, ${categoryColor.g}, ${categoryColor.b}, 0.2)`;
              paperCategory.style.color = `rgba(${categoryColor.r}, ${categoryColor.g}, ${categoryColor.b}, 1)`;
          }
      }
      
    });

    // Add data points
    data_points.forEach(point => {
        point = point[1];
        const color = colorMap[point.category] || '#000000';
        scatterSeries.add({ 
            x: point.x, 
            y: point.y, 
            color: color, 
            value: {
                "description": point.description, 
                "category": point.category, 
                "url": point.url.substr(4, point.url.length)
            }
        });
    });

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

            function getIndexesOfNSmallestElements(arr, n) {
                const indexedArray = arr.map((value, index) => ({ value, index }));
                indexedArray.sort((a, b) => a.value - b.value);
                const smallestElements = indexedArray.slice(0, n);
                const indexes = smallestElements.map(element => element.index);
                return indexes;
            }

            function mode(array) {
                if(array.length == 0) return null;
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

            // Pan the chart
            chart.pan({ x: deltaXInPixels * 0.948, y: deltaYInPixels * 0.92});
            
            const lineSeries = chart.addLineSeries();

            const dominantCategory = mode(categories);

            lineSeries.setStrokeStyle(new SolidLine({
                thickness: 0.5,
                fillStyle: new SolidFill({ color: colorMap[dominantCategory] })
            }));

            closest_points.forEach((idx1) => {
                var point1 = data_points[idx1][1];
                lineSeries.add({x : point1.x, y : point1.y});
            });
        });

    // Add cluster labels
    for (let i = 0; i < clusters.length; i++) {
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
            .setMouseInteractions(false);
    }

    // Add click handler to close paper details when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideChart = event.target.closest('#chart');
        const isClickInsidePaperDetails = event.target.closest('.paper-details');
        
        if (!isClickInsideChart && !isClickInsidePaperDetails) {
            paperDetails.classList.remove('active');
        }
    });

    // Add escape key handler to close paper details
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            paperDetails.classList.remove('active');
        }
    });
});