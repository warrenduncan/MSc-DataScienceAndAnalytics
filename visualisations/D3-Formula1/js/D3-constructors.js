var dateRangeSlider = document.getElementById('dslider');
var diameter = 500;

// Create the SVG
let svg = d3.select("svg")
            .attr('display', 'block')

// Create a group that will apply the neccessary transforations
g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

// Pull Constructor data from the csv
d3.csv('data/constHistory.csv').then((data) => {
    
    // Pull the Start and End Date for the comparison
    year_start = dslider.noUiSlider.get()[0];
    year_end = dslider.noUiSlider.get()[1];

    // Pull the type of comparison to conduct
    type = d3.select('#optionBar a.active').attr('name');

    // Get the colours of each constructor
    let colours = d3.rollup(data, v => v[0].colour, d => d.constName)

    // Create Update Function
    function updateViz() {

        // Filter the Data to be less than or equal to the selected year
        let data_filtered = data.filter((d) => +d.year <= year_end).filter((d) => +d.year >= year_start)

        // Get the number of races completed by each driver
        let driver_races =d3.rollup(data_filtered, (v) => d3.sum(v, (d) => +d.races), (d) => d.constName, (d) => d.driverName);

        // Get the nationalities of the drivers and constructors
        let d_nationality =d3.group(data_filtered, (d) => d.driverName);
        let c_nationality =d3.group(data_filtered, (d) => d.constName);

        // Get the number of races completed by each constructor
        let const_races =d3.rollup(data_filtered, (v) => d3.sum(v, (d) => +d.races), (d) => d.constName);

        // Group the database to pull the specified 'type' of comparison
        let data_grouped =d3.rollups(data_filtered, (v) => d3.sum(v, (d) => +d[type]), (d) => d.constName, (d) => d.driverName);

        var data_proc;

    
        // Format Data to be usable in zoomable packing
        data_proc = data_grouped.map((d) => {
            return Object({
                name: d[0],
                children: d[1].map((dd) => {
                    return Object({
                        name: dd[0],
                        value: dd[1],
                        races: driver_races.get(d[0]).get(dd[0]),
                        nationality: d_nationality.get(dd[0])[0].driverNationality,
                        fill: d3.color(colours.get(d[0])).darker(1.2)
                    });
                }),
                fill: colours.get(d[0]),
                races: const_races.get(d[0]),
                nationality: c_nationality.get(d[0])[0].constNationality
            });
        });
        
        

        let dNew = Object({year: year_start +"-"+year_end, children: data_proc, fill: '#feb9b9'})

        // Pack data to fit the SVG and create; radius, cx, cy, and child-parent dependencies
        var pack = d3.pack()
            .size([diameter, diameter])
            .padding(2);

        let root = d3.hierarchy(dNew)
            .sum(function(d) { 
                return d.value; 
            })
            .sort(function(a, b) { 
                return b.value - a.value; 
            });

        // create a general focus, and get the information for each of the nodes/circles
        var focus = root,
            nodes = pack(root).descendants(),
            view;

        // Calculate the maximum node size of 'depth 2' which will be used to calculate the text size
        let maxR = d3.max(nodes, (d) => {
                if(d.depth == 2) {
                    return d.r
                }
            });

        // Create the circle elemnts
        var circle = g.selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("class", function(d) { //Add the relevant classes which will be used to edit the css
                return d.parent ? d.children ? "circle node constNode" : "circle node node--leaf " : "circle node node--root"; 
            })
            .attr("fill", d => d.children ? d.data.fill : d.data.fill)
            // .style("fill", (d) => ) //fill according to the constrctor colour
            .on("click", function(event, d) {
                if (focus !== d && d.depth === 1) { // Trigger the zoom fuction if in depth 1
                    zoom(event, d), event.stopPropagation(); 
                } 
            }) 
            .on("mouseover", function (event, d) {  // Populate the information card when hovering over the circle
                // Prepre Variables information card
                let cat = d3.select("#optionBar > .item.active").text()
                let ratio = d3.format(".2f")(d.value/d.data.races)
                var entity,
                    currentInfo;
                if (d.depth === 2) {
                    entity = 'Driver';
                    currentInfo = 'Constructor: '+d.parent.data.name;
                } else {
                    entity = 'Constructor';
                    currentInfo = "Drivers: "+d.children.length
                }

                comparativeRace = "<br>" +cat+": " + d.value + "<br><i>Ratio (per race): "+ ratio +"</i></p>"

                //Remove default message
                d3.select("#defaultInfoCard")
                    .remove()

                // Add new information
                d3.select("#infoCard")
                    .append('div')
                    .attr('class', 'customInfoCard')
                    .html("<h1>" + d.data.name + 
                        "</h1>" + entity + "<hr><p>Nationality: "+ d.data.nationality+"<br>"+
                            currentInfo + "<br>Races: "+d.data.races + comparativeRace)
                    
            })
            .on("mouseout", function(){ // Remove information and replace default info
                d3.select(".customInfoCard")
                    .remove()
                
                d3.select("#infoCard")
                    .append('h1')
                    .attr('id', 'defaultInfoCard')
                    .html('<i>Hover over entity to see information</i>')
            });
        
        // Create Text elemenents
        var text = g.selectAll("text")
            .data(nodes)
            .enter()
            .append("text")
            .attr("class", "F1label")
            .style("display", function(d) { // disable text at different depths
                return d.depth === 2 ? 'none' : 'inline'; 
            })
            .style("fill", function(d) { // change text color at different depths
                return d.depth === 2 ? 'black' : 'white'; 
            })
            .style('font-size', function(d) {  //Make font size relevant to size of proportionate share
                return d.r/maxR + 'em'; 
            })
            .attr("text-anchor", "middle")
            .text(function(d) { // Making driver names shorter to fit into circles
                if (d.depth==2  && d.data.name.split(' ').length >1) {
                    split_name = d.data.name.split(' ')
                    new_name = split_name[0][0]+"."+split_name[1]
                    return new_name;
                } else {
                    return d.data.name;
                }
            })
            .on("click", function(event, d) { // Trigger zoom when clicking if at depth 1
                if (focus !== d && d.depth === 1) {
                    zoom(event, d), event.stopPropagation();
                } 
            })
            .on("mouseover", function (event, d) { // Populate information card when hovering over text
                // Prepare variable for information card
                let cat = d3.select("#optionBar > .item.active").text()
                let ratio = d3.format(".2f")(d.value/d.data.races)
                var entity,
                    currentInfo;
                if (d.depth === 2) {
                    entity = 'Driver';
                    currentInfo = 'Constructor: '+d.parent.data.name;
                } else {
                    entity = 'Constructor';
                    currentInfo = "Drivers: "+d.children.length
                }

                comparativeRace = "<br>" +cat+": " + d.value + "<br><i>Ratio (per race): "+ ratio +"</i></p>"
                

                //Remove default message
                d3.select("#defaultInfoCard")
                    .remove()

                // Add new information
                d3.select("#infoCard")
                    .append('div')
                    .attr('class', 'customInfoCard')
                    .html("<h1>" + d.data.name + 
                        "</h1>" + entity + "<hr><p>Nationality: "+ d.data.nationality+"<br>"+
                            currentInfo + "<br>Races: "+d.data.races + comparativeRace)
            })
            .on("mouseout", function(){ // Remove text and replace with default message
                d3.select(".customInfoCard")
                    .remove()
                
                d3.select("#infoCard")
                    .append('h1')
                    .attr('id', 'defaultInfoCard')
                    .html('<i>Hover over entity to see information</i>')
            });

        // Create a variable to select all circles and text which will be used in zoom
        var node = g.selectAll("circle,text");

        // Make background none when zooming in
        svg.style("background", 'none')
            .on("click", function(event) { 
                zoom(event, root); 
            });

        // Populates the svg with circles relevant to the either zoomed or unzoomed view
        zoomTo([root.x, root.y, root.r * 2]);


        // Create zoom function
        function zoom(event, d) {
            var focus0 = focus; 
            
            // Make focus the new zoomed in focus of the children
            focus = d;

            // (CSS) Allow the mouse pointer at depth 2 and remove when going back to depth 1
            if (d.parent) {
                d3.selectAll('.node--leaf').style('pointer-events', 'all');
            } else {
                d3.selectAll('.node--leaf').style('pointer-events', 'none');
            }

            // Create transition effect when zooming in and out
            var transition = d3.transition()
                .duration((d, event) =>event.altKey ? 7500 : 750)
                .tween("zoom", function(d) {
                    var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
                    return function(t) { zoomTo(i(t)); };
                });

            // Add transition effect to the text and what happens to the text at depth 1 and depth 2
            transition.selectAll("text")
                .on("start", function(d) { 
                    if (d.parent === focus) {
                        this.style.display = "inline";
                    }
                })
                .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
                .on("end", function(d) { 
                    if (d.parent !== focus) this.style.display = "none"; 
                });
            
            // Add transition effect to the text and what happens to the text at depth 1 and depth 2
            transition.selectAll("circle")
                .style("fill", function(d) { return d.parent === focus & d.depth == 2 ? 'white': d.data.fill; })
                .on("end", function(d) { 
                    if (d.parent !== focus) {
                        this.style.fill = d.data.fill
                    }; 
                });
        }

        // Create zoom to function which will increase the size of the nodes zooming in to
        // and place them in the correct positions
        function zoomTo(v) {

            // create variables for zoom maginification
            var k = diameter / v[2]; 
            view = v;
        
            // transform the location and size of the nodes
            node.attr("transform", function(d) { 
                return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; 
            });
            circle.attr("r", function(d) { 
                return d.r * k; // applying increased size to the circles
            })

            text.style('font-size', function(d) { // Applying increased size to the writing in each circle
                var multiplier;

                // Chnage text size, which is slight but provides clarity given the nature of the data
                if (type == 'pointPos') {
                    multiplier = 0.35
                } else if (type == 'wins') {
                    multiplier = 0.9
                } else {
                    multiplier = 0.5
                }

                return (d.r * (multiplier*k))/maxR + 'rem'; 
            })
        }
            
    }  

    // Create an event listener for the double sided slider
    dateRangeSlider.noUiSlider.on('change', function(){
        // Reset years
        year_start = dslider.noUiSlider.get()[0];
        year_end = dslider.noUiSlider.get()[1];

        // Remove the current visualisation
        temp = d3.selectAll("circle,text");
        temp.remove();

        // Create new visualisation with new criteria
        updateViz();
    });

    // Create a listener event for when the evaluation criteria is changed
    d3.selectAll('#optionBar a').on('click', () =>{
        // Update the type of comparison
        type = d3.select('#optionBar a.active').attr('name');

        // Remove the old data
        temp = d3.selectAll("circle,text");
        temp.remove();

        // Create new visualisation
        updateViz();
    })

    // Create visualisation to run when the page is opened
    updateViz()

});