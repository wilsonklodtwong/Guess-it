
	var game = {};
		game.scoreVariables = {
			oneSec: 5,
			fiveSec: 3,
			tenSec: 1
		};
		game.questionScore = 0;
		game.totalScore = 0;
		game.clickCount = 0;
		game.clickCountMax = 1;
		game.userLevel = 0;
		game.answers = [
			{songName: "circle of life", movie: "the lion king" },
			{songName: "stand out", movie: "a goofy movie" },
			{songName: "savages", movie: "pocahontas" },
			{songName: "friend like me", movie: "aladdin" },
			{songName: "for the first time in forever", movie: "frozen" },
		];


		game.correctAnswer = function (tryAgain, correct, nextQuestionButton, number) {
			tryAgain.hide();
			correct.show();
			nextQuestionButton.show();
			game.userLevel = game.userLevel + 1;
			$(`#question${number} .question_result`).css('background-color', 'rgba(42, 182, 153, 0.7)')
			game.totalScore = game.totalScore + game.questionScore;
			console.log("Total Score", game.totalScore);
		};
		game.wrongBelowClickCount = function (tooManyTries, nextQuestionButton, tryAgain, number) {
			tooManyTries.show();
			nextQuestionButton.show();
			tryAgain.hide();
			game.userLevel = game.userLevel + 1;
			$(`#question${number} .question_result`).css('background-color', 'rgba(202, 52, 55, 0.7)')
			game.questionScore = 0;
		};
		game.wrongAboveClickCount = function (tryAgain, nextQuestionButton, number) {
			tryAgain.show();
			nextQuestionButton.hide();
			$(`#question${number} .question_result`).css('background-color', 'rgba(252, 199, 124, 0.7)')
			var fade_out = function() {
				$(`#question${number} .question_result`).fadeOut();
			}
			setTimeout(fade_out, 1000);
			game.clickCount++;
		};

$(document).ready(function(){

// SMOOTH SCROLL (code courtesy of https://paulund.co.uk/smooth-scroll-to-internal-links-with-jquery)

	$('a[href^="#"]').on('click',function (e) {
		    e.preventDefault();
		    var target = this.hash;
		    var $target = $(target);

		    if($(window).width() > 739) {
			    $('html, body').stop().animate({
			        'scrollTop': $target.offset().top + 80
			    }, 900, 'swing', function () {
			        window.location.hash = target;
			    });
			} else if ($(window).width() > 650) {
				$('html, body').stop().animate({
			        'scrollTop': $target.offset().top + 100
			    }, 900, 'swing', function () {
			        window.location.hash = target;
			    });
			} else if( $(window).width() < 650) {
			    $('html, body').stop().animate({
			        'scrollTop': $target.offset().top + 50
			    }, 900, 'swing', function () {
			        window.location.hash = target;
			    });
			}
	});

	$(".lets_play").on('click', function(){
		$('#question1').show();
		$('header').hide();
	});

// MUSIC BUTTONS

// setting music duration
	$('.music').on('click', function(){
		var clipLength = ($(this).data('duration'));
		$(`.audio_display${game.userLevel}`).trigger('play');
		$(`.audio_display${game.userLevel}`)[0].currentTime=0;
		setTimeout(function() {
			$(`.audio_display${game.userLevel}`).trigger('pause');
		}, clipLength);
	});

// assigning points to buttons
	 $('button').on('click', function(){
	 	var seconds = $(this).data('time');
		 	if( seconds === 10 ) {
		 		game.questionScore = game.scoreVariables.tenSec;
		 		console.log(game.questionScore)
		 	} else if(seconds === 5) {
		 		game.questionScore = game.scoreVariables.fiveSec;
		 		console.log(game.questionScore)
		 	} else if (seconds === 1 ) {
		 		game.questionScore = game.scoreVariables.oneSec;
		 		console.log(game.questionScore)
		 	}
	 });

 // disabling 1 and 5 sec buttons when advancing to longer time clip
	$('.five_sec').on('click', function(){
		$(this).siblings('.one_sec').attr('disabled', 'true');
		$(this).siblings('.one_sec').css('opacity', '0.5');

	});

	$('.ten_sec').on('click', function(){
	 	$(this).siblings('.five_sec, .one_sec').attr('disabled', 'true');
	 	$(this).siblings('.five_sec, .one_sec').css('opacity', '0.5');
	});

// RESULTS DIV

	$(parent).find(".question_result").hide();

// FORM SUBMIT FUNCTION

	function formSubmit(self){

		var number = $(self).data('form');
		var parent = $(self).closest('.playing_field');
		var userSongAnswer = $(parent).find('.song_name').val().toLowerCase();
		var userMovieAnswer = $(parent).find('.movie_name').val().toLowerCase();
		var questionResult = $(parent).find(`#question${number} .question_result`);
		var nextQuestionButton = $(parent).find(".question_result button");
		var correct = $(parent).find(".correct");
		var tryAgain = $(parent).find(".try_again");
		var tooManyTries = $(parent).find(".too_many_tries");
		var answer = game.answers[number - 1].songName + game.answers[number - 1].movie

		$(`#question${number} .question_result`).css({
			display: 'flex',
		});

		if(answer  === userSongAnswer + userMovieAnswer) {
			game.correctAnswer(tryAgain, correct, nextQuestionButton, number);
		} else if ((answer != userSongAnswer + userMovieAnswer) && (game.clickCount > game.clickCountMax)){
			game.wrongBelowClickCount(tooManyTries, nextQuestionButton, tryAgain, number);
		} else if (answer !=userSongAnswer + userMovieAnswer) {
			game.wrongAboveClickCount(tryAgain, nextQuestionButton, number);
		}

		$(`.to_question${number + 1}`).on('click', function(){
			$(`.form_${number}`).css('pointer-events', 'none');
			$(`#question${number}`).css('opacity', '0.5');
			game.clickCount = 0;
			$(`#question${number + 1}`).show();
		});

	};

// FORM SUBMISSION EVENT
	for (var i = 1; i <= 5; i++) {

		$(`.form_${i}`).on('submit', function(e) {
			e.preventDefault();
			formSubmit(this);
		});
	}

// TO RESULTS 

	$('.to_final_results').on('click', function(){

		var finalResults = $('main').find("#final_results");
		var topScore = $(finalResults).find("#top_result");
		var middleScore = $(finalResults).find("#middle_result");
		console.log(middleScore);
		var bottomScore = $(finalResults).find("#bottom_result");
		
		finalResults.show();

		if (game.totalScore >= 17) {
			topScore.show();
		} else if (game.totalScore >= 9 && game.totalScore <= 16) {
			middleScore.show();
		} else if (game.totalScore <= 8) {
			bottomScore.show();
		}

		$('.score').html(`<h3> You scored ${game.totalScore}/25!</h3>`)

		$(".form_5").css('pointer-events', 'none');
		$("#question5").css('opacity', '0.5');
	});

	$('.to_answers').on('click', function(){
		var answerKey = $('main').find('#answers');
		answerKey.show();
	});
});