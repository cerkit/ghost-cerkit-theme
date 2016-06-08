"use strict";

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
window.linkIconMap = {};
window.addLinkIcon = function (target, icon, size) {
    // check to see if we have maps defined already
    if (!window.linkIconMap.maps) {
        // if not, define it
        window.linkIconMap.maps = [];
    }

    // if we have a size passed in, use it, otherwise use the default icon size on our icon map. If that's missing, use nothing (Font Awesome default size)
    var iconSize = size ? size : 'defaultIconSize' in window.linkIconMap ? window.linkIconMap.defaultIconSize : '';
    window.linkIconMap.maps.push({ "target": target, "icon": icon, "size": iconSize });
};

/***********************************************************************************************/

function bindLinkIcons() {
    if (window.linkIconMap.maps) {
        var curIconMap;
        var curSize;

        for (var i = 0; i < window.linkIconMap.maps.length; i++) {
            // get a handle on the current icon map
            curIconMap = linkIconMap.maps[i];

            // set the icon on the navbar item
            createIcon(curIconMap.target, curIconMap.icon, curIconMap.size);
        }
    } else {
        console.warn('cerkit-bootstrap theme supports navbar link icons. Add the following to your footer in code injection: \<script\>window.addLinkIcon(/* target = */ "nav-home", /* icon = */ "fa-home", /* (optional) size = */ "fa-3x");\</script\>');
    }
}

function createIcon(target, icon, size) {
    var iconElement = $(document.createElement('i')).attr('class', 'link-icon fa fa-fw ' + icon + ' ' + size);
    var targetNavbarItem = $('.' + target);
    var targetItemFirstChild = $(targetNavbarItem).children()[0];

    // figure out if the nav item has any links in it. If so, use that as the icon parent.
    // Otherwise, use the navbarIconItem.
    var iconParentElement = targetItemFirstChild == null ? targetNavbarItem : targetItemFirstChild;

    // insert the icon element at the beginning of the parent
    $(iconParentElement).prepend(iconElement);
}

$(bindLinkIcons);