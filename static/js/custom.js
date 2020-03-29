(function($) {
  $.fn.inputFilter = function(inputFilter) {
    return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function() {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      } else {
        this.value = "";
      }
    });
  };
}(jQuery));

$(document).ready(function () {
    /*============ MOBILE MENU ============*/
    /*$('.ui.sidebar').sidebar({
        context: $('.ui.pushable.segment'),
        transition: 'overlay'
    }).sidebar('attach events', '#mobile_item');*/

    $('#mobile_item').click(function () {
        $('#mobile_item .fas').toggleClass('fal fa-times');
        $('.mobile-menu-wrapper').toggleClass('active')
    });
    $('#mobile_item').click(function () {
        $('body').toggleClass('stop-scroll')
    })
    /*============= LOGIN PAGE POPUP =============*/
    $('.sign-up-popup').click(function () {
        $('.ui.modal.sign-up').modal('show');
    })
    $('.sign-in-popup').click(function () {
        $('.ui.modal.sign-in').modal('show');
    })


    $('.password-current .btn').click(function () {
        $('.ui.modal.password-popup').modal('show');
    })

    $('.forgot-password-for-profile a').click(function () {
        $('.ui.modal.forgot-password').modal('show');
    })

    $('.password-link-button a.btn.not-you').click(function () {
        $('.ui.modal.enter-your-mail').modal('show');
    })


    $('.Reset-Password-popup').click(function () {
        $('.ui.modal.Reset-Password').modal('show');
    })
    $('.create-post, .post-popup').click(function () {
        $('.ui.modal#createpost-popup').modal('show');
    })
    $('.mobile-footer ul li.add-icon a, .post-popup').click(function () {
        $('.ui.modal#createpost-popup').modal('show');
    })
    $('.pvr').click(function () {
        $(".am-prev").trigger("click");
    })
    $('.nxt').click(function () {
        $(".am-next").trigger("click");
    })
    $('.post-popup').click(function () {
        const tab_id = $(this).attr('id');
        $(".form-" + tab_id).trigger("click");
    })

    $('#profile-photo').click(function () {
        $('.ui.modal#profile-photo-popup').modal('show');
    })
    $('#cover-photo').click(function () {
        $('.ui.modal#cover-photo-popup').modal('show');
    })
    $('.profile-modal-cancel').click(function () {
        $('.ui.modal#profile-photo-popup').modal('hide');
    })
    $('.banner-modal-cancel').click(function () {
        $('.ui.modal#cover-photo-popup').modal('hide');
    });
    $('.cross-popup').click(function() {
        $(this).parent().modal('hide');
    });

    /*================ FOR DROPDOWN ==============*/
    $(function () {
        $('.ui.dropdown').dropdown();
        /*$('.ui.dropdown.selection, .ui.dropdown.profile-dropdown, .ui.dropdown.more-product-holder, .ui.dropdown.more-setting-holder').dropdown({
            on: 'hover'
        });*/
        $('.ui.dropdown.onclick').dropdown({
            on: 'click'
        });
        /*$('.upselect').click(function() {
            //alert();
            $('.upselect').toggleClass('upward');
        })*/

    });
    $('#verify-phone').on('click', function () {
        $('.phone-popup').modal('show');
    });

    /*=============== FOLLOW BUTTON   ================*/
    $('.unfollow').click(function () {
        $(this).text(function (_, text) {
            return text === "Follow" ? "Unfollow" : "Follow";
        });
    });

    /*================= LIKE UNLIKE============*/
    $('.active-like').click(function () {
        $(this).children('.fa-heart').toggleClass('fas');
    });
    /*================= Leave a comment ============*/
    $('.focus-comment').click(function () {
        $(this).parents('.each-single-post').find('textarea').focus();
    });
    /*=================== POST FORM START HERE ===============================*/
    $('.am-next').click(function () {
        $('.post-type .owl-carousel.owl-theme').removeClass('pull-left');
        $('.post-type .owl-carousel.owl-theme').addClass('pull-right');
    })
    $('.am-prev').click(function () {
        $('.post-type .owl-carousel.owl-theme').removeClass('pull-right');
        $('.post-type .owl-carousel.owl-theme').addClass('pull-left');
    })
    $(".tab_content").hide();
    $("#tab1").show();
    $(".post-type .owl-carousel.owl-theme .item:first-child .tab").addClass("active");
    $(".tab").click(function (event) {
        event.preventDefault();
        $(".tab").removeClass("active");
        $(".tab_content").hide();
        $(this).addClass("active");
        $("#" + $(this).attr("rel")).show();
    });
    const owl = $('.owl-carousel');
    owl.owlCarousel({
        margin: 0,
        nav: true,
        dots: false,
        loop: false,
        slideBy: 4,
        touchDrag: false,
        mouseDrag: false,
        navText: [$('.am-prev'), $('.am-next')],
        responsive: {
            0: {
                items: 3
            },
            600: {
                items: 3
            },
            1000: {
                items: 3
            }
        }

    });
    /*=======================================*/
    $('.multipleimage-upload input[type="file"]').imageuploadify();
    $('.ui.radio.checkbox')
        .checkbox();
    $('.ui.checkbox').checkbox();

    $('.price-range').click(function () {
        const open_fixedprice = $(this).parents('form').find('.open-fixedprice');
        const open_pricerange = $(this).parents('form').find('.open-pricerange');
        $(open_fixedprice).hide();
        $(open_pricerange).show();
    });
    $('.fixed-price').click(function () {
        const open_fixedprice = $(this).parents('form').find('.open-fixedprice');
        const open_pricerange = $(this).parents('form').find('.open-pricerange');
        $(open_pricerange).hide();
        $(open_fixedprice).show();
    });
    $('.add-time').click(function () {
        const start_date = $(this).parents('form').find('.start-date');
        const start_time = $(this).parents('form').find('.start-time');
        $(start_date).toggleClass('col-xs-6');
        $(start_time).toggleClass('start-time-show');
    });
    $(".more-link").click(function () {
        const optional_detais_box_wrapper = $(this).parents('form').find('.optional-detais-box-wrapper');
        $(optional_detais_box_wrapper).toggle();
        $(this).children('span').children('i').toggleClass('fa-sort-up');
    });

    $('.reply-text').click(function () {
        const open_replybox = $(this).parents('.reply-box').find('.review-reply-area');
        $(open_replybox).show();
    });

    $('.close_box').click(function () {
        const close_replybox = $(this).parents('.reply-box').find('.review-reply-area');
        $(close_replybox).hide();
    });

    $(".add-button").on('change', function () {
        const val = $(this).val();
        const add_link = ["call_now", "none", "book", "order_online", "buy", "learn_more", "sign_up"];
        const check_link = add_link.indexOf(val);
        if (check_link == 0) {//Call now
            $(this).parents('form').find(".link-your-button").show();
            $(this).parents('form').find(".link-your-button input").attr('placeholder', 'Phone number');
            $(this).parents('form').find(".link-your-button label").hide();
        } else if (check_link == 1) {//none
            $(this).parents('form').find(".link-your-button").hide();
        } else {
            $(this).parents('form').find(".link-your-button").show();
            $(this).parents('form').find(".link-your-button input").attr('placeholder', 'Link your button');
            $(this).parents('form').find(".link-your-button label").show();
        }
    });

    /*============= FORM VALIDATION ====================*/
    function check_validation(elements) {
        let error_free = true;
        for (let element in elements) {
            if (elements[element]) {
                const type = elements[element]['type'];
                const class_name = elements[element]['className'];
                const name = elements[element]['name'];
                const value = elements[element]['value'];
                var msg = 'This field id required';

                if (type) {
                    console.log('Type:' + type + ' name:' + name);
                    if (elements[element].classList.contains('validation')) {
                        if (type == 'textarea') {
                            var $element = $(type + '[name=' + name + ']');
                        } else {
                            var $element = $('input[name=' + name + ']');
                        }
                        $element.next('label.error').remove();
                        if (value == '') {
                            error_free = false;
                            elements[element].classList.add("invalid");

                            var msg = $element.attr('data-error');

                            $element.after('<label class="error error_show">' + msg + '</label>');
                        } else {
                            elements[element].classList.remove("invalid");
                        }
                    }
                }
            }
        }
        return error_free;
    }

    $("form.validate-form").each(function () {
        $(this).submit(function () {
            const elements = this.elements;
            const error_free = check_validation(elements);
            if (error_free == false)
                return false;
        });
    });
    $("form.validate-form .validation").blur(function () {
        const msg = $(this).attr('data-error');
        if ($(this).val() == '') {
            $(this).addClass('invalid');
            $(this).next('label.error').remove();
            $(this).after('<label class="error error_show">' + msg + '</label>');
        } else {
            $(this).removeClass('invalid');
            $(this).next('label.error').remove();
        }
    });
    /*================== DATE AND TIME PICKER=====================*/
    const event_date_timepicker_start = new FooPicker({
        id: 'event_date_timepicker_start',
        dateFormat: 'dd/MM/yyyy',
    });
    const event_date_timepicker_end = new FooPicker({
        id: 'event_date_timepicker_end',
        dateFormat: 'dd/MM/yyyy',
    });
    const offer_date_timepicker_start = new FooPicker({
        id: 'offer_date_timepicker_start',
        dateFormat: 'dd/MM/yyyy',
    });
    const offer_date_timepicker_end = new FooPicker({
        id: 'offer_date_timepicker_end',
        dateFormat: 'dd/MM/yyyy',
    });

    $('.time-timepicker').calendar({
        type: 'time'
    });
    $('.time-timepicker').click(function () {
        //alert();
        $(this).find('.popup').addClass('bottom left transition visible');
    });
    $('.column.minute .link').click(function () {
        alert();
        // $(this).find('.popup').addClass('bottom left transition visible');
    });
    /*============*/
    $('.username-input').keyup(function () {
        if ($('.username-input').val().length > 0) {
            $(this).addClass('active-text');
            $('.right-tick').addClass('tick-show');
        } else {
            $(this).removeClass('active-text');
            $('.right-tick').removeClass('tick-show');
        }
    });
    $(".social-button-area .btn").click(function () {
        $(this).toggleClass('deactive')
        $(this).text(function (i, text) {
            return text === "Connect" ? "Disconnect" : "Connect";
        })
    });
    /*------toggle flag------*/
    $(".bookmark-button a").click(function () {
        $(this).children('i').toggleClass('fas');
    });
    /*------scroll to div------*/
    //alert();
    $(window).scroll(function () {
        //alert();
        if ($(window).scrollTop() > 200) { // this refers to window
            $("#myBtn").css("display", "block");
        } else {
            $("#myBtn").css("display", "none");
        }
    });
    $("#myBtn").click(function (event) {
        //alert();
        $('html, body').animate({
            scrollTop: $("#myDiv").offset().top
        }, 1000);
    });

    /*------result page funtion------*/

    jQuery('#showall').click(function () {
        jQuery('.targetDiv').show();
        jQuery('.targetDiv.all-hide-div').hide();
    });
    jQuery('.showSingle').click(function () {
        jQuery('.targetDiv').hide();
        jQuery('.accordian-tab' + $(this).attr('target')).show();
    });

    jQuery('.showSingle').click(function () {
        const jobs = $(this).attr('data-attr');
        if (jobs == 'jobs') {
            jQuery('.price-renage-box').hide();
        } else {
            jQuery('.price-renage-box').show();
        }
    });

    $(".more a").click(function () {
        $(".service-category-listing").toggleClass("expan-div")
    });

    jQuery(".more a span").click(function () {
        jQuery(this).text(function (i, text) {
            return text === "See more" ? "See less" : "See more";
        });
        jQuery(this).parent().find('i').toggleClass("up")
    });

    $('.radio-select-feild .checkbox').each(function () {
        $(this).click(function () {
            const v = $(this).attr('data-attr');
            //alert(v)
            if (v == 'all') {
                $('.each-box-details').show();
            } else {
                $('.each-box-details').hide();
                $('.' + v).show();
            }

        });
    });

    $('.seller-others-heading-tab ul li a').click(function () {
        $('.seller-others-heading-tab ul li').removeClass('active')
        $(this).parent().addClass('active')

        const item_value = $(this).attr('data-attr');
        $('.sellers-items').removeClass('active');
        $('.' + item_value).addClass('active');
    });
    /*================ FOOTER FOR MOBILE==============*/
    if (jQuery(window).width() < 768) {
        let lastScrollTop = 0;
        const navbarHeight = jQuery('.mobile-footer').outerHeight();
        jQuery(window).scroll(function (event) {
            const st = jQuery(this).scrollTop();
            if (st > lastScrollTop && st > navbarHeight) {// Scroll Down
                jQuery('.mobile-footer').removeClass('nav-up').addClass('nav-down');
            } else {// Scroll Up
                if (st + jQuery(window).height() < jQuery(document).height()) {
                    jQuery('.mobile-footer').removeClass('nav-down').addClass('nav-up');
                }
            }
            if (st > 0) {
                jQuery('.mobile-footer').removeClass('hide-footer');
            } else {
                jQuery('.mobile-footer').addClass('hide-footer');
            }
            const scrollHeight = $(document).height();
            const scrollPosition = $(window).height() + $(window).scrollTop();
            console.log((scrollHeight - scrollPosition) / scrollHeight);
            if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
                jQuery('.mobile-footer').addClass('show-footer');
            } else {
                jQuery('.mobile-footer').removeClass('show-footer');
            }
            lastScrollTop = st;
        });
    }

    $('.mobile-search-box').click(function () {
        $(this).hide();
        //alert();
        $(".search-bar").removeClass('hidden-xs');
        $('body').addClass('body_overlay_bg');

    });
    $(document).on("click", function (event) {
        if ($(event.target).find('.inner-page-header.mobile-header').length > 0) {
            $(".search-bar").addClass('hidden-xs');
            $('.mobile-search-box').show();
            $('body').removeClass('body_overlay_bg');
        }
    });
})
/*============== SCROLL BAR=====================*/
$(window).on("load", function () {
    $(".comment-list").mCustomScrollbar();
    $('.result-short-dropdown').mCustomScrollbar();
    //$(".libary-content ul li img").addClass('imgpreview');
});

/*============== Reply box open=====================*/


/*============ IMAGE CIECLE==============*/
$(window).on("load resize", function (e) {
    // const imgs = $('.imgpreview');
    // imgs.each(function () {
    //     const img = $(this);
    //     const width = img.width();
    //     const height = img.height();
    //     if (width < height) {
    //         img.addClass('portrait');
    //     } else {
    //         img.addClass('landscape');
    //     }
    // });
    if ($(window).width() < 768) {
        //alert('Less than 960');
        $('.ui.modal.sign-in').modal('show');
        $('.site-header').addClass('mobile-header');
        $(".right-sidebar-buttons").insertBefore(".mobile-more-button-insert");
    } else {
        $('.site-header').removeClass('mobile-header');
        $(".right-sidebar-buttons").insertBefore(".desktop-more-area");

    }
});

/*=============== SCROLL TO DIV JQUERY=================*/

$(window).on("load", function () {
    if ($(window).width() < 767) {
        //alert();
        $(".content p").click(function () {
            $(this).parent(".content").find("a.item").trigger("click");
        });
    }
});