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
            updateCharts(data); // Changed name
        });

    // 2. Create Screen Size Buttons
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
            updateCharts(data); // Changed name
        });
};

// update on both charts
const updateCharts = (data) => {
    const activeTech = filters_screen.find(f => f.isActive).id;
    const activeSize = filters_size.find(f => f.isActive).id;

    const updatedData = data.filter(tv => {
        const techMatch = (activeTech === "all" || tv.screenTech === activeTech);
        const sizeMatch = (activeSize === "all" || tv.screenSize === +activeSize);
        return techMatch && sizeMatch;
    });

    // Update the Histogram
    const updatedBins = binGenerator(updatedData);
    const newMaxLength = d3.max(updatedBins, d => d.length) || 0;
    yScale.domain([0, newMaxLength]).nice();

    d3.select(".y-axis").transition().duration(500).call(d3.axisLeft(yScale));

    d3.select("#histogram").selectAll("rect")
        .data(updatedBins)
        .transition().duration(500).ease(d3.easeCubicInOut)
        .attr("y", d => yScale(d.length))
        .attr("height", d => innerHeight - yScale(d.length));

    // Update the Scatterplot (Call the new function)
    updateScatterplot(updatedData);
};

const createTooltip = () => {
    const tooltip = innerChartS.append("g").attr("class", "tooltip").style("opacity", 0);
    tooltip.append("rect").attr("width", tooltipWidth).attr("height", tooltipHeight).attr("rx", 3).attr("ry", 3).attr("fill", barColor).attr("fill-opacity", 0.75);
    tooltip.append("text").text("NA").attr("x", tooltipWidth / 2).attr("y", tooltipHeight / 2 + 2).attr("text-anchor", "middle").attr("alignment-baseline", "middle").attr("fill", "white").style("font-weight", 900);
};

const handleMouseEvents = () => {
    const tooltip = innerChartS.select(".tooltip");
    innerChartS.selectAll("circle")
        .on("mouseenter", (e, d) => {
            tooltip.select("text").text(d.screenSize);
            const cx = +e.target.getAttribute("cx");
            const cy = +e.target.getAttribute("cy");
            tooltip.attr("transform", `translate(${cx - 0.5 * tooltipWidth}, ${cy - 1.5 * tooltipHeight})`).transition().duration(200).style("opacity", 1);
        })
        .on("mouseleave", () => {
            tooltip.style("opacity", 0).attr("transform", `translate(0, 500)`);
        });
};