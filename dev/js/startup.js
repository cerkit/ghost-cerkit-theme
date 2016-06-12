// startup initialization
$(function () {

    _cerkit.methods.moveSidebarItems();
    _cerkit.config.setAlternateSubscriptionLink();
    _cerkit.config.convertPrettyfierToPrism();
    _cerkit.navbar.bindLinkIcons();

    // Bootstrap theme selector
    _cerkit.themeSelector.selectedTheme = $.cookie('user-theme');

    if (_cerkit.themeSelector.showThemeSelector) {
        if (_cerkit.themeSelector.selectedTheme) {
            _cerkit.themeSelector.changeTheme();
        }
        else {
            _cerkit.themeSelector.setSelectedOption(_cerkit.themeSelector.defaultTheme);
        }

        $(document).on('change', '#theme-selector', function (e) {
            _cerkit.themeSelector.selectedTheme = e.target.options[e.target.selectedIndex].value;
            _cerkit.themeSelector.setTheme();
        });
    }
    else {
        $('#theme-selector').css('display', 'none');
    }

    // see if there are any previous pages
    // if so, append them to the pagination ul
    if (_cerkit.pagination.prev > 0) {
        $('ul.bootstrap-pagination').append('<li class="prev"><a href="' + pageUrlFirst + '" title="Go to first page" aria-label="First"><span aria-hidden="true"><i class="fa fa-angle-double-left"></i></i></span></a></li>');
        $('ul.bootstrap-pagination').append('<li class="prev"><a href="' + pageUrlPrev + '" title="Go to previous page" aria-label="Previous"><span aria-hidden="true"><i class="fa fa-angle-left"></i></span></a></li>');
    }
    
    if (_cerkit.pagination.useSimplePagination) {
        _cerkit.pagination.doSimplePagination();
    }
    else {
        _cerkit.pagination.doComplexPagination();
    }
    
    // if we have pages after this one, display the 'next' buttons
    if (_cerkit.pagination.next > 0) {
        $('.bootstrap-pagination').append('<li class="nxt"><a href="' + pageUrlNext + '" title="Go to next page" aria-label="Next"><span aria-hidden="true"><i class="fa fa-angle-right"></i></span></a></li>');
        $('ul.bootstrap-pagination').append('<li class="nxt"><a href="' + pageUrlLast + '" title="Go to last page" aria-label="Last"><span aria-hidden="true"><i class="fa fa-angle-double-right"></i></i></span></a></li>');
    }
});
