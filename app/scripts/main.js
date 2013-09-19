requirejs.config({
	"appDir": "/",
	"baseUrl": "scripts",
	"name": "name",
	"out": "main-built.js",
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
});

require(['jquery','backbone','mmenu','swiper', 'zoom'],function($,Backbone,mmenu,swiper, zoom){

	String.prototype.format = function() {
		var args = arguments;
		return this.replace(/\{(\d+)\}/g, function(match, number) { 
			return typeof args[number]!='undefined'?args[number]:'';
		});
	};

	var Pattern = Backbone.Model.extend({});	

	var Patterns = Backbone.Collection.extend({
		model: Pattern
	});

	var	MainView = Backbone.View.extend({
		el:$('#app'),
		template:$('#tmpl-main').html(),
		events:{
			'click .button.learn':'startLearn',
			'click .button.quiz':'startQuiz'
		},
		initialize:function(){
			this.learn = new LearnView();
			this.quiz = new QuizView();
		},
		render:function(){
			$(this.el).html(this.template);
			updateWindow();
			return this;
		},
		startLearn:function(){
			this.learn.render();
			updateWindow();
		},
		startQuiz:function(){
			this.quiz.start();	
			updateWindow();
			// todo clean quiz in memory after it is done 
		}
	});

	var LearnView = Backbone.View.extend({
		el:$('#app'),
		template:$('#tmpl-learn').html(),
		initialize: function(){
			var inst = this;
			$('body').on('mousedown','#menu-left a',function(){
				var index = $(this).attr('index');
				if(typeof index !== 'underfined'){
					inst.swiper.swipeTo(index);
				}
				return false;
			});
			$('body').on('mousedown','#menu-left .back',function(){
				$('nav#menu-left').on('closed.mmenu',function(){
					$('nav#menu-left').remove();
				});
				app.render();	
				return false;
			});	
		},
		events:{
			//'click a.back':'back' // dom change because mmenu
		},
		render:function(){
			$(this.el).html(this.template.format('', ''));	
			patterns.forEach(function(pattern, index){
				var learnItem = new LearnItemView({model:pattern});
				learnItem.render();
				$('#learn .mmenu-left ul').append('<li><a href="#" index="'+index+'">'+pattern.get('name')+'</a></li>');
				$('#learn .swiper-wrapper').append(learnItem.el);
			});
			$('#learn .mmenu-left ul').append('<li><a href="#" class="back">Return</a></li>');
			$('nav#menu-left').mmenu({
				searchfield: true
			});
			this.swiper = $('.swiper-container').swiper({
				mode: 'vertical'
			});
		 	$("img").panzoom();
		 	return this;
		}
	});

	var LearnItemView = Backbone.View.extend({
		el:'',
		template: $('#tmpl-learn-item').html(),
		//events: {},
		render: function(){
			this.el = this.template.format(this.model.get('name'),this.model.get('img'));
			return this;
		}
	});

	var QuizView = Backbone.View.extend({
		el:$('#app'),
		template: $('#tmpl-quiz').html(),
		events: {
			'click .button.end': 'endQuiz',
			'click .button.next': 'nextQuestion',
			'click .button.answer': 'showAnswer'	
		},
		start: function(){
			this.quiz = patterns.clone().shuffle();	
			this.render();
		},
		render: function(){
			if(this.quiz.length == 0){
				return this.endQuiz();	
			}
			var pattern = this.quiz.pop();
			$(this.el).html(this.template.format(pattern.get('name'),pattern.get('img')));
			updateWindow();
		 	$("img").panzoom();
			return this;
		},
		endQuiz: function(){
			delete this.quiz;
			app.render();
			return this;
		},
		nextQuestion: function(){
			return this.render();
		},
		showAnswer: function(e){
			$('.img-container').slideDown(function(){
				$(e.target).slideUp();
			});
		}
	});

	var updateWindow = function(){
		$('body').css('height',window.innerHeight).css('width',window.innerWidth);
		$('.swiper-container').css('height',window.innerHeight).css('width',window.innerWidth);
		$('#learn .img').css('height',window.innerHeight-60);
		$('#quiz .img').css('height',window.innerHeight-120);
	}
	$(window).resize(updateWindow);
	
	var patterns = new Patterns([
		{name:'Singleton',img:'singleton.gif'},
		{name:'Factory',img:'factory.gif'},
		{name:'Factory Method',img:'factory-method.gif'},
		{name:'Abstract Factory',img:'abstract-factory.png'},
		{name:'Builder',img:'builder.png'},
		{name:'Prototype',img:'prototype.gif'},
		{name:'Object Pool',img:'object-pool.gif'},
		{name:'Chain of Responsibility',img:'chain-of-responsability.gif'},
		{name:'Command',img:'command.gif'},
		{name:'Interpreter',img:'interpreter.gif'},
		{name:'Iterator',img:'iterator.gif'},
		{name:'Mediator',img:'mediator.gif'},
		{name:'Memento',img:'memento.png'},
		{name:'Observer',img:'observer.gif'},
		{name:'Strategy',img:'strategy.gif'},
		{name:'Template Method',img:'template.gif'},
		{name:'Visitor',img:'visitor.png'},
		{name:'Null Object',img:'null-object.gif'},
		{name:'Adapter',img:'adapter.png'},
		{name:'Bridge',img:'bridge.png'},
		{name:'Composite',img:'composite.png'},
		{name:'Decorator',img:'decorator.png'},
		{name:'Flyweight',img:'flyweight.png'},
		{name:'Proxy',img:'proxy.png'}
	]);
	
	updateWindow();
	var app = new MainView();
	app.render();
});

