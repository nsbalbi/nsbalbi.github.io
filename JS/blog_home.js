
(function () {
	window.onpageshow = function(event) {
		if (event.persisted) {
			window.location.reload();
		}
	};
})();

setTimeout(function(){
  $("#body").css("pointer-events", "auto");
},1900);

$(function() {
  $("#home-button")
    .on("click", function(){

      // Disable clicking
      $("#body").css("pointer-events", "auto");

      const main = document.getElementById("main");
      const arrow = document.getElementById("home-button")
      
      main.style.animation = 'none';
      arrow.style.animation = 'none';
      main.offsetHeight;
      arrow.offsetHeight; 
      main.style.animation = 'out_to_right 2s ease';
      arrow.style.animation = 'out_to_top 2s ease';

      setTimeout(function(){
        window.location.href = "index.html";
      },1900);
   });
});

$(function() {
  $(".gallery-entry")
    .on("click", function(){

      // Disable clicking
      $("#body").css("pointer-events", "auto");

      const body = document.getElementById("body");
      const main = document.getElementById("main");
      const arrow = document.getElementById("home-arrow");
      
      body.style.animation = 'none';
      main.style.animation = 'none';
      arrow.style.animation = 'none';
      body.offsetHeight;
      main.offsetHeight;
      arrow.offsetHeight; 
      body.style.animation = 'body_to_tutorial 2s ease';
      main.style.animation = 'main_to_tutorial 2s ease';
      arrow.style.animation = 'arrow_to_tutorial 2s ease';

      const link = $(this).attr("href");

      setTimeout(function(){
        window.location.href = link;
      },1900);
   });
});
