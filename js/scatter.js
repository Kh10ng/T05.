// js/scatter.js
d3.csv("data/tv_all.csv", d => ({
    star: +d.star2,
    energy: +d.energy_consumpt,
    brand: d.brand
})).then(data => {
    const parent = d3.select("#scatter-plot");
    const width = 600, height = 400;
    const margin = {top: 20, right: 30, bottom: 50, left: 60};

    const svg = parent.append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.star) + 0.5])
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.energy) + 50])
        .range([height - margin.bottom, margin.top]);

    // X Axis
    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).ticks(10))
        .style("font-size", "11px");

    // Y Axis
    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale))
        .style("font-size", "11px");

    // Scatter Circles
    svg.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => xScale(d.star))
        .attr("cy", d => yScale(d.energy))
        .attr("r", 4.5)
        .attr("fill", "#3182bd")
        .attr("opacity", 0.6);

    // Labels
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "600")
        .text("Star Rating");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "600")
        .text("Energy Consumption (kWh/year)");
});