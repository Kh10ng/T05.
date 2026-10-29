// js/bar.js
d3.csv("data/tv_55inch_mean.csv", d => ({
    tech: d.Screen_Tech,
    value: +d["Mean(Labelled energy consumption (kWh/year))"]
})).then(data => {
    const width = 500, height = 400;
    const margin = {top: 30, right: 20, bottom: 50, left: 60};

    const svg = d3.select("#bar-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.tech))
        .range([margin.left, width - margin.right])
        .padding(0.4);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value) + 50])
        .range([height - margin.bottom, margin.top]);

    // Draw Bars
    svg.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", d => xScale(d.tech))
        .attr("y", d => yScale(d.value))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - margin.bottom - yScale(d.value))
        .attr("fill", "#2ca25f");

    // X Axis
    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale))
        .style("font-size", "12px");

    // Y Axis
    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale))
        .style("font-size", "11px");

    // Y Axis Title label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 18)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "600")
        .text("Mean Consumption (kWh/year)");
});