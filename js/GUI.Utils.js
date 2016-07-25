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
			removeEntity('arrow');
			lastInputBox = null;
			if ( $('#pointa  option:selected').text() != $('#pointb  option:selected').text() && (!$('#pointa  option:selected').text().match("[=.] (.+) [=.]") && !$('#pointb  option:selected').text().match("[=.] (.+) [=.]"))) {
			$('#cal_start').html( $('#pointa  option:selected').text() );
			$('#cal_end').html( $('#pointb  option:selected').text() );
			$('#cal_speed').html( $('#speed').val() +" " + $('#speedunit option:selected').val() );
			var dist = calcDist( $('#pointa  option:selected').text(),  $('#pointb  option:selected').text() );
			var eta = calcETA({'speed': $('#speed').val(), 'unit':  $('#speedunit option:selected').val()},dist)
			$('#cal_eta').html( timeformat(eta) );
			$('#cal_dist').html( dist.toFixed(2) + " PC");
			drawline(grabPositionByName($('#pointa  option:selected').text()),grabPositionByName($('#pointb  option:selected').text()));
			}
		});
		$('#cbs').click(function() {populateFBSelect(); });
		$('#cbp').click(function() {populateFBSelect(); });
		$("#pointa").focus(function() {
			lastInputBox = "pointa";
		//	console.log('Updating last touched box to : ' + lastInputBox)
		});
		$("#pointb").focus(function() {
			lastInputBox = "pointb";
		//	console.log('Updating last touched box to : ' + lastInputBox)
		});
		String.prototype.capitalize = function(lower) {
    return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
		};


});


function populateUserFields() {
	// Populate findby box
	populateFBSelect();
  // Populate pointa and pointb dropdowns
	var types = ['planets','stations'];
	option = "";
	for (var type in types){
			var keys = Object.keys(listobjects(types[type]));
			var captype = types[type];
			captype = captype.capitalize()
			option += '<option value="">==== ' + captype + ' ====</option>';
			keys.sort().forEach(function(element, index, array){
				 option += '<option value="'+ escapeHTML(element) + '">' + escapeHTML(element) + '</option>';
			 });

 	}

 	$('#pointa').html(option);
	$('#pointb').html(option);

}
function populateFBSelect() {
	//Populate find by select dropdown
	 var types = [];
	 var checkboxes = document.getElementsByName("objtype");
	 for (var type in checkboxes) {
	 if(checkboxes[type].checked) {
			types[type] = checkboxes[type].value;
		}

	 }
	 var option = '';
	 for (var type in types) {
						var keys = Object.keys(listobjects(types[type]));
						keys.sort().forEach(function(element, index, array){
							 option += '<option value="'+ escapeHTML(element) + '">' + escapeHTML(element) + '</option>';
						 });

	}

	$('#findbyselect').html(option);

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
	//	console.log("Hours :"+ h);
	//	console.log("Minutes :"+ m);
	//	console.log("Seconds :"+ s);
	//	console.log("Input :"+ secs);
		return h+":"+(m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s); //zero padding on minutes and seconds
}
