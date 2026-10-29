// bar.js
d3.csv("data/tv_55inch_mean.csv", d => ({
    tech: d.Screen_Tech,
    value: +d["Mean(Labelled energy consumption (kWh/year))"]
})).then(data => {
    const width = 500, height = 300;
    const margin = {top: 25, right: 25, bottom: 45, left: 55};

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

    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));

    svg.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", d => xScale(d.tech))
        .attr("y", d => yScale(d.value))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - margin.bottom - yScale(d.value))
        .attr("fill", "#43a047");
}).catch(err => console.error("Error bar.js:", err));
