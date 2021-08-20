// Create over space for visualisation
const width = 975;
const height = 400;
var data;
let trans = 300;
var races;
var type;
        
// Create margin for visualisation
const margin = {
    top: 20,
    left: 70,
    right: 70,
    bottom: 40
}

// create the element where main visualisation will be placed
let svg = d3.select("#vis")
    .append('svg')
    .attr('width', width)
    .attr('height', height);

// Create the axes
svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${margin.bottom})`);

svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${margin.left},0)`);

// Create visualisation x scale
let xScale = d3.scaleLinear()
    .range([margin.left, width - margin.right])

let xaxis = d3.axisTop(xScale);

// Create visualisation y scale
let yScale = d3.scaleBand()
    .range([margin.bottom, height])
    .paddingInner(0.1)
    .paddingOuter(0.2);

let yaxis = d3.axisLeft(yScale)
    .tickFormat(d => '');

// Pull data from the csv
d3.csv('data/driverHistory.csv').then((data) => {

    // Get the type of comparison
    races = d3.select('#slider').node().value;
    type = d3.select('#optionBar a.active').attr('name');
    


    // Create Function to Update Visualisation
    function updateViz() {

        // Pull data and filter appropriattely
        let dNew = data.filter(d => +d.raceCount == races)
            .sort((d, i) => { 
                return d3.descending(+d[type], +i[type])
            })
            .slice(0,10);

        // Set xScale
        xScale.domain([0, d3.max(dNew, (d) => {
            return +d[type] * 1.2
        })]);

        // Set the yScale relevant to data length
        yScale.domain(d3.range(dNew.length))

        // add bars to the visualisation for each driver
        svg.selectAll('rect')
            .data(dNew, (d) => d.driverName)
            .join(
                (enter) => { // create new bar elements
                    enter.append('rect')
                        .attr('fill', (d,i) => {
                            return d.colour // make colour the colour associatted with the constructor
                        })
                        .attr('width', 0)
                        .attr('height', yScale.bandwidth)
                        .attr('y', (d, i) => yScale(i))
                        .attr('x', margin.left)
                        .attr('opacity', 0)
                        .transition()
                        .duration(trans)
                        .ease(d3.easeLinear)
                        .attr('opacity', 1)
                        .attr('width', (d) => xScale(+d[type]) - margin.left)
                },
                (update) => {
                    update // update existing bar elements
                        .transition()
                        .duration(trans)
                        .ease(d3.easeLinear)
                        .attr('fill', (d,i) => {
                            return d.colour
                        })
                        .attr('width', (d) => xScale(+d[type]) - margin.left)
                        .attr('height', yScale.bandwidth)
                        .attr('y', (d, i) => yScale(i))
                        .attr('x', margin.left);
                },
                (exit) => {
                    exit // remove old bar elements
                        .transition()
                        .duration(trans)
                        .ease(d3.easeLinear)
                        .attr('opacity', 0)
                        .attr('x', margin.left)
                        .attr('width', 0)
                        .remove();
                });
        
        // Add Driver Name labels to the end of each bar
        svg.selectAll('.label1')
            .data(dNew, d => d.driverName)
            .join(
                (enter) =>{ // create Driver name text elements
                    enter.append('text')
                        .attr('class', 'label1')
                        .attr('fill', 'black')
                        .attr('y', (d, i) => yScale(i) + margin.top-4)
                        .attr('opacity', 0)
                        .transition()
                        .duration(trans)
                        .ease(d3.easeLinear)
                        .attr('opacity', 1)
                        .attr('font-size', '1.1rem')
                        .attr('font-weight', 'bold')
                        .attr('x', (d) => xScale(+d[type])+10)
                        .text((d) => d.driverName)
                },
                (update) => {
                    update // update Driver name text elements
                        .transition()
                        .duration(trans)
                        .ease(d3.easeLinear)
                        .attr('y', (d, i) => yScale(i) + margin.top-4)
                        .attr('x', (d) => xScale(+d[type])+10)
                        .text((d) => d.driverName)
                
                },
                (exit) => {
                    exit // remove Driver name text elements
                        .transition()
                        .duration(trans)
                        .attr('opacity', 0)
                        .attr('x', margin.left)
                        .remove();
                });
        
        // Add metric value labels to the end of each bar
        svg.selectAll('.label2')
            .data(dNew, d => d.driverName)
            .join(
                (enter) =>{// create criteria value text elements
                    enter.append('text')
                        .attr('class', 'label2')
                        .attr('fill', 'grey')
                        .attr('y', (d, i) => yScale(i) + margin.top+8)
                        .attr('opacity', 0)
                        .transition()
                        .duration(trans)
                        .ease(d3.easeLinear)
                        .attr('opacity', 1)
                        .attr('font-size', '0.8rem')
                        .attr('x', (d) => xScale(+d[type])+10)
                        .text((d) => d[type])
                },
                (update) => {
                    update // update criteria value text elements
                        .transition()
                        .duration(trans)
                        .ease(d3.easeLinear)
                        .attr('y', (d, i) => yScale(i) + margin.top+8)
                        .attr('x', (d) => xScale(+d[type])+10)
                        .text((d) => d[type])
                
                },
                (exit) => {
                    exit // remove criteria value text elements
                        .transition()
                        .duration(trans)
                        .attr('opacity', 0)
                        .attr('x', margin.left)
                        .remove();
                });

        // Add Constructor name labels to each bar for clarification
        svg.selectAll('.label3')
            .data(dNew, d => d.driverName)
            .join(
                (enter) =>{ // create Constructor name text elements
                    enter.append('text')
                        .attr('class', 'label3')
                        .attr('fill', d => tinycolor(d.colour).isLight() ? 'black' : 'white')
                        .attr("text-anchor", "end")
                        .attr('y', (d, i) => yScale(i) + margin.top)
                        .attr('opacity', 0)
                        .transition()
                        .duration(trans)
                        .ease(d3.easeLinear)
                        .attr('opacity', 1)
                        .attr('font-size', '1.2rem')
                        .attr('x', (d) => (xScale(+d[type]) - 10) < margin.left ? 0: (xScale(+d[type]) - 10))
                        .text((d) => d.constName)
                },
                (update) => {
                    update // update constructor name elements
                        .transition()
                        .duration(trans)
                        .ease(d3.easeLinear)
                        .attr('fill', d => tinycolor(d.colour).isLight() ? 'black' : 'white')
                        .attr("text-anchor", "end")
                        .attr('y', (d, i) => yScale(i) + margin.top)
                        .attr('x', (d) => (xScale(+d[type]) - 10) < margin.left ? 0: (xScale(+d[type]) - 10))
                        .text((d) => d.constName)
                
                },
                (exit) => {
                    exit // remove constructor name labels
                        .transition()
                        .duration(trans)
                        .attr('opacity', 0)
                        .attr('x', margin.left)
                        .remove();
                });
        
        // Add X-Axis
        svg.select('.x.axis')
            .transition()
            .duration(trans)
            .call(xaxis);
        
        // Add Y-Axis
        svg.select('.y.axis')
            .transition()
            .duration(trans)
            .call(yaxis)

    };

    // Add event listener for when the slider is changed
    d3.select('#slider').on('change', () =>{
        races = d3.select('#slider').node().value;
        d3.select('#slider').property('value', races);
        updateViz();
    });

    // Ad event listener for when the type of comparison is changed
    d3.selectAll('#optionBar a').on('click', () =>{
        type = d3.select('#optionBar a.active').attr('name');
        d3.select('#slider').property('value', 50);
        d3.select('#racesValue').text('50');
        races = '50';
        updateViz();
    });

    // Create event listener for when the start race button is pushed
    d3.select('#startRaceButton').on('click', () =>{

        // Create interval to start visualisation
        let raceTimer = d3.interval(() =>{
                // Rempve start button and display message
                d3.select('#startRaceButton').style('display', 'none');
                d3.select('#endRaceMessage').classed('hidden', false);

                // Create the visualisation
                updateViz();

                // Update slider bar position
                d3.select('#slider').property('value', races);

                // Increase races variable by 1
                races = d3.format('')(+races + 1);

                // Check if races exceeds the 250 mark
                if (+races > 250) {
                    // stop timer and stop the 'race'
                    raceTimer.stop();
                    // show the start button again and remove the message
                    d3.select('#startRaceButton').style('display', 'inline-block');
                    d3.select('#endRaceMessage').classed('hidden', true);
                } else {races
                    d3.select('#racesValue').text(races);
                }

                // Create even listened to stop interval if anywhere on the page is clicked
                d3.select('body').on('click', () => {
                    raceTimer.stop();
                    d3.select('#startRaceButton').style('display', 'inline-block');
                    d3.select('#endRaceMessage').classed('hidden', true);
                })
                // make intervl time the same as transition time +100 to allow elements to update properly before being implemented again.
                // If missed the elements begin to fade and lose colour or dissappear
            }, trans+150);
    });

    // Show the visualisation on startup
    updateViz();
});