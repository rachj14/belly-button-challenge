let url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

// Function to build charts
function charts(sample) {
    // Retrieve data
    d3.json(url).then(data => {
        // Store samples data into a variable
        let sample_data = data.samples;
        // Filter samples data based on the 'sample' value
        let results = sample_data.filter(result => result.id === sample);
        // Store first sample data in a variable
        let result_data = results[0];
        // Create variables for the required values in sample
        let otu_ids = result_data.otu_ids;
        let otu_label = result_data.otu_labels;
        let sample_values = result_data.sample_values;

        // Create chart variables for the Top 10 values
        let y_value = otu_ids.slice(0, 10).map(id => `OTU ${id}`);
        let x_value = sample_values.slice(0, 10);
        let labels = otu_label.slice(0, 10);

        // Build bar chart
        let barchart = {
            x: x_value.reverse(),
            y: y_value.reverse(),
            text: labels.reverse(),
            type: "bar",
            orientation: "h"
        };

        let barlayout = {
            title: "Top 10 Bacteria Found"
        };
        
        // Plot bar chart
        Plotly.newPlot("bar", [barchart], barlayout)

        // Build bubble chart
        let bubblechart = {
            x: otu_ids,
            y: sample_values,
            text: otu_label,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        let bubblelayout = {
            title: "Bacteria Per Sample",
            xaxis: {title:"OTU ID"}
        };

        // Plot bubble chart
        Plotly.newPlot("bubble", [bubblechart], bubblelayout)
    });
};

// Create function for Demographic Info box
function demoInfo(sample) {
    d3.json(url).then(data => {
        // Store metadata data in a variable
        let metaData = data.metadata;
        // Filter metadata results based on 'sample' value
        let results = metaData.filter(result => result.id == sample);
        // Create variable for the first data
        let result_data = results[0];

        // Clear any existing metadata values
        d3.select("#sample-metadata").html("");

        // Get key-value pairs and display in demohraphic info box
        Object.entries(result_data).forEach(([key, value]) => {
            d3.select("#sample-metadata")
            .append("h6").text(`${key}: ${value}`);
        });
    });
};

// Function to initialise the dashboard to start
function init() {

    // Dropdown selector
    let selector = d3.select("#selDataset");

    // Retrieve sample data to populate dropdown selector
    d3.json(url).then((data) => {
        let sample_name = data.names;
        sample_name.forEach((sample) => {
            selector.append("option")
            .text(sample)
            .property("value", sample);
        });
        
        // Input first sample data into charts and demo info box when dashboard initialised
        let first_sample = sample_name[0];
        charts(first_sample);
        demoInfo(first_sample);
    });
};

// Function to update the data when different option selected in dropdown selector
function optionChanged(newSample) {
    charts(newSample);
    demoInfo(newSample);
};

// Initialise the dashboard
init();
