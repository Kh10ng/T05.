// line.js
d3.csv("data/spot_prices.csv", d => ({
    year: +d.Year,
    avg: +d["Average Price (notTas-Snowy)"]
})).then(data => {
    const cleanData = data.filter(d => !isNaN(d.year) && !isNaN(d.avg));
    const width = 500, height = 300;
    const margin = {top: 25, right: 25, bottom: 45, left: 55};


    const svg = d3.select("#line-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

    const xScale = d3.scaleLinear()
        .domain(d3.extent(cleanData, d => d.year))
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(cleanData, d => d.avg) + 20])
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));

    const line = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.avg));

    svg.append("path")
        .datum(cleanData)
        .attr("fill", "none")
        .attr("stroke", "#e53935")
        .attr("stroke-width", 2.5)
        .attr("d", line);
}).catch(err => console.error("Error line.js:", err));