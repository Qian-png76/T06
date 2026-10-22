const drawScatterplot = (data) => {
    // T06-2 Step 2.2 Set the dimensions and margins of the chart area
    const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

    // Create an inner chart group with margins
    innerChartS = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // T06-2 Step 2.3 Set up x and y scales using data extents
    const xScaleS = d3.scaleLinear()
        .domain(d3.extent(data, d => d.star))
        .nice()
        .range([0, innerWidth]);

    const yScaleS = d3.scaleLinear()
        .domain(d3.extent(data, d => d.screenSize))
        .nice()
        .range([innerHeight, 0]);

    // T06-2 Step 2.4 Set up colours (colorScale is in shared-constants.js)

    // T06-2 Step 2.5 Draw the circles
    innerChartS.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => xScaleS(d.star))
        .attr("cy", d => yScaleS(d.screenSize))
        .attr("r", 4)
        .attr("fill", d => colorScale(d.screenTech))
        .attr("opacity", 0.6)
        .attr("stroke", "white")
        .attr("stroke-width", 0.5)
        .style("cursor", "pointer");

    // T06-2 Step 2.6 Add bottom and left axis
    const bottomAxis = d3.axisBottom(xScaleS);
    innerChartS.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(bottomAxis);

    const leftAxis = d3.axisLeft(yScaleS);
    innerChartS.append("g")
        .call(leftAxis);

    // Axis Labels
    svg.append("text")
        .text("Star Rating")
        .attr("text-anchor", "end")
        .attr("x", width - 20)
        .attr("y", height - 5)
        .attr("class", "axis-label");

    svg.append("text")
        .text("Screen Size (inches)")
        .attr("x", 20)
        .attr("y", 20)
        .attr("class", "axis-label");

    // T06-2 Step 2.7 Add legend on the right-hand side
    const legend = innerChartS.append("g")
        .attr("transform", `translate(${innerWidth - 80}, 10)`);

    const techs = ["LED", "LCD", "OLED"];
    
    techs.forEach((tech, i) => {
        const legendRow = legend.append("g")
            .attr("transform", `translate(0, ${i * 20})`);

        legendRow.append("circle")
            .attr("r", 5)
            .attr("fill", colorScale(tech));

        legendRow.append("text")
            .text(tech)
            .attr("x", 10)
            .attr("y", 4)
            .style("font-size", "12px")
            .attr("fill", "#333");
    });
};