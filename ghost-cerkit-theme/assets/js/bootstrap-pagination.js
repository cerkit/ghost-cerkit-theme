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
		$('ul.bootstrap-pagination').append('<li class="prev"><a href="' + pageUrlLast + '" title="Go to last page" aria-label="Last"><span aria-hidden="true"><i class="fa fa-angle-double-right"></i></i></span></a></li>');
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
	for (i = curPage; i < firstLiCount ; i++) {
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
