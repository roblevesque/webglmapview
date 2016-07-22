var lastInputBox;

$(document).ready(function() {
                // Controls menu hide/show
		$('#hotdog').click(function(){
                        $('#controls').toggleClass("active");
                        });

		// Reset view
    $('.reset-container').click(function(){ reset_view(); });
		$('#submitfindbyname').click(function() {
		      var selected = $('#findbyselect option:selected').text();
		      zoomfocus(selected);
		});
		$('#calctnd').click(function() {
			$('#cal_start').html( $('#pointa  option:selected').text() );
			$('#cal_end').html( $('#pointb  option:selected').text() );
			$('#cal_speed').html( $('#speed').val() +" " + $('#speedunit option:selected').val() );
			var dist = calcDist( $('#pointa  option:selected').text(),  $('#pointb  option:selected').text() );
			var eta = calcETA({'speed': $('#speed').val(), 'unit':  $('#speedunit option:selected').val()},dist)
			$('#cal_eta').html( timeformat(eta) );
			$('#cal_dist').html( dist.toFixed(2) + " PC");

		});

		$("#pointa").focus(function() {
			lastInputBox = "pointa";
		//	console.log('Updating last touched box to : ' + lastInputBox)
		});
		$("#pointb").focus(function() {
			lastInputBox = "pointb";
		//	console.log('Updating last touched box to : ' + lastInputBox)
		});


});


function populateUserFields() {
	//Populate find by select dropdown
   var types = [];
	 var checkboxes = document.getElementsByName("objtype");
	 for (var type in checkboxes) {
	 if(checkboxes[type].checked) {
			types[type] = checkboxes[type].value;
		}

	 }
	 var option = '';
	 for (var type in types){
        	 for ( var key in listobjects(types[type]) ){
    	    		 option += '<option value="'+ escapeHTML(key) + '">' + escapeHTML(key) + '</option>';
   		 }
	}

	$('#findbyselect').html(option);

  // Populate pointa and pointb dropdowns
	var types = ['planets','stations'];
	for (var type in types){
					for ( var key in listobjects(types[type]) ){
							option += '<option value="'+ escapeHTML(key) + '">' + escapeHTML(key) + '</option>';
			}
 	}

 	$('#pointa').html(option);
	$('#pointb').html(option);

}

function openTab(evt,tabName) {
    var i, x, tablinks;
    x = document.getElementsByClassName("wvg-tools");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("wvg-tablink");
    for (i = 0; i < x.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" wvg-tab-active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " wvg-tab-active";
}

function escapeHTML(text) {
       var chr = { '"': '"', '&': '&', '<': '[', '>': ']' };
       function abc(a)
       {
          return chr[a];
       }
       return text.replace(/[\"&<>]/g, abc);
}

function timeformat(secs) {
	  var s = new Decimal(secs);
    var hours = new Decimal(secs / 3600);
		var h = hours.floor(); //Get whole hours
		s = s - (h * 3600);
		var m = new Decimal(s / 60); //Get remaining minutes
		m = m.floor();
    s = s - (m * 60 );
		s = Math.round(s,0)
		console.log("Hours :"+ h);
		console.log("Minutes :"+ m);
		console.log("Seconds :"+ s);
		console.log("Input :"+ secs);
		return h+":"+(m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s); //zero padding on minutes and seconds
}
