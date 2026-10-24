const drawScatterplot = (data) => {
    const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

    innerChartS = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Set up the ranges once (domains will be updated dynamically)
    xScaleS.range([0, innerWidth]);
    yScaleS.range([innerHeight, 0]);

    const xExtent = d3.extent(data, d => d.star);
    const yExtent = d3.extent(data, d => d.screenSize);

    xScaleS.domain([xExtent[0] - 0.5, xExtent[1] + 0.5]);
    yScaleS.domain([yExtent[0], yExtent[1]]).nice();

    // Add classes to axes so we can update them later
    innerChartS.append("g")
        .attr("class", "x-axis-s")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScaleS));

    innerChartS.append("g")
        .attr("class", "y-axis-s")
        .call(d3.axisLeft(yScaleS));

    // Draw circles
    innerChartS.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => xScaleS(d.star))
        .attr("cy", d => yScaleS(d.screenSize))
        .attr("r", 4)
        .attr("fill", d => colorScale(d.screenTech))
        .attr("opacity", 0.5); 

    // Labels and Legend
    svg.append("text").text("Star Rating").attr("text-anchor", "end").attr("x", width - 20).attr("y", height - 5).attr("class", "axis-label");
    svg.append("text").text("Screen size (inches)").attr("x", 20).attr("y", 20).attr("class", "axis-label");

    const uniqueTechs = [...new Set(data.map(d => d.screenTech))];
    const legend = svg.append('g').attr('class', 'legend').attr('transform', `translate(${width - 140}, ${margin.top})`);

    uniqueTechs.forEach((tech, i) => {
        const g = legend.append('g').attr('transform', `translate(0, ${i * 22})`);
        g.append('rect').attr('width', 12).attr('height', 12).attr('fill', colorScale(tech));
        g.append('text').attr('x', 18).attr('y', 10).text(tech).attr('class', 'axis-label');
    });
};

// Update Scatterplot dynamically
const updateScatterplot = (updatedData) => {
    // 1. Update the domains (handle empty data just in case)
    if (updatedData.length > 0) {
        xScaleS.domain(d3.extent(updatedData, d => d.star)).nice();
        yScaleS.domain(d3.extent(updatedData, d => d.screenSize)).nice();
    } else {
        xScaleS.domain([0, 1]);
        yScaleS.domain([0, 1]);
    }

    // 2. Update the axes smoothly
    innerChartS.select(".x-axis-s").transition().duration(500).call(d3.axisBottom(xScaleS));
    innerChartS.select(".y-axis-s").transition().duration(500).call(d3.axisLeft(yScaleS));

    // 3. Update the circles using the D3 join pattern
    innerChartS.selectAll("circle")
        .data(updatedData)
        .join(
            enter => enter.append("circle")
                .attr("cx", d => xScaleS(d.star))
                .attr("cy", d => yScaleS(d.screenSize))
                .attr("r", 4)
                .attr("fill", d => colorScale(d.screenTech))
                .attr("opacity", 0.5),
            update => update.transition().duration(500)
                .attr("cx", d => xScaleS(d.star))
                .attr("cy", d => yScaleS(d.screenSize)),
            exit => exit.transition().duration(500).attr("r", 0).remove()
        );

    // 4. Re-attach mouse events to the newly updated dots
    handleMouseEvents();
};