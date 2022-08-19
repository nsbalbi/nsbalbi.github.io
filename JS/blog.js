
// Scroll to top arrow - via copeden from @rdallaire
$(window).scroll(function() {
  if ($(this).scrollTop() >= 50) {      
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