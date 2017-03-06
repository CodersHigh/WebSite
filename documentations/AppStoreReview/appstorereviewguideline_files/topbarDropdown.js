var dropdownMenu = {
	// initialize the click events to open the dropdown
	// trigger: DOMreference to the triggering elements
	// details: DOM reference to the details section that will be expanded
	init: function(trigger, details) {
		this.element = $$(trigger);
		this.details = $$(details);
		if (this.element.length == 0 || this.details.length == 0) {
			return false;
		}
		this.element.invoke('observe', 'click', this.openMenu.bind(this));
		$$('html').invoke('observe', 'click', this.closeMenu.bind(this));
	},

	// open the dropdown menu
	openMenu: function() {
		if (!this.isOpen) {
			this.element.invoke('addClassName', 'active');
			Effect.BlindDown(this.details[0], { duration: 0.01, afterFinish: function() {
				this.isOpen = true;
			}.bind(this)});
		}
	},

	// close the dropdown menu
	closeMenu: function() {
		if (this.isOpen) {
			this.isOpen = false;
			Effect.BlindUp(this.details[0], { duration: 0.01 });
			this.element.invoke('removeClassName', 'active');
			this.element.invoke('blur');
		}
	}
};
document.observe('dom:loaded', function() {
	dropdownMenu.init('.topbar .topbar-select', '.topbar .tooltip');
});