// URL to fetch the data from
const dataUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

// Fetch the data
fetch(dataUrl)
	.then((response) => {
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json(); // Parse the JSON response
	})
	.then((data) => {
		createChart(data.data); // Pass the dataset to createChart
	})
	.catch((error) => {
		console.error("Error fetching the data:", error);
	});

// Function to create the bar chart
function createChart(dataset) {
	const w = 800; // Width of the SVG
	const h = 400; // Height of the SVG
	const padding = 40; // Padding around the chart

	// Append a title to the chart (#1)
	d3.select("body")
		.append("h1")
		.attr("id", "title") // Title id
		.text("United States GDP Bar Chart");

	// Create an SVG container
	const svg = d3.select("body").append("svg").attr("width", w).attr("height", h);

	// Create scales for the chart
	const xScale = d3
		.scaleTime()
		.domain([new Date(d3.min(dataset, (d) => d[0])), new Date(d3.max(dataset, (d) => d[0]))]) // Dates from the dataset
		.range([padding, w - padding]);

	const yScale = d3
		.scaleLinear()
		.domain([0, d3.max(dataset, (d) => d[1])]) // GDP values
		.range([h - padding, padding]);

	// Create axes
	const xAxis = d3.axisBottom(xScale); // x-axis generator
	const yAxis = d3.axisLeft(yScale); // y-axis generator

	// Append x-axis (#2)
	svg.append("g")
		.attr("id", "x-axis") // x-axis id
		.attr("transform", `translate(0, ${h - padding})`)
		.call(xAxis);

	// Append y-axis (#3)
	svg.append("g")
		.attr("id", "y-axis") // y-axis id
		.attr("transform", `translate(${padding}, 0)`)
		.call(yAxis);

	// Ensure both axes have multiple ticks with class="tick" (#4)
	d3.selectAll(".tick").classed("tick", true);

	// Add rectangles for the bars (#5 - #11)
	svg.selectAll("rect")
		.data(dataset)
		.enter()
		.append("rect")
		.attr("class", "bar") // Bar class
		.attr("x", (d) => xScale(new Date(d[0]))) // Map date to x-axis (#10)
		.attr("y", (d) => yScale(d[1])) // Map GDP to y-axis (#11)
		.attr("width", (w - 2 * padding) / dataset.length) // Dynamically calculate bar width
		.attr("height", (d) => h - padding - yScale(d[1])) // Height based on GDP value (#9)
		.attr("fill", "navy") // Bar color
		.attr("data-date", (d) => d[0]) // Data-date attribute (#6, #7)
		.attr("data-gdp", (d) => d[1]) // Data-gdp attribute (#6, #8)
		.on("mouseover", function (event, d) {
			// Tooltip on mouseover (#12, #13)
			tooltip
				.style("opacity", 1)
				.style("left", `${event.pageX + 10}px`)
				.style("top", `${event.pageY - 20}px`)
				.attr("data-date", d[0]) // Set data-date attribute (#13)
				.html(`Date: ${d[0]}<br>GDP: $${d[1]} Billion`);
		})
		.on("mouseout", function () {
			tooltip.style("opacity", 0); // Hide tooltip
		});

	// Append a tooltip to the body (#12, #13)
	const tooltip = d3
		.select("body")
		.append("div")
		.attr("id", "tooltip") // Tooltip id
		.style("position", "absolute")
		.style("background-color", "lightgray")
		.style("padding", "5px")
		.style("border-radius", "5px")
		.style("opacity", 0); // Initially hidden
}
