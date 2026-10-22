const drawHistogram = (data) => {
    // Step 6.1 Set the dimensions and margins of the chart area
    const svg = d3.select("#histogram")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

    // Create an inner chart group with margins
    const innerChart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Step 6.2 Set up bins
    const bins = binGenerator(data); 
    console.log(bins); 

    // Step 6.3 Get the lower and upper bounds of bins
    const minEng = bins[0].x0; 
    const maxEng = bins[bins.length - 1].x1; 
    const binsMaxLength = d3.max(bins, d => d.length); 

    // Define scales (from shared constants)
    xScale
        .domain([minEng, maxEng])
        .range([0, innerWidth]);
    
    yScale
        .domain([0, binsMaxLength])
        .range([innerHeight, 0])
        .nice(); 

    // Step 6.4 Draw the bars of the histogram
    innerChart
        .selectAll("rect")
        .data(bins)
        .join("rect")
        .attr("x", d => xScale(d.x0))
        .attr("y", d => yScale(d.length))
        .attr("width", d => xScale(d.x1) - xScale(d.x0))
        .attr("height", d => innerHeight - yScale(d.length))
        .attr("fill", barColor)
        .attr("stroke", bodyBackgroundColor) 
        .attr("stroke-width", 2);

    // Step 6.5 Add axes
    // Add the x-axis to the bottom of the inner chart
    const bottomAxis = d3.axisBottom(xScale);
    innerChart
        .append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(bottomAxis);

    // Add the x-axis label
    svg
        .append("text")
        .text("Labeled Energy Consumption (kWh/year)")
        .attr("text-anchor", "end")
        .attr("x", width - 20)
        .attr("y", height - 5)
        .attr("class", "axis-label");

    // Step 6.6 Add left axis
    const leftAxis = d3.axisLeft(yScale);
    innerChart
        .append("g")
        .attr("class", "y-axis") // Add class to select it later for updates
        .call(leftAxis);

    // Add the y-axis label
    svg
        .append("text")
        .text("Frequency")
        .attr("x", 30)
        .attr("y", 20)
        .attr("class", "axis-label");
};