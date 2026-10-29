// scatter.js
d3.csv("data/tv_all.csv", d => ({
    star: +d.star2,
    energy: +d.energy_consumpt
})).then(data => {
    const width = 500, height = 300;
    const margin = {top: 25, right: 25, bottom: 45, left: 55};


    const svg = d3.select("#scatter-plot")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.star) + 0.5])
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.energy) + 50])
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).ticks(8));

    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));

    svg.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => xScale(d.star))
        .attr("cy", d => yScale(d.energy))
        .attr("r", 4)
        .attr("fill", "#1e88e5")
        .attr("opacity", 0.6);
}).catch(err => console.error("Error scatter.js:", err));
