/*

JS (JavaScript code) 
version 1.1.0

By Suthep Sangvirotjanaphat
https://github.com/surrealist/hehew-net-plus
December 2018

**/


// 0. Set these values as you want.
//    Hehew.net's original values is 600 and 900
var min = 1000;
var max = 1200;


// 1. Replace min and max range from default
//
$("input#begin_range").val(min);
$("input#end_range").val(max);

// 1.5 Auto load SLOT #1
loadCurrentSlot(); updateSlotDisplay();

// 2. Make the chart appeared at the first glance. 
//    (No blank white area on the right side)
drawChart();


// 3. Assigns ID for tables
//    This helps further CSS and JS code shorter
$("body > table:nth-child(2) > table:nth-child(1)").addClass("tableSlot1 play");
$("body > table:nth-child(2) table:nth-child(2)").attr("id", "tableCall").addClass("play");
$("body > table:nth-child(2) table:nth-child(4)").attr("id", "tablePut").addClass("play");
$("body > table:nth-child(2) table:nth-child(6)").attr("id", "tableFuture").addClass("play");


// 4. Auto paint the chart when press ENTER key.
//    A lot easier than use the mouse click on Paint button.
$("table.play").on("keyup", "input[type=text]", function(e) {
	var code = (e.keyCode ? e.keyCode : e.which);
	if (code == 13) drawChart();
	
	// auto save
	saveCurrentSlot(); updateSlotDisplay();
});

 
// 5. Add confirm box for Save and Clear buttons.
//    prevent lost of data accidentally.
$(".tableSlot1 input[type=button]:eq(0), .tableSlot input[type=button]:eq(2)")
.click(function(e) {
	var slotName = $("#slot_data").val();
	var msg = "You are about to save (replace) to " 
			  + slotName + "\r\nClick OK to continue.";
			  
	if (!confirm(msg)) e.preventDefaults();
});


// 9. Experimental (Not use).
// $("table.play").on("click", "tbody input[type=button]", function() { 
// 	drawChart();
// })
// $("#tableFuture").append(localStorage.getItem("SLOT_2"))
