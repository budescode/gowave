(function($) {
    "use strict";

    
        /* ==================================================
            #  Testimonials Carousel
         ===============================================*/
         $('#review-silder').owlCarousel({
            loop: false,
            margin: 30,
            nav: true,
            dots: true,
            autoplay:false,
            navText: [
                "<i class='fa fa-arrow-left'></i>",
                "<i class='fa fa-arrow-right'></i>"
            ],
            
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 2
                },
                1000: {
                    items: 2
                }
            }
        });


        /* ==================================================
            # Smooth Scroll
         ===============================================*/

        $("body").scrollspy({
            target: ".navbar-collapse",
            offset: 200
        });
        $('a.smooth-menu').on('click', function(event) {
            var $anchor = $(this);
            var headerH = '75';
            $('html, body').stop().animate({
                scrollTop: $($anchor.attr('href')).offset().top - headerH + "px"
            }, 1500, 'easeInOutExpo');
            event.preventDefault();
        });

})(jQuery); // End jQuery

{/* <div class="owl-carousel">
  <!-- Carousel items here -->
</div>

<button id="prevButton">Previous</button>
<button id="nextButton">Next</button> */}



$(document).ready(function() {
    var owl = $('.owl-carousel');
    
    owl.owlCarousel({
      // Owl Carousel options here
    });
    
    // Hide the previous button initially
    $('#prevButton').hide();
    
    // Event handler for next button
    $('#nextButton').click(function() {
      owl.trigger('next.owl.carousel');
      
      // Show the previous button
      $('#prevButton').show();
      
      // Hide the previous button if the last item is reached
      if (owl.find('.owl-item.active').last().hasClass('last')) {
        $(this).hide();
      }
    });
    
    // Event handler for previous button
    $('#prevButton').click(function() {
      owl.trigger('prev.owl.carousel');
      
      // Show the next button
      $('#nextButton').show();
      
      // Hide the previous button if the first item is reached
      if (owl.find('.owl-item.active').first().hasClass('first')) {
        $(this).hide();
      }
    });
    
    // Custom event listeners for the first and last item
    owl.on('initialized.owl.carousel', function(event) {
      if (event.item.index === 0) {
        $('#prevButton').hide();
      } else if (event.item.index === event.item.count - 1) {
        $('#nextButton').hide();
      }
    });
    
    owl.on('changed.owl.carousel', function(event) {
      if (event.item.index === 0) {
        $('#prevButton').hide();
      } else if (event.item.index === event.item.count - 1) {
        $('#nextButton').hide();
      }
    });
  });
  