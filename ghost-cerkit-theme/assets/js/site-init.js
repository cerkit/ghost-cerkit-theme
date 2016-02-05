"use strict";

/************************************************************************************************
* Pagination variables
*************************************************************************************************
* define the vars we'll use later 
* (the pagination will set the values each time it appears on screen)
************************************************************************************************/
var prev;
var pages;
var page;
var next;
var pageUrlPrev;
var pageUrlNext;
// define the number of page numbers that will be displayed before and after the ellipses
var numbersSurroundingEllipses = 3; // override this in the Settings->Code Injection if desired
var useSimplePagination = false;

/************************************************************************************************
* Theme selector variables
************************************************************************************************/
var linkToBootstrapCDN = "//maxcdn.bootstrapcdn.com/bootswatch/3.3.6/";
var themeStyleCss = "/bootstrap.min.css";
var defaultTheme = 'simplex';
var showThemeSelector = true;

/************************************************************************************************
* Alternate Subscribe link (for use with Feedburner or other RSS host)
************************************************************************************************/
var subscriptionLink = null;

/************************************************************************************************
* Navbar Icons
* 
* Requires that a JSON object named "navbarIconMap" be defined in your FOOTER in Code Injection
* 
* Here is a sample JSON definition:
* 
*   var navbarIconMap = { 
*        "defaultIconSize" : "fa-lg", 
*        "iconMaps" : [
*			{ "target" : "nav-home", "icon" : "fa-home" },
*			{ "target" : "nav-about", "icon" : "fa-user" },
*			{ "target" : "nav-my-public-key", "icon" : "fa-key" }
*		]
*    };
* 
*  Note: for defaultIconSize, the following values are valid:
*  
*  '' (will use default fontawesome size), 
*  'fa-lg'
*  'fa-2x'
*  'fa-3x'
*  'fa-4x'
*  'fa-5x'
* 
*  If you do not supply a size for your icon, then the theme will use the default size 
*  as determined by the defaultNavbarIconSize variable
* 
*  You can find a list of icons to use at http://fontawesome.io
* 
************************************************************************************************/
var curIconMap;
var curSize;
var targetNavbarItem;
var targetItemFirstChild;
var iconParentElement;
/***********************************************************************************************/

$(document).ready(function () {
	// show the content of the page
	$('main.content').removeClass('hidden');
    // move items to the sidebar
    $('.sidebar-component').each(function () {
        $(this).detach().appendTo($('#sidebar-component-container'));
    });

	// see if we need to change the link on the subscription button to an alternate...
    if (subscriptionLink != null) {
    	$('#subscribe-button').attr('href', subscriptionLink);

    	// change the link for the site alternate, as well
    	$('link [type*="application/rss+xml"]').attr('href', subscriptionLink);
    }

    if (navbarIconMap != null) {
    	for (var i = 0; i < navbarIconMap.iconMaps.length; i++) {
    		curIconMap = navbarIconMap.iconMaps[i];
			// see if the current map provided a size. If not, use the default
    		curSize = 'size' in curIconMap ? curIconMap.size : navbarIconMap.defaultIconSize;

    		// set the icon on the navbar item
    		console.log('curIconMap.target = ' + curIconMap.target);

    		targetNavbarItem = $('.' + curIconMap.target);

    		console.log('$(targetNavbarItem).html() = ' + $(targetNavbarItem).html());
			
    		targetItemFirstChild = $(targetNavbarItem).children()[0];

    		// figure out if the nav item has any links in it. If so, use that as the icon parent.
    		// Otherwise, use the navbarIconItem.
    		iconParentElement = targetItemFirstChild == null ? targetNavbarItem : targetItemFirstChild;

    		console.log($(iconParentElement).html());

    	    // insert the icon element at the beginning of the parent
    		var iconElement = createIcon(curIconMap.icon, curSize);
    		$(iconParentElement).prepend(iconElement);
    	}
    }
});

function createIcon(icon, size) {
    var iconElement = $(document.createElement('i')).attr('class', 'fa fa-fw ' + icon + ' ' + size).append('&nbsp;');
    console.log('iconElement class attribute value: "' + iconElement.attr('class') + '"');
    return iconElement;
}