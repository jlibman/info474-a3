$(function() {
    'use strict';

    window.onload = function() {
        populateDropdowns();
        document.getElementById("selectYear").onchange =
            function(){
                filterTypeYear(this.value);
            }
        document.getElementById("selectMonth").onchange =
            function(){
                filterTypeMonth(this.value);
            }
        // initialVis();
    };

    function populateDropdowns() {
        var yearDropdown = document.getElementById('selectYear');
        var monthDropdown = document.getElementById('selectMonth');

        for(var i = 1948; i < 2014; i++) {
            var yearOption = document.createElement('option');
            yearOption.value = i.toString();
            yearOption.text = i.toString();
            yearDropdown.appendChild(yearOption);
        }

        //TODO: make global to reference position in array to match dataset?
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        months.forEach(function(m) {
            var monthOption = document.createElement('option');
            monthOption.value = m;
            monthOption.text = m;
            monthDropdown.appendChild(monthOption);
        });      
    }

    var width = 750;
    var height = 450;
    var margin = {top: 20, right: 15, bottom: 30, left: 40};
    var w = width - margin.left - margin.right;
    var h = height - margin.top - margin.bottom;

    var patt = new RegExp("all");
    var dataset; //the full dataset

    //read in the data
    d3.csv("data.csv", function(error, ks) {
        if (error) return console.warn(error);

        ks.forEach(function(d) {
            d.prec = +d.PRCP;
            d.yr = +d.year;
            d.month = +d.month;
            d.day = +d.day;
        });
        //dataset is the full dataset -- maintain a copy of this at all times
        dataset = ks;

        //all the data is now loaded, so draw the initial vis
        drawVis(dataset);
    });

    //none of these depend on the data being loaded so fine to define here

    var col = d3.scaleOrdinal(d3.schemeCategory10);

    var svg = d3.select("body").append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var chart = d3.select(".chart")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom+15)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);



    // define the x scale (horizontal)
    // var mindate = new Date(1948,1,1),
    // maxdate = new Date(2017,12,14);
    

    // var timeFormat = d3.time.format('%Y-%m-%d');
    // var d3ParseScale = d3.time.scale()
    //     .domain([timeFormat.parse('2014-03-08T12:00:00')


    // var x = d3.time.scale()
    //     .domain([mindate, maxdate]) 
    //     .range([0,w]);  

    var x = d3.scaleLinear()
            .domain([1948, 2018])
            .range([0, w]);

    var y = d3.scaleLinear()
            .domain([0, 5.5])
            .range([h, 0]);

    var xAxis = d3.axisBottom()
        .ticks(20)
        .scale(x);

    chart.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis)
        .append("text")
        .attr("x", w)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Date");

    var yAxis = d3.axisLeft()
        .scale(y);

    chart.append("g")
        .attr("class", "axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Precipitation");

    function drawVis(dataset) { //draw the circles initially and on each interaction with a control
        var circle = chart.selectAll("circle")
        .data(dataset);

        circle
            .attr("cx", function(d) { return x(d.year);  })
            .attr("cy", function(d) { return y(d.prec);  });
            // .style("fill", function(d) { return col(d.type); });
        circle.exit().remove();

        circle.enter().append("circle")
            .attr("cx", function(d) { return x(d.year);  })
            .attr("cy", function(d) { return y(d.prec);  })
            .attr("r", 4)
            .style("stroke", "black")
        //.style("fill", function(d) { return colLightness(d.vol); })
            .style("fill", function(d) { return col(d.type); })
            .style("opacity", 0.5);
    }

    function filterType(mtype) {x
        //add code to filter to mytype and rerender vis here
        var res = patt.test(mtype);
        if(res){
            drawVis(dataset);
        }else{
            var ndata = dataset.filter(function(d) {
                return d["type"] == mtype;
            });
            drawVis(ndata);
        }
    }

    // function filterVolume(values){
    //     var ndata = dataset.filter(function(d) {
    //         return d["volume"] >= values[0] && d["volume"] < values[1];
    //     });
    //     drawVis(ndata);
    // }
    
    // $( "#volume" ).slider({
    //     range: true,
    //     min: 0,
    //     max: 1200,
    //     values: [ 0, 1200 ],
    //     slide: function( event, ui ) {
    //         $( "#volumeamount" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
    //         filterVolume(ui.values); } 
    //     });
    //     $( "#volumeamount" ).val( $( "#volume" ).slider( "values", 0 ) + " - " + $( "#volume" ).slider( "values", 1 ) ); 
});