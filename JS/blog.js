
// Scroll to top arrow - via copeden from @rdallaire
$(window).scroll(function() {
  if ($(this).scrollTop() >= 50 && !window.matchMedia('(max-width: 1200px)').matches) {      
      $('#top-arrow').fadeIn(200);  
  } else {
      $('#top-arrow').fadeOut(200);  
  }
});

$('#top-arrow').click(function() {
  $('body,html').animate({
    scrollTop : 0
  }, 500);
});