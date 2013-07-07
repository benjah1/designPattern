requirejs.config({
	"baseUrl": "scripts",
	"paths":{
		"jquery": "vendor/jquery/jquery",
		"underscore": "vendor/underscore/underscore",
		"backbone": "vendor/backbone/backbone"
	},
	shim:{
		"backbone":	{
			deps: ['underscore','jquery'],
			exports: 'Backbone'
		}
	}
});



require(['jquery','backbone'],function($,Backbone){

	String.prototype.format = function() {
		var args = arguments;
		return this.replace(/\{(\d+)\}/g, function(match, number) { 
			return typeof args[number]!='undefined'?args[number]:'';
		});
	};

	var Pattern = Backbone.Model.extend({
	/*
		initialize: function(){
			this.name = '';
			this.img = '';
		}
		*/
	});	

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
		events:{
			'click .button.back':'back'
		},
		render:function(){
			$(this.el).html(this.template.format('', ''));	
			patterns.forEach(function(pattern){
				var learnItem = new LearnItemView({model:pattern});
				learnItem.render();
				$('#learn .sidebar ul').append('<li>'+pattern.get('name')+'</li>');
				$('#learn .slider').append(learnItem.el);
			});
			$('#learn .sidebar ul').append('<li><div class="back button">Return</div></li>');
			return this;
		},
		back:function(){
			app.render();		
		}
	});

	var LearnItemView = Backbone.View.extend({
		template: $('#tmpl-learn-item').html(),
		//events: {},
		render: function(){
			$(this.el).html(this.template.format(this.model.get('name'),this.model.get('img')));
			return this;
		}
	});

	var QuizView = Backbone.View.extend({
		el:$('#app'),
		template: $('#tmpl-quiz').html(),
		events: {
			'click .button.end': 'endQuiz',
			'click .button.next': 'nextQuestion'	
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

