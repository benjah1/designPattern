requirejs.config({
	"baseUrl": "scripts",
	"paths":{
		"jquery": "vendor/jquery/jquery",
		"underscore": "vendor/underscore/underscore",
		"backbone": "vendor/backbone/backbone",
		"mmenu": "mmenu-2.2.2/jquery.mmenu",
		"swiper": "idangerous.swiper-2.0.min"
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
		}
	}
});

require(['jquery','backbone','mmenu','swiper'],function($,Backbone,mmenu,swiper){

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
			return this;
		},
		startLearn:function(){
			this.learn.render();
		},
		startQuiz:function(){
			this.quiz.start();	
			// todo clean quiz in memory after it is done 
		}
	});

	var LearnView = Backbone.View.extend({
		el:$('#app'),
		template:$('#tmpl-learn').html(),
		initialize: function(){
			$('body').on('mousedown','#menu-left a',function(){
				var id = $(this).attr('name');
				if(typeof id !== 'underfined'){
					
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
			patterns.forEach(function(pattern){
				var learnItem = new LearnItemView({model:pattern});
				learnItem.render();
				$('#learn .mmenu-left ul').append('<li><a href="#" name="'+pattern.get('name').toLowerCase().replace(/\s/g,'-')+'">'+pattern.get('name')+'</a></li>');
				$('#learn .swiper-wrapper').append(learnItem.el);
			});
			$('#learn .mmenu-left ul').append('<li><a href="#" class="back">Return</a></li>');
			$('nav#menu-left').mmenu({
				searchfield: true
			});
			$('.swiper-container').swiper({
				mode: 'vertical'
			});
			return this;
		}
	});

	var LearnItemView = Backbone.View.extend({
		el:'',
		template: $('#tmpl-learn-item').html(),
		//events: {},
		render: function(){
			this.el = this.template.format(this.model.get('name'),this.model.get('img'),this.model.get('name').toLowerCase().replace(/\s/g,'-'));
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

	var patterns = new Patterns([
		{name:'Singleton',img:'singleton.png'},
		{name:'Factory',img:'factory.png'},
		{name:'Factory Method',img:'factory-method.png'}
	]);

	var app = new MainView();
	app.render();
});

