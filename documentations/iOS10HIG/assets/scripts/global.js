document.addEventListener('DOMContentLoaded', init, false);

var directoryNav, subNav, sectionHead;

function init() {
	directoryNav = document.getElementById('directorynav');
	subNav = document.getElementsByClassName('sub-title');

	if(directoryNav != null) {
		sectionHead = directoryNav.getElementsByTagName('h3');

		for(var i=0;i<sectionHead.length;i++){
			sectionHead[i].addEventListener('click',toggleFooterNav,false);
		}

	}

	if(subNav != null) {
		for(var i=0;i<subNav.length;i++){
			subNav[i].addEventListener('click',toggleSubNav,false);
		}
	}

}

function toggleFooterNav(e) {
	e.currentTarget.classList.toggle('enhance');
}

function toggleSubNav(e) {
	var targetParent = e.currentTarget.parentNode;
	targetParent.classList.toggle('enhance');
	targetParent.getElementsByTagName('ul')[0].classList.toggle('nav-reveal');
}

document.onscroll = function closeNav() {
	if (window.scrollY) {
	subNav = document.getElementsByClassName('sub-title');

	for(var i=0;i<subNav.length;i++){
		if(	subNav[i].parentNode.classList.contains('enhance')) {
			subNav[i].parentNode.classList.toggle('enhance');
			subNav[i].parentNode.getElementsByTagName('ul')[0].classList.toggle('nav-reveal');
		}
	}
}
}
