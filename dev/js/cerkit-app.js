"use strict";

var _cerkit = _cerkit || {};


_cerkit = {
    pagination: {
        /*********************************************************************************************************
        * Pagination
        *
        * This section will generate a bootstrap compliant pagination component using Ghost pagination variables.
        * It requires a custom pagination.hbs file in your partials folder for your Ghost theme.
        *
        ********************************************************************************************************/
        prev: null,
        next: null,
        pages: null,
        page: null,
        pageUrl: null,
        pageUrlPrev: null,
        pageUrlNext: null,
        // define the number of page numbers that will be displayed before and after the ellipses
        numbersSurroundingEllipses: 3, // override this in the Settings->Code Injection if desired
        useSimplePagination: false,
        addPageLink: function (pageNum) {
            $('.bootstrap-pagination').append("<li class='page" + pageNum + "'><a href='" + _cerkit.pagination.pageUrl + "page/" + pageNum + "/' title='Go to page " + pageNum + "' aria-label='Go to page " + pageNum + "'>" + pageNum + "</a></li>");
        },
        doSimplePagination: function () {
            $('.bootstrap-pagination').append('<li><a href="' + _cerkit.pagination.pageUrl + 'page/"' + _cerkit.pagination.page + '" aria-label="Page ' + _cerkit.pagination.page + ' of ' + _cerkit.pagination.pages + '">Page ' + _cerkit.pagination.page + ' of ' + _cerkit.pagination.pages + '</a></li>');
        },
        doComplexPagination: function () {
            // if numbersSurroundingEllipses is < 0 (-1 is the preferred value for this use case), then we need to reset it to max pages so we'll show all pages
            if (_cerkit.pagination.numbersSurroundingEllipses < 0) {
                _cerkit.pagination.numbersSurroundingEllipses = _cerkit.pagination.pages;
            }
            else if (_cerkit.pagination.numbersSurroundingEllipses < 2) {
                // make sure our numbers surrounding the ellipses isn't too small to function properly
                _cerkit.pagination.numbersSurroundingEllipses = 2;
            }

            var curPage = _cerkit.pagination.page;
            var showEllipses = true;
            // we need a number to see when to omit the ellipses and just show the last few page numbers
            // this happens as we get close to the end
            var maxAdjusted = _cerkit.pagination.pages - (_cerkit.pagination.numbersSurroundingEllipses * 2);
            // if our current page falls within the last few page numbers, we need to omit the ellipses
            // and show the "middle" page that would normally be covered up by the ellipses
            if (curPage > maxAdjusted) {
                showEllipses = false;
                // adjust because we're adding a page to the middle where the ellipses was
                // we're showing the whole span of numbers until they click on a number below the threshold
                curPage = _cerkit.pagination.pages - (_cerkit.pagination.numbersSurroundingEllipses * 2);
            }
            else {
                // adjust so we show the page below the current page
                curPage--;
            }

            // check the floor...
            if (curPage < 1) {
                curPage = 1;
            }

            // we need a variable to tell us when to stop adding pages and show the ellipses
            var firstLiCount = curPage + _cerkit.pagination.numbersSurroundingEllipses;


            // create the list items for each page number
            for (var i = curPage; i < firstLiCount; i++) {
                _cerkit.pagination.addPageLink(i);
            }

            // show the ellipses (or not if we're near the end) for pages above our threshold
            if (_cerkit.pagination.pages > _cerkit.pagination.numbersSurroundingEllipses) {

                if (showEllipses) {
                    //append the ellipses as a link that simply navigates to the current page
                    $('.bootstrap-pagination').append('<li><a href="' + _cerkit.pagination.pageUrl + 'page/"' + _cerkit.pagination.page + '">&#x2026;</a></li>');
                }
                else {
                    // add the "center" page instead of the ellipses
                    // this happens when we get close to the end of the page numbers
                    _cerkit.pagination.addPageLink(_cerkit.pagination.pages - _cerkit.pagination.numbersSurroundingEllipses);
                }

                // loop through our remaining page numbers and create the links
                for (i = _cerkit.pagination.pages - _cerkit.pagination.numbersSurroundingEllipses + 1; i <= _cerkit.pagination.pages; i++) {
                    _cerkit.pagination.addPageLink(i);
                }
            }

            // set the current page link as active
            $('li.page' + _cerkit.pagination.page).addClass('active');
        }
    },
    navbar: {
        /************************************************************************************************
        * Navbar Icons
        * 
        * 
        * Here is a sample use:
        * 
        *  window.linkIconMap.defaultIconSize = 'fa-lg';
        *  window.addLinkIcon('nav-home', 'fa-home');
        *  window.addLinkIcon('nav-about', 'fa-user');
        *  window.addLinkIcon('nav-my-public-key', 'fa-key');
        *  window.addLinkIcon('nav-test', 'fa-cogs');
        *   
        *  Note: for size, the following values are valid:
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
        linkIconMap: {},
        addLinkIcon: function (target, icon, size) {
            // check to see if we have maps defined already
            if (!_cerkit.navbar.linkIconMap.maps) {
                // if not, define it
                _cerkit.navbar.linkIconMap.maps = [];
            }

            // if we have a size passed in, use it, otherwise use the default icon size on our icon map. If that's missing, use nothing (Font Awesome default size)
            var iconSize = size ? size : 'defaultIconSize' in _cerkit.navbar.linkIconMap ? _cerkit.navbar.linkIconMap.defaultIconSize : '';
            _cerkit.navbar.linkIconMap.maps.push({ "target": target, "icon": icon, "size": iconSize });
        },
        bindLinkIcons: function () {
            if (_cerkit.navbar.linkIconMap.maps) {
                var curIconMap;

                for (var i = 0; i < _cerkit.navbar.linkIconMap.maps.length; i++) {
                    // get a handle on the current icon map
                    curIconMap = _cerkit.navbar.linkIconMap.maps[i];

                    // set the icon on the navbar item
                    _cerkit.navbar.createIcon(curIconMap.target, curIconMap.icon, curIconMap.size);
                }
            } else {
                console.warn('cerkit-bootstrap theme supports navbar link icons. Add the following to your footer in code injection: \<script\>window.addLinkIcon(/* target = */ "nav-home", /* icon = */ "fa-home", /* (optional) size = */ "fa-3x");\</script\>');
            }
        },
        createIcon: function (target, icon, size) {
            var iconElement = $(document.createElement('i')).attr('class', 'link-icon fa fa-fw ' + icon + ' ' + size);
            var targetNavbarItem = $('.' + target);
            var targetItemFirstChild = $(targetNavbarItem).children()[0];

            // figure out if the nav item has any links in it. If so, use that as the icon parent.
            // Otherwise, use the navbarIconItem.
            var iconParentElement = targetItemFirstChild === null ? targetNavbarItem : targetItemFirstChild;

            // insert the icon element at the beginning of the parent
            $(iconParentElement).prepend(iconElement);
        }
    },
    methods: {
        moveSidebarItems: function () {
            // move items to the sidebar
            $('.sidebar-component').each(function () {
                $(this).detach().appendTo($('#sidebar-component-container'));
            });
        }
    },
    /************************************************************************************************
    * Theme selector variables
    ************************************************************************************************/
    themeSelector: {
        linkToBootstrapCDN: "//maxcdn.bootstrapcdn.com/bootswatch/3.3.6/",
        themeStyleCss: "/bootstrap.min.css",
        defaultTheme: "cosmo",
        selectedTheme: null,
        showThemeSelector: true,
        setTheme: function () {
            $.cookie('user-theme', _cerkit.themeSelector.selectedTheme, { expires: 170, path: '/' });
            _cerkit.themeSelector.changeTheme(_cerkit.themeSelector.selectedTheme);
        },
        changeTheme: function (selectedTheme) {
            _cerkit.themeSelector.setSelectedOption(selectedTheme);

            var completeCssLink = _cerkit.themeSelector.linkToBootstrapCDN + selectedTheme + _cerkit.themeSelector.themeStyleCss;
            $('link#bootstrap-theme').attr('href', completeCssLink);
        },
        clearTheme: function () {
            $.removeCookie('user-theme', { path: '/' });
            _cerkit.themeSelector.changeTheme(_cerkit.themeSelector.defaultTheme);
        },
        setSelectedOption: function (selectedTheme) {
            $("#theme-selector option").each(function () {
                if ($(this).val() === selectedTheme) {
                    $(this).attr('selected', 'true');
                }
                else {
                    $(this).removeAttr('selected');
                }
            });
        }
    },
    config: {
        setAlternateSubscriptionLink: function () {
            // see if we need to change the link on the subscription button to an alternate...
            if (window.__themeCfg.alternateSubscribeLink) {
                $('#subscribe-button').attr('href', window.__themeCfg.alternateSubscribeLink);

                // change the link for the site alternate, as well
                $('link [type*="application/rss+xml"]').attr('href', window.__themeCfg.alternateSubscribeLink);
            }
            else {
                console.warn('ghost-cerkit-bootstrap theme supports an alternate RSS link (i.e. - FeedBurner) - put "\<script\>window.__themeCfg.alternateSubscribeLink = \'alternate rss url\';\<\/script\>" in Ghost code injection to turn it on');
            }
        },
        convertPrettyfierToPrism: function () {
            if ($('pre.prettyprint').length) {

                console.warn('there are ' + $('pre.prettyprint').length + ' prettyprint pre tags on this page');
                console.warn('there are ' + $('pre.linenums').length + ' linenums pre tags on this page');

                $('pre.prettyprint').each(function () {
                    $(this).removeClass('prettyprint').children('code').each(function () {
                        $(this).addClass('language-clike');
                    });
                });

                $('pre.linenums').each(function () {
                    $(this).removeClass('linenums').addClass('line-numbers');
                });
            }
        }
    }
};