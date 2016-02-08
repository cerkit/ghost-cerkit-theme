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
var defaultTheme = 'cosmo';
var showThemeSelector = true;

/************************************************************************************************
* Alternate Subscribe link (for use with Feedburner or other RSS host)
************************************************************************************************/
var subscriptionLink = null;

function moveSidebarItems() {
    // move items to the sidebar
    $('.sidebar-component').each(function () {
        $(this).detach().appendTo($('#sidebar-component-container'));
    });
}

$(moveSidebarItems);


function setAlternateSubscriptionLink() {
    // see if we need to change the link on the subscription button to an alternate...
    if (subscriptionLink != null) {
        $('#subscribe-button').attr('href', subscriptionLink);

        // change the link for the site alternate, as well
        $('link [type*="application/rss+xml"]').attr('href', subscriptionLink);
    }
}

$(setAlternateSubscriptionLink);

