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