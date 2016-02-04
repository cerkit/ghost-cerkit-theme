# Cerkit Ghost Theme

Based on the default theme for [Ghost](http://github.com/tryghost/ghost/).

To download, visit the [releases](https://github.com/cerkit/ghost-cerkit-theme/tree/master/releases) page.

This theme provides support for [Bootstrap](http://getbootstrap.com) 3. It also includes [Font Awesome](http://fontawesome.io) and utilizes [Disqus](http://disqus.com) for comments.

There are a few features that have been added to the theme, such as:

- [Bootstrap Pagination](http://getbootstrap.com/components/#pagination)
- [Bootswatch Themes](http://bootswatch.com/)
- Theme Picker
- Disqus Comments
- Sidebar


## Bootstrap Pagination
The Pagination for the Casper theme has been replaced by Bootstrap pagination. 

*Note: In order to provide advanced pagination, it was necessary to utilize JavaScript. This impacts search engine visibility of pages as the pagination does not expose search-engine friendly links. It is important that you submit your sitemap to search engines as outlined in the Ghost documentation ([How do I submit my sitemap to Google?](http://support.ghost.org/how-do-i-submit-my-sitemap-to-google/)).*
*In addition, it is recommended to use tags with each of your posts as this will assist with SEO.*

*The default Casper theme that this theme is based on utilizes meta tags for next and previous navigation, as well as other SEO support, so the lack of static HTML pagination may not be an issue overall.*

There are a few different customizations supported for the pagination control.
In order to get the original pagination (which displays `Page 1 of X`), you will need to add the following code to your Code Injection in site settings (within a script block):

```useSimplePagination = true;```

Otherwise, your site will display a pagination control with 3 pages on either side of an ellipses (indicating there are pages in between the first and last pages). To change the number of pages surrounding the ellipses,
you will need to add the following within a script block: 

```numbersSurroundingEllipses = 5;```

If this value is set to -1 then it will display all page numbers on the control.

## Resource Loading
The Ghost Cerkit Theme uses [CDN](https://en.wikipedia.org/wiki/Content_delivery_network)s whenever possible to eliminate the need to manually manage source files.

## Bootswatch Themes
By default, the Ghost Cerkit Theme uses the [Superhero](http://bootswatch.com/superhero/) Bootswatch theme.

## Theme Picker
There is a theme selection control on the sidebar that allows the user to pick which theme they wish to display. To disable this theme picker on your site, simply add the following code within a script block in your Code Injection section in your site settings: 

```showThemeSelector = false;```

The theme selector will store the selected theme in a cookie on the user's browser. It will then change the page to use their selected theme on each page load. It also provides a Theme Reset button that will return the site to its default theme.

To change the default theme for your site without modifying the source code, simply add the following code in your Code Injection within a script block: 

```defaultTheme = 'cosmo';```

*Note: when you change the theme via JavaScript code, a theme is loaded twice: once for the default site theme, and once for the theme chosen by the theme picker or the `defaultTheme` override. If you wish to permanently change your default theme, it is recommended that you alter the default.hbs source and change it there.*

## Disqus Comments

The site utilizes Disqus for comments. You will need to follow the instruction on the [Ghost website](http://support.ghost.org/add-disqus-to-my-ghost-blog/) on how to set up Disqus.

*Note: The following setting is not currently supported. This will be fixed in a future release. For now, please modify the default.hbs file and change the link to the Disqus script to use your short name.

In order for this to work, you will need to add code to the header (in Code Injection on your site's settings page):

```disqusSite = 'cerkit';```

Replace 'cerkit' with the short name for your Disqus forum. 

## Sidebar
This theme makes use of a [sidebar partial](https://github.com/cerkit/ghost-cerkit-theme/blob/master/ghost-cerkit-theme/partials/sidebar.hbs). 
This partial uses other partials to build a sidebar. The following components are included in the sidebar:

- [Search Form](https://github.com/cerkit/ghost-cerkit-theme/blob/master/ghost-cerkit-theme/partials/search-form.hbs)
- A Sidebar Component Container - allows us to add components to the sidebar from other pages (in differing contexts)
- [Bio Panel](https://github.com/cerkit/ghost-cerkit-theme/blob/master/ghost-cerkit-theme/partials/bio-panel.hbs)
- [Sidebar Theme Picker](https://github.com/cerkit/ghost-cerkit-theme/blob/master/ghost-cerkit-theme/partials/sidebar-theme-picker.hbs)

In order for the bio panel to work, an Author context has to be passed in for each page that uses it. Here is an example:

    <div id="sidebar-container" class="col-md-4">
        {{#author}}
            {{> "sidebar"}}
        {{/author}}
    </div>

The same is true for a context that does not have immediate access to the author context. Here is how we use the sidebar from the tags.hbs page:

    <div id="sidebar-container" class="col-md-4">
        {{#posts.[0].author}}
		    {{> "sidebar"}}
        {{/posts.[0].author}}
	</div>
	
It should be noted that the bio panel only shows the information for the author of the first post in this case. The bio panel should not be used on the sidebar for sites with multiple authors.

### Adding components to the Sidebar from other pages (with other contexts)
Because the sidebar runs in the Author context, it makes it difficult to add items that require other contexts to it in a dynamic fashion.

As an example, this theme has added a panel containing social media share buttons to the sidebar. However, this panel is not in the sidebar partial file.
Instead, it is defined in the [post.hbs](https://github.com/cerkit/ghost-cerkit-theme/blob/master/ghost-cerkit-theme/post.hbs) file at the bottom. It uses a hidden `div` to contain the elements that need to be copied to the sidebar.

The reason we had to define this share panel in the post page is because it relies on the context of the _current_ post.
By doing it this way, we can add whatever data we want to the element and then simply move it to the sidebar during the page ready handler.

For a div to be moved to the sidebar, it merely needs to add the `sidebar-component` css class.
    
    <div class="hidden">
        <div class="panel panel-default sidebar-component">
	        <div class="panel-body">
                <p>This will be in the sidebar...</p>
            </div>
        </div>
    </div>

When the document ready handler fires, it will move everything on the page to the Sidebar Component Container element.
	
## Notes about custom JavaScript for the theme
Custom features and JavaScript features all use variables defined in the [assets/js/site-init.js](https://github.com/cerkit/ghost-cerkit-theme/blob/master/ghost-cerkit-theme/assets/js/site-init.js) file.

## Minification
Each of the scripts and css files are minified. If you make changes to the originals, make sure to save a _filename_.min._file-extension_ version.

## Copyright & License

Copyright (c) 2013-2016 Ghost Foundation - Released under the MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
