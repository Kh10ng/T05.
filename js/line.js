// js/line.js
d3.csv("data/spot_prices.csv", d => ({
    year: +d.Year,
    qld: +d["Queensland ($ per megawatt hour)"],
    nsw: +d["New South Wales ($ per megawatt hour)"],
    vic: +d["Victoria ($ per megawatt hour)"],
    sa: +d["South Australia ($ per megawatt hour)"],
    avg: +d["Average Price (notTas-Snowy)"]
})).then(data => {
    // Filter out rows without structured averages to ensure paths do not break
    const cleanData = data.filter(d => !isNaN(d.year) && !isNaN(d.avg));

    const width = 600, height = 400;
    const margin = {top: 30, right: 120, bottom: 40, left: 50};

    const svg = d3.select("#line-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

    const xScale = d3.scaleLinear()
        .domain(d3.extent(cleanData, d => d.year))
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(cleanData, d => Math.max(d.qld, d.nsw, d.vic, d.sa)) + 20])
        .range([height - margin.bottom, margin.top]);

    // Setup Line Generators
    const createLinePath = (stateKey) => d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d[stateKey]));

    // States configuration object map
    const series = [
        { key: "qld", color: "#b2df8a", name: "QLD" },
        { key: "nsw", color: "#33a02c", name: "NSW" },
        { key: "vic", color: "#fb9a99", name: "VIC" },
        { key: "sa", color: "#fdbf6f", name: "SA" }
    ];

    // Plot regional raw lines thin
    series.forEach(s => {
        svg.append("path")
            .datum(cleanData)
            .attr("fill", "none")
            .attr("stroke", s.color)
            .attr("stroke-width", 1.5)
            .attr("d", createLinePath(s.key));

        // Inline labels at end of paths
        const lastRow = cleanData[cleanData.length - 1];
        svg.append("text")
            .attr("x", xScale(lastRow.year) + 5)
            .attr("y", yScale(lastRow[s.key]) + 3)
            .style("fill", s.color)
            .style("font-size", "10px")
            .style("font-weight", "bold")
            .text(s.name);
    });

    // Draw the National Baseline Average line extra wide for clear emphasis contrast
    svg.append("path")
        .datum(cleanData)
        .attr("fill", "none")
        .attr("stroke", "#e31a1c")
        .attr("stroke-width", 3.5)
        .attr("d", createLinePath("avg"));

    const lastRow = cleanData[cleanData.length - 1];
    svg.append("text")
        .attr("x", xScale(lastRow.year) + 5)
        .attr("y", yScale(lastRow.avg) + 4)
        .style("fill", "#e31a1c")
        .style("font-size", "11px")
        .style("font-weight", "bold")
        .text("🏆 NAT Avg");

    // Build Axes
    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")))
        .style("font-size", "11px");

    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale))
        .style("font-size", "11px");
});