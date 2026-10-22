const populateFilters = (data) => {
    // 1. Create Screen Tech Buttons
    d3.select("#filters_screen")
        .selectAll(".filter")
        .data(filters_screen)
        .join("button")
        .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
        .text(d => d.label)
        .on("click", (e, d) => {
            filters_screen.forEach(filter => filter.isActive = (filter.id === d.id));
            d3.select("#filters_screen").selectAll(".filter")
                .classed("active", filter => filter.id === d.id);
            updateHistogram(data); // Trigger update
        });

    // 2. Create Screen Size Buttons (NEW)
    d3.select("#filters_size")
        .selectAll(".filter")
        .data(filters_size)
        .join("button")
        .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
        .text(d => d.label)
        .on("click", (e, d) => {
            filters_size.forEach(filter => filter.isActive = (filter.id === d.id));
            d3.select("#filters_size").selectAll(".filter")
                .classed("active", filter => filter.id === d.id);
            updateHistogram(data); // Trigger update
        });
};

const updateHistogram = (data) => {
    // 1. Figure out which Tech and Size buttons are currently active
    const activeTech = filters_screen.find(f => f.isActive).id;
    const activeSize = filters_size.find(f => f.isActive).id;

    // 2. Filter the data based on BOTH active buttons
    const updatedData = data.filter(tv => {
        const techMatch = (activeTech === "all" || tv.screenTech === activeTech);
        // We use +activeSize to convert the string ID (e.g., "55") to a number
        const sizeMatch = (activeSize === "all" || tv.screenSize === +activeSize);
        return techMatch && sizeMatch;
    });

    // 3. Generate new bins
    const updatedBins = binGenerator(updatedData);
    
    // 4. Update the y-scale based on the new max frequency
    const newMaxLength = d3.max(updatedBins, d => d.length) || 0;
    yScale.domain([0, newMaxLength]).nice();

    // 5. Update the y-axis smoothly
    d3.select(".y-axis")
        .transition()
        .duration(500)
        .call(d3.axisLeft(yScale));

    // 6. Update the bars with a smooth transition
    d3.select("#histogram")
        .selectAll("rect")
        .data(updatedBins)
        .transition()
        .duration(500)
        .ease(d3.easeCubicInOut)
        .attr("y", d => yScale(d.length))
        .attr("height", d => innerHeight - yScale(d.length));
};