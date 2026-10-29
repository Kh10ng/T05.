// js/donut.js
d3.csv("data/tv_combined_distribution.csv", d => ({
    tech: d.Screen_Tech,
    value: +d["Mean(Labelled energy consumption (kWh/year))"]
})).then(data => {
    const width = 500, height = 400;
    const radius = Math.min(width, height) / 2 - 30;

    const svg = d3.select("#donut-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.tech))
        .range(["#2b5c8f", "#d95f02", "#7570b3"]);

    const pie = d3.pie()
        .value(d => d.value)
        .sort(null);

    const arc = d3.arc()
        .innerRadius(radius * 0.55) // inner radius cutout turns a pie chart into a clean donut chart
        .outerRadius(radius)
        .padAngle(0.03); // clean whitespace divider gap between tech segments

    const arcs = svg.selectAll("path")
        .data(pie(data))
        .join("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.tech));

    // Dynamic Segment Text Labels
    svg.selectAll("text")
        .data(pie(data))
        .join("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "#fff")
        .style("font-weight", "bold")
        .text(d => d.data.tech);
});