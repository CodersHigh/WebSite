Event.onDOMReady(function() {
	
	var inputs = document.getElementsByTagName('input');
	
	for (var i = 0; i < inputs.length; i++) {
		var input = $(inputs[i])
		if(input.hasClassName('prettysearch')) {
			
			var options = {};
			
			//these are unique autosave names for globally used
			//autosave collections
			
			//after decoration you can simply:
			//	field.setAttribute('autosave', 'autosaveName');
			
			if(input.hasClassName('applesearch')) {
				options.autosave = 'Apple.com';
			} else if (input.hasClassName('reseller')) {
				options.autosave = 'Apple.com Reseller';
			}
			
			if(input.parentNode.tagName == 'LABEL') {
				
				var placeholderText = "";
				
				var labelElement = input.up().getElementsByClassName('prettyplaceholder')[0];
				
				//either grab text in a classed element
				if(labelElement) {
					placeholderText = labelElement.innerHTML;
				
				//or grab text from right inside the label
				} else {
					placeholderText = input.parentNode.firstChild.nodeValue;
					input.parentNode.firstChild.nodeValue = '';
				}
				
				placeholderText = placeholderText.split('\n')[0];
				options.placeholder = placeholderText;

			}
			
			AC.decorateSearchInput(input, options);
		}
	}	
});
