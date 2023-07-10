var valuesSlider = document.getElementById('slider-round');
var valuesForSlider = [0,1,2,3,4,5,6,7,8,9,10]; // 11 values

var format = {
    to: function(value) {
        return valuesForSlider[Math.round(value)] + " hrs.";
    },
    from: function (value) {
        return valuesForSlider.indexOf(Number(value));
    }
};


noUiSlider.create(valuesSlider, {
    start: [0],
    // A linear range from 0 to 10 (11 values)
    range: { min: 0, max: valuesForSlider.length - 1 },
    // steps of 1
    step: 1,
    connect: "lower",

    tooltips: true,
    format: format,

});

// The display values can be used to control the slider
valuesSlider.noUiSlider.set(['0']);
