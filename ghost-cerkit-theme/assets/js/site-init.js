/************************************************************************************************
* Pagination variables
************************************************************************************************/
// define the vars we'll use later 
// (the pagination will set the values each time it appears on screen)
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

$(document).ready(function () {

    // move items to the sidebar
    $('.move-to-sidebar').each(function () {
        $(this).detach().appendTo($('#sidebar-component-container'));
    });
});