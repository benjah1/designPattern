({
	"appDir": "app/",
	"baseUrl": "./scripts",
	"dir": "./dist",
	"name": "main",
	fileExclusionRegExp: /^(\.(css|js|html)$)/,
	removeCombined: true,
	"paths":{
		"jquery": "vendor/jquery/jquery.min",
		"underscore": "vendor/underscore/underscore-min",
		"backbone": "vendor/backbone/backbone-min",
		"mmenu": "mmenu-2.2.2/jquery.mmenu.min",
		"swiper": "idangerous.swiper-2.0.min",
		"zoom": "jquery.panzoom.min"
	},
	shim:{
		"backbone":	{
			deps: ['underscore','jquery'],
			exports: 'Backbone'
		},
		"mmenu":{
			deps: ['jquery'],
			exports: 'mmenu'
		},
		"swiper":{
			deps: ['jquery'],
			exports: 'swiper'
		},
		"zoom": {
			deps: ['jquery'],
			exports: 'zoom'
		}
	}
})
