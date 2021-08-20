
// Changing the options for the type of comparison
// Ensures that two options cannot be selected similtaneously
$('#optionBar a').click(function(){
    if ($(this).hasClass('active')){
    } else {
        $('#optionBar a').removeClass('active');
        $(this).toggleClass('active');
    }
});

// Controlling the functionality for the race number slider
// Check if id 'slider exists' and therefore using the driver visualisation
if (document.getElementById("slider")) {

    // Get slider trace value and assign it to the text box so it is visible
    var slider = document.getElementById("slider");
    var races_val = document.getElementById("racesValue");

    races_val.innerHTML = slider.value;

    // Update textbox with race number value when slider input occurs
    slider.oninput = function() {
        races_val.innerHTML = this.value;
    }
} else {

    // Pull doulbe range slider for Constructor visualisation
    var dslider = document.getElementById('dslider');

    // Create the double range slider
    noUiSlider.create(dslider, {
    start: [1950, 2021],
    connect: true,
    tooltips: true,
    format: { // remove decimals in the tooltip
        from: function(value){return(parseInt(value))},
        to: function(value){return(parseInt(value))},
    },
    range: { // set range of the slider
        'min': 1950,
        'max': 2021
    }
});
}

