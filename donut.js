// donut.js
d3.csv("data/tv_combined_distribution.csv", d => ({
    tech: d.Screen_Tech,
    value: +d["Mean(Labelled energy consumption (kWh/year))"]
})).then(data => {
    const width = 500, height = 300;
    const radius = Math.min(width, height) / 2 - 20;

    const svg = d3.select("#donut-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.tech))
        .range(["#1e88e5", "#f4511e", "#8e24aa"]);

    const pie = d3.pie().value(d => d.value).sort(null);
    const arc = d3.arc().innerRadius(radius * 0.5).outerRadius(radius);

    svg.selectAll("path")
        .data(pie(data))
        .join("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.tech))
        .attr("stroke", "#fff")
        .attr("stroke-width", 2);

// Build a secondary helper arc to position text cleanly inside the segments
const labelArc = d3.arc()
    .innerRadius(radius * 0.65) 
    .outerRadius(radius);

    svg.selectAll("text")
        .data(pie(data))
        .join("text")
        .attr("transform", d => `translate(${labelArc.centroid(d)})`) 
        .attr("text-anchor", "middle")
        .style("font-family", "sans-serif")
        .style("font-size", "11px")
        .style("fill", "#fff")
        .style("font-weight", "bold")
        .text(d => d.data.tech);
}).catch(err => console.error("Error donut.js:", err));
