$(document).ready(function() {
                // Controls menu hide/show
		$('#hotdog').click(function(){
                        $('#controls').toggleClass("active");
                        });	
		
		// Reset view 
                $('.reset-container').click(function(){ reset_view(); }); 
		$('#submitfindbyname').click( function() {   
		      var selected = $('#findbyselect option:selected').text();
		      zoomfocus(selected);
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

function escapeHTML(text)
    {
       var chr = { '"': '"', '&': '&', '<': '[', '>': ']' };
       function abc(a)
       {
          return chr[a];
       }
       return text.replace(/[\"&<>]/g, abc);
    }
