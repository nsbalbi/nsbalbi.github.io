
setTimeout(function(){
  $("#body").css("pointer-events", "auto");
},1900);

$(function() {
  $("#code-square-container")
    .on("click", function(){
      $(this).addClass('square-animation-zoom');
      $(this).parent().css('z-index',99);
   })
  .on("animationend", function(){
    window.location.href = "https://github.com/nsbalbi";
    // $(this).removeClass('square-animation-zoom');
    // $(this).parent().css('z-index',0);
  });
});

$(function() {
  $("#art-square-container")
    .on("click", function(){
      $(this).addClass('square-animation-zoom');
      $(this).parent().css('z-index',99);
   })
  .on("animationend", function(){
    window.location.href = "https://twitter.com/nsbalbi";
    // $(this).removeClass('square-animation-zoom');
    // $(this).parent().css('z-index',0);
  });
});

$(function() {
  $("#science-square-container")
    .on("click", function(){
      $(this).addClass('square-animation-zoom');
      $(this).parent().css('z-index',99);
   })
  .on("animationend", function(){
    window.location.href = "https://scholar.google.com/citations?user=HSFykcoAAAAJ&hl=en&oi=sra";
    // $(this).removeClass('square-animation-zoom');
    // $(this).parent().css('z-index',0);
  });
});

$(function() {
  $("#about-square-container")
    .on("click", function(){
      // Disable clicking
      $("#body").css("pointer-events", "none");

      var about_square = document.getElementById("about-square");
      var science_square = document.getElementById("science-square");
      var art_square = document.getElementById("art-square");
      var code_square = document.getElementById("code-square");
      
      if($(window).width() < $(window).height()) {
        about_square.style.animation = 'none';
        about_square.offsetHeight; /* trigger reflow */
        about_square.style.animation = 'out_to_left 2s ease-in'; 
  
        setTimeout(function(){
          science_square.style.animation = 'none';
          science_square.offsetHeight; /* trigger reflow */
          science_square.style.animation = 'out_to_right 2s ease-in'; 
        },300);
  
        setTimeout(function(){
          art_square.style.animation = 'none';
          art_square.offsetHeight; /* trigger reflow */
          art_square.style.animation = 'out_to_left 2s ease-in'; 
        },600);
  
        setTimeout(function(){
          code_square.style.animation = 'none';
          code_square.offsetHeight; /* trigger reflow */
          code_square.style.animation = 'out_to_right 2s ease-in'; 
        },900);
        
      } else {
        about_square.style.animation = 'none';
        about_square.offsetHeight; /* trigger reflow */
        about_square.style.animation = 'out_to_top 2s ease-in'; 
  
        setTimeout(function(){
          science_square.style.animation = 'none';
          science_square.offsetHeight; /* trigger reflow */
          science_square.style.animation = 'out_to_bottom 2s ease-in'; 
        },300);
  
        setTimeout(function(){
          art_square.style.animation = 'none';
          art_square.offsetHeight; /* trigger reflow */
          art_square.style.animation = 'out_to_top 2s ease-in'; 
        },600);
  
        setTimeout(function(){
          code_square.style.animation = 'none';
          code_square.offsetHeight; /* trigger reflow */
          code_square.style.animation = 'out_to_bottom 2s ease-in'; 
        },900);
      }

      setTimeout(function(){
        window.location.href = "blog_home.html";
      },3000);
   })
});