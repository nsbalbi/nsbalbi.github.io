
setTimeout(function(){
  $("#body").css("pointer-events", "auto");
},1900);

$(function() {
  $("#home-button")
    .on("click", function(){

      // Disable clicking
      $("#body").css("pointer-events", "auto");

      const body = document.getElementById("body");
      const main = document.getElementById("main");
      
      body.style.animation = 'none';
      main.style.animation = 'none';
      body.offsetHeight;
      main.offsetHeight;
      body.style.animation = 'body_to_gallery 2s ease';
      main.style.animation = 'main_to_gallery 2s ease';

      setTimeout(function(){
        window.location.href = "../blog_home.html";
      },1900);
   });
});
