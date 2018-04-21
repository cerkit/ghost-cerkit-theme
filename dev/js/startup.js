// startup initialization
$(function () {
  "use strict";

  _cerkit.methods.moveSidebarItems();
  _cerkit.sidebar.setMobileSidebar();
  _cerkit.config.setAlternateSubscriptionLink();
  _cerkit.config.convertPrettyfierToPrism();
  _cerkit.config.setGoogleSearchOptions();
  _cerkit.navbar.bindLinkIcons();
  _cerkit.config.setSoundCloudOptions();

  // Bootstrap theme selector
  _cerkit.themeSelector.selectedTheme = $.cookie('user-theme');

  if (_cerkit.themeSelector.showThemeSelector) {
    if (_cerkit.themeSelector.selectedTheme) {
      _cerkit.themeSelector.changeTheme(_cerkit.themeSelector.selectedTheme);
    }
    else {
      _cerkit.themeSelector.setSelectedOption(_cerkit.themeSelector.defaultTheme);
      _cerkit.themeSelector.changeTheme(_cerkit.themeSelector.defaultTheme);
    }
  }
  else {
    $('#themeSelectorContainer').hide();
    _cerkit.themeSelector.clearTheme();
  }

  $(document).on('change', '#theme-selector', function (e) {
    _cerkit.themeSelector.selectedTheme = e.target.options[e.target.selectedIndex].value;
    _cerkit.themeSelector.setTheme();
  });

  // see if there are any previous pages
  // if so, append them to the pagination ul
  if (_cerkit.pagination.prev > 0) {
    $('ul.bootstrap-pagination').append('<li class="prev"><a href="' + _cerkit.pagination.pageUrlFirst + '" title="Go to first page" aria-label="First"><span aria-hidden="true"><i class="fa fa-angle-double-left"></i></i></span></a></li>');
    $('ul.bootstrap-pagination').append('<li class="prev"><a href="' + _cerkit.pagination.pageUrlPrev + '" title="Go to previous page" aria-label="Previous"><span aria-hidden="true"><i class="fa fa-angle-left"></i></span></a></li>');
  }

  if (_cerkit.pagination.useSimplePagination) {
    _cerkit.pagination.doSimplePagination();
  }
  else {
    _cerkit.pagination.doComplexPagination();
  }

  // if we have pages after this one, display the 'next' buttons
  if (_cerkit.pagination.next > 0) {
    $('.bootstrap-pagination').append('<li class="nxt"><a href="' + _cerkit.pagination.pageUrlNext + '" title="Go to next page" aria-label="Next"><span aria-hidden="true"><i class="fa fa-angle-right"></i></span></a></li>');
    $('ul.bootstrap-pagination').append('<li class="nxt"><a href="' + _cerkit.pagination.pageUrlLast + '" title="Go to last page" aria-label="Last"><span aria-hidden="true"><i class="fa fa-angle-double-right"></i></i></span></a></li>');
  }
});
