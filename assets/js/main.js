$(function() {
    
    "use strict";
    
    //===== Preloader
    function hidePreloader() {
        if ($('.preloader').length) {
            $('.preloader').fadeOut(400);
        }
    }

    if (document.readyState === 'complete') {
        hidePreloader();
    } else {
        $(window).on('load', hidePreloader);
        // Safety timeout to ensure preloader never hangs indefinitely
        setTimeout(hidePreloader, 800);
    }
    
    //===== Sticky

    $(window).on('scroll', function (event) {
        var scroll = $(window).scrollTop();
        if (scroll < 20) {
            $(".header_navbar").removeClass("sticky");
            $(".header_navbar img").attr("src", "assets/images/logo.png");
        } else {
            $(".header_navbar").addClass("sticky");
            $(".header_navbar img").attr("src", "assets/images/logo.png");
        }
    });
    
    //===== Section Menu Active

    var scrollLink = $('.page-scroll');
    // Active link switching
    $(window).scroll(function () {
        var scrollbarLocation = $(this).scrollTop();

        scrollLink.each(function () {
            var sectionOffset = $(this.hash).offset().top - 73;

            if (sectionOffset <= scrollbarLocation) {
                $(this).parent().addClass('active');
                $(this).parent().siblings().removeClass('active');
            }
        });
    });
    
    //===== close navbar-collapse when a clicked

    $(".navbar-nav a").on('click', function () {
        $(".navbar-collapse").removeClass("show");
    });

    $(".navbar-toggler").on('click', function () {
        $(this).toggleClass("active");
    });

    $(".navbar-nav a").on('click', function () {
        $(".navbar-toggler").removeClass('active');
    });
    
    //===== Counter Up
    if ($.fn.counterUp && $('.counter').length) {
        $('.counter').counterUp({
            delay: 10,
            time: 3000
        });
    }
    
    //===== Back to top
    
    // Show or hide the sticky footer button
    $(window).on('scroll', function(event) {
        if($(this).scrollTop() > 600){
            $('.back-to-top').fadeIn(200)
        } else{
            $('.back-to-top').fadeOut(200)
        }
    });
    
    //Animate the scroll to top
    $('.back-to-top').on('click', function(event) {
        event.preventDefault();
        
        $('html, body').animate({
            scrollTop: 0,
        }, 1500);
    });
    
    //===== Nice Select
    if ($.fn.niceSelect && $('select').length) {
        $('select').niceSelect();
    }
    
    //===== WOW active
    if (typeof WOW !== 'undefined') {
        var wow = new WOW({
            boxClass: 'wow',
            mobile: false,
        });
        wow.init();
    }

    //===== Hero Slider Auto-rotation
    (function initHeroSlider() {
        var $slides = $('.hero_slide');
        var $dots = $('.hero_slider_dot');
        var $title = $('#hero_title');
        var $subtitle = $('#hero_subtitle');
        if ($slides.length === 0) return;

        var captions = [
            { title: "A Homely Base in Edappally", subtitle: "Comfortable Diamond, Gold, and Silver rooms for families, couples, and groups in Ernakulam." },
            { title: "Comfortable Stays in Ernakulam", subtitle: "Equipped with air conditioning, 24/7 hot water, free car parking, and high-speed Wi-Fi." },
            { title: "Premium Diamond Rooms", subtitle: "2 Bedrooms with spacious living area, kitchen, refrigerator, swing & open balcony." },
            { title: "Cozy & Relaxing Ambiance", subtitle: "Gold & Silver rooms designed with comfort, modern amenities, and a peaceful stay." },
            { title: "Explore Kochi with Ease", subtitle: "Close to Marine Drive, Lulu Mall, High Court, and Ernakulam Town Railway Station." }
        ];

        var currentIndex = 0;
        var slideInterval;

        function goToSlide(index) {
            currentIndex = index;
            $slides.removeClass('is-active').eq(index).addClass('is-active');
            $dots.removeClass('is-active').eq(index).addClass('is-active');
            
            if (captions[index] && $title.length) {
                $title.fadeOut(300, function() {
                    $(this).text(captions[index].title).fadeIn(300);
                });
                $subtitle.fadeOut(300, function() {
                    $(this).text(captions[index].subtitle).fadeIn(300);
                });
            }
        }

        function nextSlide() {
            var nextIndex = (currentIndex + 1) % $slides.length;
            goToSlide(nextIndex);
        }

        slideInterval = setInterval(nextSlide, 4500);

        $dots.on('click', function() {
            clearInterval(slideInterval);
            var idx = $(this).data('index');
            goToSlide(idx);
            slideInterval = setInterval(nextSlide, 4500);
        });
    })();

    //===== Date Inputs & Booking Widget
    (function initBookingWidget() {
        var $checkin = $('#booking_checkin');
        var $checkout = $('#booking_checkout');
        if (!$checkin.length || !$checkout.length) return;

        var today = new Date();
        var tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        var dayAfter = new Date(today);
        dayAfter.setDate(dayAfter.getDate() + 2);

        function formatDate(d) {
            return d.toISOString().split('T')[0];
        }

        $checkin.attr('min', formatDate(today));
        $checkout.attr('min', formatDate(tomorrow));

        if (!$checkin.val()) $checkin.val(formatDate(tomorrow));
        if (!$checkout.val()) $checkout.val(formatDate(dayAfter));

        $checkin.on('change', function() {
            var inDate = new Date($(this).val());
            if (isNaN(inDate.getTime())) return;
            var minOut = new Date(inDate);
            minOut.setDate(minOut.getDate() + 1);
            $checkout.attr('min', formatDate(minOut));
            if (new Date($checkout.val()) <= inDate) {
                $checkout.val(formatDate(minOut));
            }
        });

        // Stepper Buttons
        $('.stepper_btn').on('click', function() {
            var action = $(this).data('action');
            var targetId = $(this).data('target');
            var $input = $('#' + targetId);
            var $valueSpan = $(this).siblings('.stepper_value');
            var currentVal = parseInt($input.val() || '0', 10);
            var min = parseInt($input.attr('min') || '0', 10);
            var max = parseInt($input.attr('max') || '10', 10);

            if (action === 'plus' && currentVal < max) {
                currentVal++;
            } else if (action === 'minus' && currentVal > min) {
                currentVal--;
            }

            $input.val(currentVal);
            $valueSpan.text(currentVal);
        });

        // Form Submit Redirect to Booking
        $('#booking_form').on('submit', function(e) {
            e.preventDefault();
            var cin = $checkin.val();
            var cout = $checkout.val();
            var adults = $('#booking_adults').val();
            var children = $('#booking_children').val();
            var roomType = $('#booking_room_type').val() || '';

            var targetUrl = "https://www.zotel.ai/hotels/t-hin?start_date=" + cin + "&end_date=" + cout + "&num_adults=" + adults + "&num_children=" + children;
            if (roomType) {
                targetUrl += "&room=" + encodeURIComponent(roomType);
            }
            window.open(targetUrl, '_blank');
        });
    })();

    //===== Lightbox Modal Gallery
    (function initLightbox() {
        var $modal = $('#gallery_lightbox');
        var $modalImg = $('#lightbox_img');
        var galleryImages = [];
        var currentIndex = 0;

        $('.gallery_bento_item, [data-lightbox]').each(function(idx) {
            var src = $(this).data('src') || $(this).find('img').attr('src');
            if (src) {
                galleryImages.push(src);
                $(this).data('gallery-index', idx);
            }
        });

        function openLightbox(index) {
            if (index < 0 || index >= galleryImages.length) return;
            currentIndex = index;
            $modalImg.attr('src', galleryImages[currentIndex]);
            $modal.addClass('is-open');
        }

        $(document).on('click', '.gallery_bento_item, [data-lightbox]', function() {
            var idx = $(this).data('gallery-index');
            if (idx !== undefined) {
                openLightbox(idx);
            }
        });

        $('.lightbox_close, #gallery_lightbox').on('click', function(e) {
            if (e.target === this || $(e.target).hasClass('lightbox_close')) {
                $modal.removeClass('is-open');
            }
        });

        $('.lightbox_nav.prev').on('click', function(e) {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            $modalImg.attr('src', galleryImages[currentIndex]);
        });

        $('.lightbox_nav.next').on('click', function(e) {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % galleryImages.length;
            $modalImg.attr('src', galleryImages[currentIndex]);
        });

        $(document).on('keydown', function(e) {
            if (!$modal.hasClass('is-open')) return;
            if (e.key === 'Escape') $modal.removeClass('is-open');
            if (e.key === 'ArrowLeft') $('.lightbox_nav.prev').click();
            if (e.key === 'ArrowRight') $('.lightbox_nav.next').click();
        });
    })();

    //===== FAQ Accordion
    $('.faq_question').on('click', function() {
        var $answer = $(this).next('.faq_answer');
        var $icon = $(this).find('.faq_icon');
        
        $('.faq_answer').not($answer).slideUp(250);
        $('.faq_icon').not($icon).text('+');

        $answer.slideToggle(250);
        if ($icon.text() === '+') {
            $icon.text('−');
        } else {
            $icon.text('+');
        }
    });

    //===== Formspree Contact Form Handler
    $('#contact-form').on('submit', function(e) {
        e.preventDefault();
        var $form = $(this);
        var $btn = $form.find('button[type="submit"]');
        var $alert = $('#contact-alert');
        var origBtnHtml = $btn.html();

        $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin mr-2"></i> Sending...');

        fetch('https://formspree.io/f/xrpgjowe', {
            method: 'POST',
            body: new FormData($form[0]),
            headers: {
                'Accept': 'application/json'
            }
        }).then(function(response) {
            $btn.prop('disabled', false).html(origBtnHtml);
            if (response.ok) {
                $form[0].reset();
                if ($alert.length) {
                    $alert.removeClass('d-none alert-danger').addClass('alert-success').html('<i class="fas fa-check-circle mr-2"></i> Thank you! Your message has been sent successfully.');
                } else {
                    alert('Thank you! Your message has been sent successfully.');
                }
            } else {
                if ($alert.length) {
                    $alert.removeClass('d-none alert-success').addClass('alert-danger').html('<i class="fas fa-exclamation-triangle mr-2"></i> Oops! There was a problem submitting your message. Please try again.');
                } else {
                    alert('Oops! There was a problem submitting your message.');
                }
            }
        }).catch(function(err) {
            $btn.prop('disabled', false).html(origBtnHtml);
            if ($alert.length) {
                $alert.removeClass('d-none alert-success').addClass('alert-danger').html('<i class="fas fa-exclamation-triangle mr-2"></i> Network error. Please check your connection or contact us via WhatsApp.');
            } else {
                alert('Network error. Please try again or contact us via WhatsApp.');
            }
        });
    });

});
