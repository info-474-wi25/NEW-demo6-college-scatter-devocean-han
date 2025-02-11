// 1: CREATE BLANK SVG
// Set dimensions and margins for the scatter plot
const margin = { top: 50, right: 30, bottom: 60, left: 100 },
      width = 800 - margin.left - margin.right, // Actual chart width
      height = 600 - margin.top - margin.bottom; // Actual chart height

// Create the SVG container, setting the full width and height including margins
const svgScatter = d3.select("#scatterPlot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)  // Total width with margins
    .attr("height", height + margin.top + margin.bottom)  // Total height with margins
    .append("g") // Append a `g` element to position the chart content correctly within the SVG
    .attr("transform", `translate(${margin.left},${margin.top})`);  // Offset by the top and left margins

// 2: LOAD...
d3.csv("colleges.csv").then(data => {
    // 2: ... AND REFORMAT DATA
    data.forEach(d => {
        // d["new_column_name"] = +d["original_column_name_with_non_numeric_values"]
        d["earnings"] = +d["Median Earnings 8 years After Entry"];
        d["debt"] = +d["Median Debt on Graduation"];
    })
    // console.log(
    //     typeof data[0]['earnings']
    //     , typeof data[0]['Median Earnings 8 years After Entry']
    // )
    // 3: SET AXES SCALES
    // 3.1 X-scale: earnings
    const xEarnings = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.earnings)]) // range of input data
        .range([0, width]) // range of output data
    // 3.2 Y-scale: debt
    const yDebt = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.debt)]) // range of input data
        .range([height, 0]) // range of output data

    // 4: PLOT POINTS
    svgScatter
        .attr("class", "scatter") // class 설정은 최초로 먹여줘야 적용됨
        .selectAll("circle") // "shape" = circle, rectangle, line, etc.
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return xEarnings(d["earnings"])
        })
        .attr("cy", d => yDebt(d.debt))
        .attr("r", 5);

    // 5: AXES
    // Add x-axis
    svgScatter.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xEarnings)) // axisBottom = x축 선의 '아래'에 틱을 긋겠다. 
        
    // Add y-axis
    svgScatter.append("g")
        .call(d3.axisLeft(yDebt)) // = y축 선의 '왼쪽'에 틱을 삐져나오게 하겠다.
    
    // 6: ADD LABELS
    // Add title
    svgScatter.append("text")
        .attr("class", "title")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2) // centered 
        .text("Median Earnings 8 Years After Entries v.s. Median Debt upon Graduation")
        
    // Add x-axis label
    svgScatter.append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height + (margin.bottom / 2)) // centered 
        .text("Earnings ($)")
        
    // Add y-axis label
    svgScatter.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left / 2 - 20) // centered in left margin (+ 왼쪽으로 20px 만큼)
        .text("Median Debt ($)")
    

    // [optional challenge] 7: ADD TOOL-TIP
    // Follow directions on this slide: https://docs.google.com/presentation/d/1pmG7dC4dLz-zfiQmvBOFnm5BC1mf4NpG/edit#slide=id.g32f77c1eff2_0_159
    //Your code...
});
