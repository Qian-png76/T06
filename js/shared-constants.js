// Set up dimensions and margins
const margin = { top: 40, right: 30, bottom: 50, left: 70 };
const width = 800; // Total width of the chart
const height = 400; // Total height of the chart
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

/* Make the colours accessible globally */
const barColor = "#606464";
const bodyBackgroundColor = "#fffaf0";

// Set up the scales
const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

// T06-1 Step 6.2 Create a bin generator using d3.bin
const binGenerator = d3.bin()
    .value(d => d.energyConsumption);

// T06-1 Step 7.2 Make the filter options accessible globally
const filters_screen = [
    { id: "all", label: "All", isActive: true },
    { id: "LED", label: "LED", isActive: false },
    { id: "LCD", label: "LCD", isActive: false },
    { id: "OLED", label: "OLED", isActive: false }
];

// Optional on step 7- Add the screen size filter options
const filters_size = [
    { id: "all", label: "All Sizes", isActive: true },
    { id: "24", label: "24\"", isActive: false },
    { id: "32", label: "32\"", isActive: false },
    { id: "55", label: "55\"", isActive: false },
    { id: "65", label: "65\"", isActive: false },
    { id: "98", label: "98\"", isActive: false }
];

// T06-2 Step 1.4 Set up shared constant for colors
const colorScale = d3.scaleOrdinal()
    .domain(["LED", "LCD", "OLED"])
    .range(["#219ebc", "#8ecae6", "#023047"]); 

// T06-2 Step 3.3 Add tooltipWidth and tooltipHeight
const tooltipWidth = 120;
const tooltipHeight = 30;

// Global variable for the scatterplot inner chart (used in interactions.js)
let innerChartS;