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
*        'defaultIconSize' : 'fa-lg', 
*        'iconMaps' : [
*			{ 'class' : 'nav-home', 'icon' : 'fa-home' },
*			{ 'class' : 'nav-about', 'icon' : 'fa-user' },
*			{ 'class' : 'nav-my-public-key', 'icon' : 'fa-key' }
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
    		console.log('curIconMap.class = ' + curIconMap.class);

    		targetNavbarItem = $('.' + curIconMap.class);

    		console.log('$(targetNavbarItem).html() = ' + $(targetNavbarItem).html());
			
    		// figure out if the nav item has any links in it. If so, use that as the icon parent.
    		targetItemFirstChild = $(targetNavbarItem).children()[0];

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
/*********************************************************************************************************
* bootstrap-pagination.js
*
* This script will generate a bootstrap compliant pagination component using Ghost pagination variables.
* It requires a custom pagination.hbs file in your partials folder for your Ghost theme.
*
*********************************************************************************************************/

$(document).ready(function() {	
	//alert('prev: ' + prev + '\r\npages: ' + pages + '\r\npage: ' + page + '\r\nnext: ' + next);

	// see if there are any previous pages
	// if so, append them to the pagination ul
	if (prev > 0) {
		$('ul.bootstrap-pagination').append('<li class="prev"><a href="' + pageUrlFirst + '" title="Go to first page" aria-label="First"><span aria-hidden="true"><i class="fa fa-angle-double-left"></i></i></span></a></li>');
		$('ul.bootstrap-pagination').append('<li class="prev"><a href="' + pageUrlPrev + '" title="Go to previous page" aria-label="Previous"><span aria-hidden="true"><i class="fa fa-angle-left"></i></span></a></li>');
	}
	
	if (useSimplePagination) {
		doSimplePagination();
	}
	else {
		doComplexPagination();
	}
	
	// if we have pages after this one, display the 'next' buttons
	if (next > 0) {
		$('.bootstrap-pagination').append('<li class="nxt"><a href="' + pageUrlNext + '" title="Go to next page" aria-label="Next"><span aria-hidden="true"><i class="fa fa-angle-right"></i></span></a></li>');
		$('ul.bootstrap-pagination').append('<li class="nxt"><a href="' + pageUrlLast + '" title="Go to last page" aria-label="Last"><span aria-hidden="true"><i class="fa fa-angle-double-right"></i></i></span></a></li>');
	}
});

// addPageLink() - Adds a <li> element containing a link to a given page. 
// This will also add the appropriate screen reader labels.
// pageNum - the number of the page to create a link to
function addPageLink(pageNum) {
	$('.bootstrap-pagination').append("<li class='page" + pageNum + "'><a href='/page/" + pageNum + "/' title='Go to page " + pageNum + "' aria-label='Go to page " + pageNum + "'>" + pageNum + "</a></li>");
}

function doSimplePagination() {
	$('.bootstrap-pagination').append('<li><a href="/page/"' + page + '" aria-label="Page ' + page + ' of ' + pages + '">Page ' + page + ' of ' + pages + '</a></li>');
}

function doComplexPagination() {
	// if numbersSurroundingEllipses is < 0 (-1 is the preferred value for this use case), then we need to reset it to max pages so we'll show all pages
	if (numbersSurroundingEllipses < 0) {
		numbersSurroundingEllipses = pages;
	}
	else if (numbersSurroundingEllipses < 2) {
		// make sure our numbers surrounding the ellipses isn't too small to function properly
		numbersSurroundingEllipses = 2;
	}
	
	var curPage = page;
	var showEllipses = true;
	// we need a number to see when to omit the ellipses and just show the last few page numbers
	// this happens as we get close to the end
	var maxAdjusted = pages - (numbersSurroundingEllipses * 2);
	// if our current page falls within the last few page numbers, we need to omit the ellipses
	// and show the "middle" page that would normally be covered up by the ellipses
	if (curPage > maxAdjusted) {	
		showEllipses = false;
		// adjust because we're adding a page to the middle where the ellipses was
		// we're showing the whole span of numbers until they click on a number below the threshold
		curPage = pages - (numbersSurroundingEllipses * 2);
	}
	else{
		// adjust so we show the page below the current page
		curPage--;
	}
	
	// check the floor...
	if (curPage < 1) {
		curPage = 1 ;
	};
	
	// we need a variable to tell us when to stop adding pages and show the ellipses
	var firstLiCount = curPage + numbersSurroundingEllipses;

	
	// create the list items for each page number
	for (var i = curPage; i < firstLiCount ; i++) {
		addPageLink(i);
	}
	
	// show the ellipses (or not if we're near the end) for pages above our threshold
	if (pages > numbersSurroundingEllipses) {
		
		if (showEllipses) {
			//append the ellipses as a link that simply navigates to the current page
			$('.bootstrap-pagination').append('<li><a href="/page/"' + page + '">&#x2026;</a></li>');
		}
		else
		{
			// add the "center" page instead of the ellipses
			// this happens when we get close to the end of the page numbers
			addPageLink(pages - numbersSurroundingEllipses);
		}
		
		// loop through our remaining page numbers and create the links
		for(i = pages - numbersSurroundingEllipses + 1; i <= pages; i++){
			addPageLink(i);
		}
	}		
	
	// set the current page link as active
	$('li.page' + page).addClass('active');
}

$(document).ready(function() {
	
	var selectedTheme = $.cookie('user-theme');
	
	if(selectedTheme != null) {		
		changeTheme(selectedTheme);
	}
	else {
		setSelectedOption(defaultTheme);
	}
	
	$(document).on('change', '#theme-selector', function(e) {
		//alert(e.target.options[e.target.selectedIndex].value);
		var selectedTheme = e.target.options[e.target.selectedIndex].value;
		setTheme(selectedTheme);
	});

	if(!showThemeSelector) {
		$('#theme-selector').css('display','none');
	}
});

function setTheme(theme) {
	$.cookie('user-theme', theme, { expires: 170, path: '/' });
	changeTheme(theme);
}

function changeTheme(selectedTheme) {
	setSelectedOption(selectedTheme);
	
	var completeCssLink = linkToBootstrapCDN + selectedTheme + themeStyleCss;
	$('link#bootstrap-theme').attr('href', completeCssLink);
}

function clearTheme() {
	$.removeCookie('user-theme', { path: '/' });
	changeTheme(defaultTheme);
}

function setSelectedOption(selectedTheme) {
	$("#theme-selector option").each(function() {
		if ($(this).val() === selectedTheme) {
			$(this).attr('selected','true');
		}
		else {
			$(this).removeAttr('selected');
		}
	});
}
/**
 * Main JS file for Casper behaviours
 */

/* globals jQuery, document */
(function ($, undefined) {
    "use strict";

    var $document = $(document);

    $document.ready(function () {

        var $postContent = $(".post-content");
        $postContent.fitVids();

        $(".scroll-down").arctic_scroll();

		/*
        $(".menu-button, .nav-cover, .nav-close").on("click", function(e){
            e.preventDefault();
            $("body").toggleClass("nav-opened nav-closed");
        });
		*/

    });

    // Arctic Scroll by Paul Adam Davis
    // https://github.com/PaulAdamDavis/Arctic-Scroll
    $.fn.arctic_scroll = function (options) {

        var defaults = {
            elem: $(this),
            speed: 500
        },

        allOptions = $.extend(defaults, options);

        allOptions.elem.click(function (event) {
            event.preventDefault();
            var $this = $(this),
                $htmlBody = $('html, body'),
                offset = ($this.attr('data-offset')) ? $this.attr('data-offset') : false,
                position = ($this.attr('data-position')) ? $this.attr('data-position') : false,
                toMove;

            if (offset) {
                toMove = parseInt(offset);
                $htmlBody.stop(true, false).animate({scrollTop: ($(this.hash).offset().top + toMove) }, allOptions.speed);
            } else if (position) {
                toMove = parseInt(position);
                $htmlBody.stop(true, false).animate({scrollTop: toMove }, allOptions.speed);
            } else {
                $htmlBody.stop(true, false).animate({scrollTop: ($(this.hash).offset().top) }, allOptions.speed);
            }
        });

    };
})(jQuery);

/*global jQuery */
/*jshint browser:true */
/*!
* FitVids 1.1
*
* Copyright 2013, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
*/

(function( $ ){

  "use strict";

  $.fn.fitVids = function( options ) {
    var settings = {
      customSelector: null
    };

    if(!document.getElementById('fit-vids-style')) {
      // appendStyles: https://github.com/toddmotto/fluidvids/blob/master/dist/fluidvids.js
      var head = document.head || document.getElementsByTagName('head')[0];
      var css = '.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}';
      var div = document.createElement('div');
      div.innerHTML = '<p>x</p><style id="fit-vids-style">' + css + '</style>';
      head.appendChild(div.childNodes[1]);
    }

    if ( options ) {
      $.extend( settings, options );
    }

    return this.each(function(){
      var selectors = [
        "iframe[src*='player.vimeo.com']",
        "iframe[src*='youtube.com']",
        "iframe[src*='youtube-nocookie.com']",
        "iframe[src*='kickstarter.com'][src*='video.html']",
        "object",
        "embed"
      ];

      if (settings.customSelector) {
        selectors.push(settings.customSelector);
      }

      var $allVideos = $(this).find(selectors.join(','));
      $allVideos = $allVideos.not("object object"); // SwfObj conflict patch

      $allVideos.each(function(){
        var $this = $(this);
        if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) { return; }
        var height = ( this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10))) ) ? parseInt($this.attr('height'), 10) : $this.height(),
            width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width(),
            aspectRatio = height / width;
        if(!$this.attr('id')){
          var videoID = 'fitvid' + Math.floor(Math.random()*999999);
          $this.attr('id', videoID);
        }
        $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100)+"%");
        $this.removeAttr('height').removeAttr('width');
      });
    });
  };
// Works with either jQuery or Zepto
})( window.jQuery || window.Zepto );