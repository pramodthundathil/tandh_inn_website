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
    
    //===== Smart Auto-Hiding Navbar on Scroll Down (Full View of Site)
    (function initSmartNavbar() {
        var $navbar = $('.header_navbar');
        if (!$navbar.length) return;

        var lastScrollTop = 0;
        var scrollDelta = 8;
        var topThreshold = 60;

        $(window).on('scroll', function() {
            var currentScroll = $(window).scrollTop();

            // When at or near the top of the page
            if (currentScroll <= topThreshold) {
                $navbar.removeClass('sticky nav-hidden').addClass('nav-visible');
                lastScrollTop = currentScroll;
                return;
            }

            // Require minimum scroll delta to prevent micro-jitter
            if (Math.abs(currentScroll - lastScrollTop) <= scrollDelta) {
                return;
            }

            // Don't auto-hide if mobile menu dropdown is open
            if ($('.navbar-collapse').hasClass('show')) {
                return;
            }

            if (currentScroll > lastScrollTop && currentScroll > topThreshold) {
                // User is scrolling DOWN -> Hide navbar for full site view
                $navbar.addClass('sticky nav-hidden').removeClass('nav-visible');
            } else if (currentScroll < lastScrollTop) {
                // User is scrolling UP -> Slide navbar back down smoothly
                $navbar.addClass('sticky nav-visible').removeClass('nav-hidden');
            }

            lastScrollTop = currentScroll;
        });
    })();
    
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
                $title.css({ opacity: 0, transform: 'translateY(12px)' });
                $subtitle.css({ opacity: 0, transform: 'translateY(12px)' });
                setTimeout(function() {
                    $title.text(captions[index].title).css({ opacity: 1, transform: 'translateY(0)' });
                }, 200);
                setTimeout(function() {
                    $subtitle.text(captions[index].subtitle).css({ opacity: 1, transform: 'translateY(0)' });
                }, 300);
            }
        }

        function nextSlide() {
            var nextIndex = (currentIndex + 1) % $slides.length;
            goToSlide(nextIndex);
        }

        slideInterval = setInterval(nextSlide, 5000);

        $dots.on('click', function() {
            clearInterval(slideInterval);
            var idx = $(this).data('index');
            goToSlide(idx);
            slideInterval = setInterval(nextSlide, 5000);
        });
    })();

    //===== Hero Banner Parallax & On-Scroll Animation
    (function initHeroScrollAnimation() {
        var $heroContainer = $('.hero_slider_container');
        var $heroSlides = $('.hero_slide');
        var $heroContent = $('.hero_content_wrapper');
        var $scrollCue = $('.hero_scroll_cue');
        if (!$heroContainer.length) return;

        var ticking = false;

        function updateOnScroll() {
            var scrollY = window.pageYOffset || document.documentElement.scrollTop;
            var heroHeight = $heroContainer.outerHeight();

            if (scrollY <= heroHeight) {
                // Parallax background drift
                var bgTranslateY = (scrollY * 0.32).toFixed(1);
                $heroSlides.css('transform', 'translate3d(0, ' + bgTranslateY + 'px, 0)');

                // Hero content smooth lift and gentle fade
                var contentTranslateY = -(scrollY * 0.16).toFixed(1);
                var opacity = Math.max(0, 1 - (scrollY / (heroHeight * 0.72))).toFixed(2);
                $heroContent.css({
                    'transform': 'translate3d(0, ' + contentTranslateY + 'px, 0)',
                    'opacity': opacity
                });

                // Fade out scroll cue as soon as user begins scrolling
                if (scrollY > 40) {
                    $scrollCue.addClass('is_scrolled');
                } else {
                    $scrollCue.removeClass('is_scrolled');
                }
            }
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(updateOnScroll);
                ticking = true;
            }
        }, { passive: true });
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

    //===== Lightbox Modal Gallery & Category Filter
    (function initLightbox() {
        var $modal = $('#gallery_lightbox');
        var $modalImg = $('#lightbox_img');
        var galleryImages = [];
        var currentIndex = 0;

        function refreshGalleryImages() {
            galleryImages = [];
            $('.gallery_bento_item:visible, [data-lightbox]:visible').each(function() {
                var src = $(this).data('src') || $(this).find('img').attr('src') || $(this).attr('src');
                if (src && galleryImages.indexOf(src) === -1) {
                    galleryImages.push(src);
                }
            });
        }

        function openLightbox(src) {
            refreshGalleryImages();
            if (!galleryImages.length) return;
            var idx = galleryImages.indexOf(src);
            currentIndex = idx >= 0 ? idx : 0;
            $modalImg.attr('src', galleryImages[currentIndex]);
            $modal.addClass('is-open');
        }

        $(document).on('click', '.gallery_bento_item, [data-lightbox]', function(e) {
            e.preventDefault();
            var src = $(this).data('src') || $(this).find('img').attr('src') || $(this).attr('src');
            if (src) {
                openLightbox(src);
            }
        });

        $('.lightbox_close, #gallery_lightbox').on('click', function(e) {
            if (e.target === this || $(e.target).hasClass('lightbox_close')) {
                $modal.removeClass('is-open');
            }
        });

        $('.lightbox_nav.prev').on('click', function(e) {
            e.stopPropagation();
            if (!galleryImages.length) return;
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            $modalImg.attr('src', galleryImages[currentIndex]);
        });

        $('.lightbox_nav.next').on('click', function(e) {
            e.stopPropagation();
            if (!galleryImages.length) return;
            currentIndex = (currentIndex + 1) % galleryImages.length;
            $modalImg.attr('src', galleryImages[currentIndex]);
        });

        $(document).on('keydown', function(e) {
            if (!$modal.hasClass('is-open')) return;
            if (e.key === 'Escape') $modal.removeClass('is-open');
            if (e.key === 'ArrowLeft') $('.lightbox_nav.prev').click();
            if (e.key === 'ArrowRight') $('.lightbox_nav.next').click();
        });

        // Gallery Filter Buttons
        $(document).on('click', '.gallery_filter_btn', function() {
            $('.gallery_filter_btn').removeClass('active');
            $(this).addClass('active');
            var filter = $(this).data('filter');
            if (filter === 'all') {
                $('.gallery_bento_grid .gallery_bento_item').show();
            } else {
                $('.gallery_bento_grid .gallery_bento_item').hide();
                $('.gallery_bento_grid .gallery_bento_item[data-category="' + filter + '"]').show();
            }
            refreshGalleryImages();
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

    //===== Nearby Attractions Full-Width Auto-Scroll Carousel (3-second interval)
    (function initNearbyScroll() {
        var $track = $('#nearby_cards_track');
        var $prev = $('#nearby_prev_btn');
        var $next = $('#nearby_next_btn');
        if (!$track.length) return;

        var el = $track[0];
        var autoScrollTimer = null;
        var isPaused = false;

        function getCardStep() {
            var $firstCard = $track.find('.nearby_card').first();
            return $firstCard.length ? ($firstCard.outerWidth() + 24) : 340;
        }

        function scrollNext() {
            var maxScroll = el.scrollWidth - el.clientWidth;
            var step = getCardStep();
            if (el.scrollLeft + step >= maxScroll - 15) {
                // Smooth loop back to the start
                el.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                el.scrollBy({ left: step, behavior: 'smooth' });
            }
        }

        function scrollPrev() {
            var step = getCardStep();
            if (el.scrollLeft - step <= 15) {
                var maxScroll = el.scrollWidth - el.clientWidth;
                el.scrollTo({ left: maxScroll, behavior: 'smooth' });
            } else {
                el.scrollBy({ left: -step, behavior: 'smooth' });
            }
        }

        function startAutoScroll() {
            stopAutoScroll();
            autoScrollTimer = setInterval(function() {
                if (!isPaused) {
                    scrollNext();
                }
            }, 3000);
        }

        function stopAutoScroll() {
            if (autoScrollTimer) {
                clearInterval(autoScrollTimer);
                autoScrollTimer = null;
            }
        }

        // Manual Navigation Buttons
        $next.on('click', function() {
            scrollNext();
            startAutoScroll();
        });

        $prev.on('click', function() {
            scrollPrev();
            startAutoScroll();
        });

        // Pause on mouse hover or touch interaction
        $track.on('mouseenter touchstart', function() {
            isPaused = true;
        }).on('mouseleave touchend', function() {
            isPaused = false;
        });

        $('.nearby_carousel_nav').on('mouseenter', function() {
            isPaused = true;
        }).on('mouseleave', function() {
            isPaused = false;
        });

        // Start 3-second auto-scroll
        startAutoScroll();
    })();

    //===== Luxury Facilities Category Filter
    $('#facilities_filter_nav .facility_filter_btn').on('click', function() {
        var $btn = $(this);
        var filter = $btn.data('filter');

        $btn.addClass('active').siblings().removeClass('active');

        var $cards = $('#facilities_grid .facility_card');
        if (filter === 'all') {
            $cards.removeClass('is_hidden').addClass('animate_in');
        } else {
            $cards.each(function() {
                var $card = $(this);
                if ($card.data('category') === filter) {
                    $card.removeClass('is_hidden').addClass('animate_in');
                } else {
                    $card.addClass('is_hidden').removeClass('animate_in');
                }
            });
        }
    });

});

