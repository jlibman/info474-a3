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

        months.forEach(function(m) {
            var monthOption = document.createElement('option');
            monthOption.value = m;
            monthOption.text = m;
            monthDropdown.appendChild(monthOption);
        });      
    }

    var width = 1000;
    var height = 450;
    var margin = {top: 20, right: 15, bottom: 30, left: 40};
    var w = width - margin.left - margin.right;
    var h = height - margin.top - margin.bottom;

    var patt = new RegExp("all");
    var dataset, CURRENT, FINAL_NO_MOD;; //the full dataset
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var monthSelected = false;

    //read in the data
    d3.csv("data.csv", function(error, ks) {
        if (error) return console.warn(error);

        ks.forEach(function(d) {
            d.prec = +d.PRCP;
            d.yr = +d.year;
            d.month = +d.month;
            d.day = +d.day;
            d.postionX = d.yr + d.month/12 + d.day/365;
        });
        //dataset is the full dataset -- maintain a copy of this at all times
        dataset = ks;
        CURRENT = ks;
        FINAL_NO_MOD = ks;

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
        // .ticks(20)
        .scale(x)
        .tickFormat(d3.format("d"));

    var yAxis = d3.axisLeft()
        .scale(y);

    chart.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis)
        .append("text")
            .attr("x", w)
            .attr("y", -6)
            .style("text-anchor", "middle")
            .text("Date");
   
    chart.append("g")
        .attr("class", "axis")
        .call(yAxis)
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "middle")
            .text("Precipitation");

    function drawVis(mdataset) { //draw the circles initially and on each interaction with a control
        var circle = chart.selectAll("circle")
        .data(mdataset);
        circle
            .attr("cx", function(d) { return x(d.postionX);  })
            .attr("cy", function(d) { return y(d.prec);  });
            // .style("fill", function(d) { return col(d.type); });
        circle.exit().remove();

        circle.enter().append("circle")
            .attr("cx", function(d) { return x(d.postionX);  })
            .attr("cy", function(d) { return y(d.prec);  })
            .attr("r", 1)
            .style("stroke", "black")
        //.style("fill", function(d) { return colLightness(d.vol); })
            // .style("fill", function(d) { return col(d.type); })
            // .style("opacity", 0.5);
    }

    function colorMonths(mdataset) { //draw the circles initially and on each interaction with a control
        var circle = chart.selectAll("circle")
        .data(mdataset);
        circle
            .attr("cx", function(d) { return x(d.postionX);  })
            .attr("cy", function(d) { return y(d.prec);  });
            // .style("fill", 'red' );
        circle.exit().remove();

        circle.enter().append("circle")
            .attr("cx", function(d) { return x(d.postionX);  })
            .attr("cy", function(d) { return y(d.prec);  })
            .attr("r", 1)
            .style("stroke", "black")
        //.style("fill", function(d) { return colLightness(d.vol); })
            // .style("fill", function(d) { return col(d.type); })
            // .style("opacity", 0.5);
    }

    function filterTypeYear(myear) {
        var reset = patt.test(myear);
        if(reset){
            // All years, but only showing selected month
            // if(monthSelected) {
            //     var monthPos = 1;
            //     for(var i = 0; i < months.length; i++) {
            //         if (months[i]==mmonth){
            //             monthPos += i;
            //         }
            //     }
            //     var ndata = FINAL_NO_MOD.filter(function(d) {
            //         return d.month == monthPos;
            //     });
            //     drawVis(ndata)
            //     CURRENT = ndata;
            // } else { // All years, all months
                drawVis(FINAL_NO_MOD);
                CURRENT = FINAL_NO_MOD;
            // }
        }else {
            if(Array.isArray(myear)) {//range slider
                // if(monthSelected) {
                    
                // }
                var ndata = CURRENT.filter(function(d) {
                    return ((d.year >= myear[0]) && (d.year <= myear[1]));
                });
                CURRENT = ndata;
                drawVis(ndata);
                x.domain([myear[0],myear[1]])  
                chart.select(".axis")
                        .transition() 
                        .call(xAxis); 
            } else {//dropdown selection
                var ndata = FINAL_NO_MOD.filter(function(d) {
                    return d.year == myear;
                });
                CURRENT = ndata;
                drawVis(ndata);
                // console.log(myear + " "+ (parseInt(myear)+1).toString())
                x.domain([myear, (parseInt(myear)+1).toString()])  
                chart.select(".axis")
                        .transition() 
                        .call(xAxis);
            }
        }
    }

    function filterTypeMonth(mmonth) {
        var reset = patt.test(mmonth);
        if(reset){
            drawVis(FINAL_NO_MOD);
            CURRENT = FINAL_NO_MOD;
            monthSelected = false;
        }else {
            monthSelected = true;
            //handle 0 based indexing of month array
            var monthPos = 1;
            for(var i = 0; i < months.length; i++) {
                if (months[i]==mmonth){
                    monthPos += i;
                }
            }
            var ndata = CURRENT.filter(function(d) {
                return d.month == monthPos;
            });
            $( "#title" ).val($( "#yearSlider" ).slider( "values", 0 ) + " - " + $( "#yearSlider" ).slider( "values", 1 ) + ", " + mmonth);

            colorMonths(ndata);
        }
    }
        
    $( "#yearSlider" ).slider({
        range: true,
        min: 1948,
        max: 2018,
        values: [ 1948, 2018 ],
        slide: function( event, ui ) {
            $( "#yearInput" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
            $( "#title" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );            
            filterTypeYear(ui.values); } 
        });

        $( "#yearInput" ).val( $( "#yearSlider" ).slider( "values", 0 ) + " - " + $( "#yearSlider" ).slider( "values", 1 ) );
        $( "#title" ).val($( "#yearSlider" ).slider( "values", 0 ) + " - " + $( "#yearSlider" ).slider( "values", 1 ));
});


// TODO months over whole range
// TODO select months after year -->if current !=dataset it means there is a range of years
// TODO change xaxis labels to months when small enough
// TODO Single year axis transition
// TODO x and  y axis labels 
// TODO tooltips