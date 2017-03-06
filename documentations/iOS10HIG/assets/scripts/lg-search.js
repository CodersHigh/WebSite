/*
Apple Developer Global CSS Framework Tweaks
Legacy Search JS
*/
(function(window, $) {

	//Kill the plugin if jQuery is unavailable on the page
	
	if(typeof $ === "undefined") { return false; }
	
	if(location.pathname.match(/\/library\//)) { return false; }

	var SearchModel = function() {

		this.query = "",
		this.all_results = [],
		this.keywords = [],
		this.json_location = "/search/data/featured.json",
		this.on_change_callbacks = [];

		$.ajax({
			'url': this.json_location,
			'type': 'GET',
			'dataType': 'json',
			'context': this,
			'success': function(json, status, request) {
				this.all_results = json;
				this.populate_keywords();
			},
			'error': function(request, status, errorThrown) {
				// Valid JSON wasn't returned by the server. Either the data returned
				// wasn't valid, or the request resulted in 500 error (internal server error)
				// console.error("Request returned with status '" + status + "'.");
				// console.error("Error: " + errorThrown.toString() + ".");
			},
			'complete': function(request, status) {
				
			}
		});

	};

	SearchModel.MIN_TERM_LENGTH = 3;

	SearchModel.sort_by_relevance = function(a, b) {
		return b.relevance - a.relevance;
	};

	SearchModel.prototype.get_query = function() {
		return this.query;
	};

	SearchModel.prototype.set_query = function(value) {
		this.query = value;
		this.on_change();
	};

	SearchModel.prototype.get_keywords = function() {
		return this.keywords;
	};

	SearchModel.prototype.populate_keywords = function() {
		
		for(var i = 0; i < this.all_results.length; i++) {
			
			var story = this.all_results[i];
			
			for(var j = 0; j < story.keywords.length; j++) {
				
				var keyword = story.keywords[j];
				
				if(this.keywords.indexOf(keyword) === -1) {
					this.keywords.push(keyword);
				}
				
			}
			
		}
		
		this.keywords.sort(function(a, b) {
			return a.length - b.length;
		});
		
	};

	SearchModel.prototype.register_callback = function(callback, scope) {
		this.on_change_callbacks.push([callback, scope]);
	};
	
	SearchModel.prototype.on_change = function() {
		
		for(var i = 0; i < this.on_change_callbacks.length; i++) {
			
			var callback = this.on_change_callbacks[i][0],
				scope = this.on_change_callbacks[i][1];
			
			callback.call(scope);
			
		}
		
	};

	var SearchController = function() {

		this.model = new SearchModel();
		this.searchbar = $('input.augmented').attr('autocomplete', 'off');
		this.current_results = [];
		this.results_list_wrapper = this.append_results_list_wrapper();
		this.results_list = this.results_list_wrapper.find('ul.results');

		this.model.register_callback(function() {
			
			this.current_results = this.get_filtered_results();
			
			if(this.current_results.length > 0) {
				this.rebuild_results_list();
				this.results_list_wrapper.removeClass('hidden');
			} else {
				this.results_list_wrapper.addClass('hidden');
			}
		
		}, this);

		this.searchbar.on('keypress input paste', $.proxy(function(e) {
			
			this.model.set_query(this.searchbar.val().trim());
			
		}, this));

		this.searchbar.on('click', $.proxy(function(e) {
			
			if(this.current_results.length > 0) {
				this.results_list_wrapper.removeClass('hidden');
			}
		
		}, this));

		this.results_list.on('mouseleave', $.proxy(function(e) {
			
			$('li.result.active').removeClass('active');
			
		}, this));

		$('<span class="autocomplete">').insertAfter(this.searchbar);
		
		this.autocomplete = $('.autocomplete');
		this.autocomplete.append('<span class="spacer">');
		this.autocomplete.append('<span class="completion">');

		this.model.register_callback(function() {
			
			var predicted = this.get_predicted_query();
			var query = this.model.get_query();
			var remainder = predicted.replace(query, '');
			
			this.autocomplete.find('span.spacer').text(query);
			this.autocomplete.find('span.completion').text(remainder);
			
		}, this);

	};

	SearchController.MAX_DISPLAYED_RESULTS = 8;

	SearchController.map_index_to_bounds = function(index, collection) {
		
		var len = collection.length;
		
		return (index % len + len) % len;
		
	};

	SearchController.begins_with = function(word, beginning) {
		
		if(word.length >= beginning.length &&
			word.substr(0, beginning.length) === beginning) {
			
			return true;
			
		} else {
			
			return false;
			
		}
		
	};

	SearchController.prototype.get_predicted_query = function() {
		
		var terms = this.model.get_query().split(" ").filter(function(term) {
			return term.length > 0;
		});
		
		if(terms.length > 0) {
			
			for(var i = 0; i < terms.length; i++) {
				
				var term = terms.slice(terms.length - 1 - i, terms.length).join(" "),
					keywords = this.model.get_keywords();
				
				for(var j = 0; j < keywords.length; j++) {
					
					var keyword = keywords[j],
						match = true;
					
					for(var k = 0; k < term.length; k++) {
						if(keyword.toLowerCase()[k] !== term.toLowerCase()[k]) {
							match = false;
						}
					}
					
					if(match) {
						return terms.join(" ") + keyword.substring(term.length, keyword.length);
					}
					
				}
				
			}
			
		}
		
		return '';
		
	};

	SearchController.prototype.get_filtered_results = function() {

		var terms = this.model.get_query()
			.toLowerCase()
			.split(" ")
			.filter(function(term) {
				return (term.length >= SearchModel.MIN_TERM_LENGTH);
			});

		//For every term included in the user's search query
		for(var i = 0; i < terms.length; i++) {
			
			var term = terms[i];
			
			//For every possible result in the model
			for(var j = 0; j < this.model.all_results.length; j++) {
				
				var result = this.model.all_results[j];
				
				//Reset the result object's 'relevance' value to zero
				if(i === 0) {
					result.relevance = 0;
				}
				
				result.relevance += this.calculate_relevance(result, term);
				
			}
			
		}

		return this.model.all_results
			.sort(SearchModel.sort_by_relevance)
			.filter(function(result) {
				return result.relevance > 0;
			})
			.filter(function(result, index) {
				return index < SearchController.MAX_DISPLAYED_RESULTS;
			});

	};

	SearchController.prototype.calculate_relevance = function(result, term) {
		
		var relevance = 0;
		
		//For each keyword associated with the result
		for(var i = 0; i < result.keywords.length; i++) {
			
			var keyword = result.keywords[i];
			var sub_keywords = keyword.split(" ");
			
			//Separate logic for single-term and multi-term keywords
			if(sub_keywords.length > 1) {
				
				//Multi-term keyword logic
				var sub_keywords = keyword.split(" ");
				
				for(var j = 0; j < sub_keywords.length; j++) {
					
					var sub_keyword = sub_keywords[j];
					
					if(SearchController.begins_with(sub_keyword.toLowerCase(), term)) {
						relevance += 1;
						//console.log(" --> " + result.url.replace("https://developer.apple.com","") + " matched term '" + term + "' with sub-keyword '" + sub_keyword + "' (relevance -> " + result.relevance + ")");
					}
					
				}
				
			} else {
				
				//Single-term keyword logic
				if(SearchController.begins_with(keyword.toLowerCase(), term)) {
					relevance += 1;
					//console.log(" --> " + result.url.replace("https://developer.apple.com","") + " matched term '" + term + "' with keyword '" + keyword + "' (relevance -> " + result.relevance + ")");
				}
				
			}
			
		}
		
		return relevance;
		
	};

	SearchController.prototype.set_active_result = function(at_index) {
		
		$('li.result.active').removeClass('active');
		
		$('li.result').eq(at_index).addClass('active');
		
	};

	SearchController.prototype.append_results_list_wrapper = function() {
		
		var wrapper = $('<div>').addClass('recommended hidden')
			.append($('<span>').addClass('recommended-label').text("Recommended Results"))
			.append($('<ul>').addClass('results'));
		
		$('#gh-search').append(wrapper);
		
		return wrapper;
		
	};

	SearchController.prototype.rebuild_results_list = function() {
		
		this.results_list.empty();
		
		for(var i = 0; i < this.current_results.length; i++) {
			
			var result_obj = this.current_results[i];
			
			this.results_list.append(this.build_result_item(result_obj));
			
		}
		
		var resultItem = this.build_result_item({
			"url": "/search/?q=" + encodeURI(this.model.get_query()),
			"title": "Get more"
		});
		
		this.results_list.append(resultItem.addClass('get-more'));
		
	};

	SearchController.prototype.build_result_item = function(result) {
		
		var icons_path = "/assets/elements/icons/16x16/",
			item = $('<li>').addClass('result');
		
		item.on('mouseover', $.proxy(function(e) {
			
			var index = $('.result').index($(e.currentTarget));
			
			this.set_active_result(index);
			
		}, this));
		
		if("url" in result) {
			
			var link = $('<a href="' + result.url + '">');
			
			if("category" in result) {
				
				var thumbnail = $('<img>').addClass('result-thumbnail').attr('src', icons_path + result.category + ".svg");
				
				link.append(thumbnail);
				
			}
			
			if("title" in result) {
				
				var title = $('<span>').addClass('result-title').text(result.title);
				
				link.append(title);
				
			}
			
			item.append(link);
			
		}
		
		return item;
		
	};

	$(document).ready(function() {
		
		// var userAgentClass = (AC.Detector.isWebKit() && !AC.Detector.isChrome()) ? "safari" :
		// 	(AC.Detector.isChrome()) ? "chrome" :
		// 	(AC.Detector.isFirefox()) ? "firefox" :
		// 	(AC.Detector.isOpera()) ? "opera" : "chrome";
	
		// $('#gh-search').addClass(userAgentClass);
		

		var KEYS = {
			ARROW_UP: 		38,
			ARROW_DOWN: 	40,
			ARROW_LEFT: 	37,
			ARROW_RIGHT: 	39,
			ENTER: 			13,
			TAB: 			9,
			ESCAPE: 		27
		};

		//Suppress augmented search feature on mobile devices
		///if(((window.innerWidth > 0) ? window.innerWidth : screen.width) > 320 || !AC.Detector.isMobile()) {
		/*if(!AC.Detector.isMobile() && !AC.Detector.isiPad()) {*/

		var controller = new SearchController();

		$(window).on('click', function(e) {
			
			if(e.target !== controller.searchbar[0] &&
				e.target !== controller.results_list_wrapper[0] &&
				controller.results_list_wrapper.children().index($(e.target)) === -1)
			{
				controller.results_list_wrapper.addClass('hidden');
			}
			
		});

		controller.searchbar.on('keydown', function(e) {
			
			switch (e.keyCode) {
				
				case KEYS.ARROW_UP:
					/* falls through */
				case KEYS.ARROW_DOWN:
					
					e.preventDefault();
					
					var new_index;
					
					if($('li.result.active').length === 0) {
						
						new_index = (e.keyCode === 38) ?
							$('li.result').length - 1 : 0;
							
						controller.set_active_result(new_index);
						
					} else {
						
						var current_index = $('li.result').index($('li.result.active'));
						
						new_index = current_index + (e.keyCode === 38 ? -1 : 1);
						
						controller.set_active_result(SearchController.map_index_to_bounds(new_index, $('li.result')));
						
					}
					
					break;
					
				case KEYS.ARROW_RIGHT:
					
					controller.searchbar.val(controller.get_predicted_query());
					controller.searchbar.trigger('input');
					
					break;
					
				case KEYS.ENTER:
					
					var active = $('li.result.active');
					
					if(active.length) {
						e.preventDefault();
						window.location = active.find('a')[0].href;
					}
					
					break;
					
				case KEYS.ESCAPE:
					
					controller.results_list_wrapper.addClass('hidden');
					
					break;
					
			}
			
		});

		$('li.gh-nav-search.enhance').click(function(event) {
			
			$('li.gh-nav-search.enhance').addClass('active');
			$('.gh-search-input').focus();
			
		});

		$('.gh-search-input').blur(function() {
			
			$('.gh-search-input').val('');
			$('span.spacer').text('');
			$('span.completion').text('');
			$('li.gh-nav-search.enhance').removeClass('active');
			$('.reccomend').addClass('hidden');
			
		});

		jQuery.fn.existsWithValue = function() {
			
			return this.length && this.val().length;
			
		};

		if($('.gh-search-input').existsWithValue()) {
			$('.gh-search-reset').css('opacity', '1');
		};

		// Clear file upload
		$(".clear-upload").click(function(e) {
			
			e.preventDefault();
			
			$(this).siblings('input[type=file]').val('');
			$(this).hide();
			
		});

		$('input[type=file]').change(function() {
			
			$(this).siblings('.clear-upload').show();
			
		});

	});

})(window, jQuery);
