/*

JS (JavaScript code)  

By Suthep Sangvirotjanaphat
https://github.com/surrealist/hehew-net-plus
January 2019

**/

// 0. Set these values as you want.
//    Hehew.net's original values is 600 and 900
var version = "1.3";
var min = 1000;
var max = 1200;

// 10. Add version on top 
$("body > table:nth-child(1) tr:nth-child(1)")
 .prepend("<td><div id='version'>plus<br/>" + version + "</div></td>");



// 1A. Replace min and max range from default
//
$("input#begin_range").val(min);
$("input#end_range").val(max);

// 1B. Auto load SLOT #1
loadCurrentSlot(); updateSlotDisplay();

// 1C. Add more slots
(function() { 
	var slot = $("#slot_data");
	for(var n = 5; n <= 12; n++) {
		slot.append("<OPTION value='SLOT_" + n + "'>Slot " + n + "</OPTION>");
	}
})();

// 2. Make the chart appeared at the first glance. 
//    (No blank white area on the right side)
drawChart();


// 3. Assigns ID for tables
//    This helps further CSS and JS code shorter
$("body > table:nth-child(2) table:nth-child(1)")
	.addClass("tableSlot1 play");
$("body > table:nth-child(2) table:nth-child(2)")
	.attr("id", "tableCall").addClass("play");
$("body > table:nth-child(2) table:nth-child(4)")
	.attr("id", "tablePut").addClass("play");
$("body > table:nth-child(2) table:nth-child(6)")
	.attr("id", "tableFuture").addClass("play");
$("table.tableSlot1 input[type=button]:eq(0)").attr("id", "btnSave");
$("table.tableSlot1 input[type=button]:eq(1)").attr("id", "btnLoad");
$("table.tableSlot1 input[type=button]:eq(2)").attr("id", "btnClear");

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
$("table.tableSlot1").on("click", "#btnSave, #btnClear", 
function(e) { 
	var text = $(this).val();
	if (text !== "Save" && text != "Clear") return;
	
	var slotName = $("#slot_data").val();
	var msg = "You are about to save (replace) to " 
			  + slotName + "\r\nClick OK to continue.";
			  
	if (!confirm(msg)) e.preventDefaults();
});

$("#btnClear").click(function() { 
	$("input#begin_range").val(min);
	$("input#end_range").val(max);
})

// 9. Experimental (Not use).
// $("table.play").on("click", "tbody input[type=button]", function() { 
// 	drawChart();
// })

// $("#tableFuture").append(localStorage.getItem("SLOT_2"))

// get highcharts instance
// var chart=Highcharts.charts[1];

function getChart() {
	var chartId = $("div[data-highcharts-chart]").data("highchartsChart")
	var chart=Highcharts.charts[chartId];
	
	return chart;
}


  
function x() { 
	function min(a, b) { return a < b ? a : b; }
	function max(a, b) { return a > b ? a : b; }
	
	var chart = getChart();
	// var series = {
	// 	data : []
	// };
	
	// var e = parseInt(document.getElementById("begin_range").value, 10);
	// var t = parseInt(document.getElementById("end_range").value, 10);
	// var n = [];
	// for (var r = e; r <= t; r += 1) {
	// 	n[n.length] = [r, 0]
	// }
	
	// n[100] = 50
	
	// chart.series.push(series);
	var values = chart.series[0].data;
	
	var markIndex = 120;
	var marks = [[markIndex, 0], [markIndex, 0]];
	marks[0][1] = max(values[markIndex], 0);
	marks[1][1] = min(values[markIndex], 0);
  
	chart.series.push({
        type: "line",
        color: "darkorange",
        lineWidth: 2, 
        name: "mark1",
        data: marks
      }
      ); 
}


addExport();

function addExport() { 
	var leftTD = $("table:eq(1) td:first");
	let btn = $("<button style='width:100%; margin-top: 8px; margin-bottom: 8px; padding: 5px;'>Make them OptionsGo.net!</button>");
	let div = $("<textarea id='ogn' style='width:100%; height: 300px; padding: 5px; border-radius: 5px;' onclick='$(this).select()'></textarea>");
	leftTD 
		.append(btn)
		.append(div);
	
	btn.click(makeExport);
}

function makeExport() { 
	let slotId = $("#slot_data").val();
	const dataJson = window.localStorage[slotId];
	
	let s = '';
	if (dataJson) {
		const data = eval('(' + dataJson + ')');
		
		s += `@group ${slotId} from HehewNet\n`;
		s += '\n';
		 
		data.longFuture.forEach(function(x) {
			s += `LF @${x.price} x ${x.amount}\n`;	
		});
		data.shortFuture.forEach(function(x) {
			s += `SF @${x.price} x ${x.amount}\n`;	
		});
		data.longCall.forEach(x => {
			s += `LC ${x.strikePrice} @${x.premium} x ${x.amount}\n`;
		});
		data.longPut.forEach(x => {
			s += `LP ${x.strikePrice} @${x.premium} x ${x.amount}\n`;
		});
		data.shortCall.forEach(x => {
			s += `SC ${x.strikePrice} @${x.premium} x ${x.amount}\n`;
		});
		data.shortPut.forEach(x => {
			s += `SP ${x.strikePrice} @${x.premium} x ${x.amount}\n`;
		});
	}
	
	$('#ogn').text(s);
}
