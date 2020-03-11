$(document).ready(function() {
    /*============ MOBILE MENU ============*/
    /*$('.ui.sidebar').sidebar({
        context: $('.ui.pushable.segment'),
        transition: 'overlay'
    }).sidebar('attach events', '#mobile_item');*/

	$('#mobile_item').click(function() {
		$('#mobile_item .fas').toggleClass('fal fa-times');
		$('.mobile-menu-wrapper').toggleClass('active')
	});
	$('#mobile_item').click(function(){
		$('body').toggleClass('stop-scroll')
	})
    /*============= LOGIN PAGE POPUP =============*/
    $('.sign-up-popup').click(function() {
        $('.ui.modal.sign-up').modal('show');
    })
    $('.sign-in-popup').click(function() {
        $('.ui.modal.sign-in').modal('show');
    })


	$('.password-current .btn').click(function() {
        $('.ui.modal.password-popup').modal('show');
    })

	$('.forgot-password-for-profile a').click(function() {
        $('.ui.modal.forgot-password').modal('show');
    })

	$('.password-link-button a.btn.not-you').click(function() {
        $('.ui.modal.enter-your-mail').modal('show');
    })

	


    $('.Reset-Password-popup').click(function() {
        $('.ui.modal.Reset-Password').modal('show');
    })
    $('.create-post, .post-popup').click(function() {
        $('.ui.modal#createpost-popup').modal('show');
    })
	$('.mobile-footer ul li.add-icon a, .post-popup').click(function() {
        $('.ui.modal#createpost-popup').modal('show');
    })
    $('.pvr').click(function() {
        $(".am-prev").trigger("click");
    })
    $('.nxt').click(function() {
        $(".am-next").trigger("click");
    })
    $('.post-popup').click(function() {
        var tab_id = $(this).attr('id');
        $(".form-" + tab_id).trigger("click");
    })

    $('#profile-photo').click(function() {
        $('.ui.modal#profile-photo-popup').modal('show');
    })
    $('#cover-photo').click(function() {
        $('.ui.modal#cover-photo-popup').modal('show');
    })
	$('.profile-modal-cancil').click(function() {
        $('.ui.modal#profile-photo-popup').modal('hide');
    })
	$('.banner-modal-cancil').click(function() {
        $('.ui.modal#cover-photo-popup').modal('hide');
    })
    /*======== SIGN IN FORM VALIDATION ==========*/
    $('#login_email').on('input', function() {
        var input = $(this);
        var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        var is_email = re.test(input.val());
        if (is_email) {
            input.removeClass("invalid").addClass("valid");
        } else {
            input.removeClass("valid").addClass("invalid");
        }
    });


    $('#login_password').on('input', function() {
        var input = $(this);
        var is_name = input.val();
        if (is_name) {
            input.removeClass("invalid").addClass("valid");
        } else {
            input.removeClass("valid").addClass("invalid");
        }
    });

    //<!-- After Form Submitted Validation-->
    $("#login-submit").click(function(event) {
        var form_data = $("#login-form").serializeArray();
        var error_free = true;
        for (var input in form_data) {
            var element = $("#login_" + form_data[input]['name']);
            var valid = element.hasClass("valid");
            if (!valid) {
                error_free = false;
            } else {}
        }
        if (!error_free) {
            var error_element = $("#login_error-message");
            if (!error_free) {
                error_element.removeClass("error").addClass("error_show");
            } else {
                error_element.removeClass("error_show").addClass("error");
            }
            event.preventDefault();
        } else {
            //alert('No errors: Form will be submitted');
        }
    });
    /*======== SIGN UP FORM VALIDATION ==========*/
    $('#signup_email').on('input', function() {
        var input = $(this);
        var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        var is_email = re.test(input.val());
        if (is_email) {
            input.removeClass("invalid").addClass("valid");
        } else {
            input.removeClass("valid").addClass("invalid");
        }
    });


    $('#signup_password').on('input', function() {
        var input = $(this);
        var is_name = input.val();
        if (is_name) {
            input.removeClass("invalid").addClass("valid");
        } else {
            input.removeClass("valid").addClass("invalid");
        }
    });

    //<!-- After Form Submitted Validation-->
    $("#signup-submit").click(function(event) {
        var form_data = $("#signup-form").serializeArray();
        var error_free = true;
        for (var input in form_data) {
            var element = $("#signup_" + form_data[input]['name']);
            var valid = element.hasClass("valid");
            if (!valid) {
                error_free = false;
            } else {}
        }
        if (!error_free) {
            var error_element = $("#signup_error-message");
            if (!error_free) {
                error_element.removeClass("error").addClass("error_show");
            } else {
                error_element.removeClass("error_show").addClass("error");
            }
            event.preventDefault();
        } else {
            //alert('No errors: Form will be submitted');
        }
    });
    /*======== SIGN RESET_PASSWORD FORM VALIDATION ==========*/
    $('#reset_password_email').on('input', function() {
        var input = $(this);
        var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        var is_email = re.test(input.val());
        if (is_email) {
            input.removeClass("invalid").addClass("valid");
        } else {
            input.removeClass("valid").addClass("invalid");
        }
    });

    //<!-- After Form Submitted Validation-->
    $("#reset_password_submit").click(function(event) {
        var form_data = $("#reset_password_form").serializeArray();
        var error_free = true;
        for (var input in form_data) {
            var element = $("#reset_password_" + form_data[input]['name']);
            var valid = element.hasClass("valid");
            if (!valid) {
                error_free = false;
            } else {}
        }
        if (!error_free) {
            var error_element = $("#reset_password_error_message");
            if (!error_free) {
                error_element.removeClass("error").addClass("error_show");
            } else {
                error_element.removeClass("error_show").addClass("error");
            }
            event.preventDefault();
        } else {
            //alert('No errors: Form will be submitted');
        }
    });
    /*================ FOR DROPDOWN ==============*/
    $(function() {
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
    
	/*======== VALIDATE ACCOUNT FORM VALIDATION ==========*/
    $('#verified_code').on('input', function() {
        var input = $(this);
        var is_name = input.val();
        if (is_name) {
            input.removeClass("invalid").addClass("valid");
        } else {
            input.removeClass("valid").addClass("invalid");
        }
    });

    //<!-- After Form Submitted Validation-->
    $("#validate").click(function(event) {
        var form_data = $("#validate-form").serializeArray();
        var error_free = true;
        for (var input in form_data) {
            var element = $("#verified_" + form_data[input]['name']);
            var valid = element.hasClass("valid");
            if (!valid) {
                error_free = false;
            } else {}
        }
        if (!error_free) {
            var error_element = $("#login_error-message");
            if (!error_free) {
                error_element.removeClass("error").addClass("error_show");
            } else {
                error_element.removeClass("error_show").addClass("error");
            }
            event.preventDefault();
        } else {
            //alert('No errors: Form will be submitted');
        }
    });
	/*====================== Library ================*/
	$('.upload-photo').click(function(){
		$(this).parent('.cover-photo-tab').find('.upload-photo, .library-photo').removeClass('active');
		$(this).addClass('active');
		$(this).parents('form').find('.libary-content').hide();
		$(this).parents('form').find('.upload-photo-content').show();
		$('.pop-up-buttons-for-cover').show();
	});
	$('.library-photo').click(function(){
		$(this).parent('.cover-photo-tab').find('.upload-photo, .library-photo').removeClass('active');
		$(this).addClass('active');
		$(this).parents('form').find('.upload-photo-content').hide();
		$(this).parents('form').find('.libary-content').show();
		$('.pop-up-buttons-for-cover').hide();

	});
	var folder = "assets/images/upload/";
	$.ajax({
		url : folder,
		success: function (data) {
			$(data).find("a").attr("href", function (i, val) {
				if( val.match(/\.(jpe?g|png|gif)$/) ) { 
					$(".libary-content ul.library-image").append( "<li><img src='"+ folder + val +"' class='imgpreview'></li>" );
				} 
			});
		},
		complete: function(data) {
			$(".libary-content ul.library-image li img").click(function() {
				$('.upload-photo').click();
				var submit_btn =  $(this).parents('.form').find('.profile-photo-submit');
				var photo_list =  $(this).parents('.form').find('.files-holder');
				var files =  $(this).parents('.form').find('.files');
				photo_list.hide();
				photo_list.next('.pip').find(".profile-overlay").show();
				photo_list.next('.pip').show();
				photo_list.next('.pip').css("background-image", "url(" + $(this).attr("src") + ")");
				console.log($(this).attr("src"));

				photo_list.next('.pip').find(".profile-overlay").show();
					photo_list.next('.pip').show();
					photo_list.next('.pip').css("background-image", "url(" + $(this).attr("src") + ")");
                    photo_list.next('.pip').next(".remove").click(function() {
                        $(this).prev(".pip").css("background-image", "none");
						$(this).prev(".pip").hide();
						photo_list.show();
						submit_btn.prop("disabled", true);
						submit_btn.addClass('disabled');
						$(this).hide();
                    });
					var eleml = photo_list.next('.pip').find(".myProgress");
					eleml.show();
					var i = 0;
					  if (i == 0) {
						i = 1;
						var elem = photo_list.next('.pip').find(".myBar");
						var width = 1;
						var id = setInterval(frame, 10);
						function frame() {
						  if (width >= 100) {
							photo_list.next('.pip').next(".remove").show();
							photo_list.next('.pip').find(".profile-overlay").hide();
							submit_btn.prop("disabled", false);
							submit_btn.removeClass('disabled');
							eleml.hide();
							clearInterval(id);
							i = 0;
						  } else {
							width++;
							//elem.style.width = width + "%";
							elem.css("width", width + "%");
						  }
						}
					  }

			});
		}
	});
    
    /*====================== IMAGE UPLOAD ================*/
    if (window.File && window.FileList && window.FileReader) {
        $(".files").on("change", function(e) {
			var submit_btn =  $(this).parents('.form').find('.profile-photo-submit');
			submit_btn.prop("disabled", true);
			submit_btn.addClass('disabled');
            var photo_list = $(this).parent('.files-holder');
            var files = e.target.files,
            filesLength = files.length;
            //for (var i = 0; i > filesLength; i++) {
                var f = files[0];
                var fileReader = new FileReader();
                fileReader.onload = (function(e) {
					photo_list.hide();
                    var file = e.target;
					photo_list.next('.pip').find(".profile-overlay").show();
					photo_list.next('.pip').show();
					photo_list.next('.pip').css("background-image", "url(" + e.target.result + ")");
                    photo_list.next('.pip').next(".remove").click(function() {
                        $(this).prev(".pip").css("background-image", "none");
						$(this).prev(".pip").hide();
						photo_list.show();
						submit_btn.prop("disabled", true);
						submit_btn.addClass('disabled');
						$(this).hide();
                    });
					var eleml = photo_list.next('.pip').find(".myProgress");
					eleml.show();
					var i = 0;
					  if (i == 0) {
						i = 1;
						var elem = photo_list.next('.pip').find(".myBar");
						var width = 1;
						var id = setInterval(frame, 10);
						function frame() {
						  if (width >= 100) {
							photo_list.next('.pip').next(".remove").show();
							photo_list.next('.pip').find(".profile-overlay").hide();
							submit_btn.prop("disabled", false);
							submit_btn.removeClass('disabled');
							eleml.hide();
							clearInterval(id);
							i = 0;
						  } else {
							width++;
							//elem.style.width = width + "%";
							elem.css("width", width + "%");
						  }
						}
					  }

                });
                fileReader.readAsDataURL(f);
            //}
        });
    } else {
        alert("Your browser doesn't support to File API")
    }
    /*=============== FOLLOW BUTTON   ================*/
    $('.unfollow').click(function() {
        $(this).text(function(_, text) {
            return text === "Follow" ? "Unfollow" : "Follow";
        });       
    });

    /*================= LIKE UNLIKE============*/
    $('.active-like').click(function() {
        $(this).children('.fa-heart').toggleClass('fas');
    });
    /*================= Leave a comment ============*/
    $('.focus-comment').click(function() {
        $(this).parents('.each-single-post').find('textarea').focus();
    });
    /*=================== POST FORM START HERE ===============================*/
    $('.am-next').click(function() {
        $('.post-type .owl-carousel.owl-theme').removeClass('pull-left');
        $('.post-type .owl-carousel.owl-theme').addClass('pull-right');
    })
    $('.am-prev').click(function() {
        $('.post-type .owl-carousel.owl-theme').removeClass('pull-right');
        $('.post-type .owl-carousel.owl-theme').addClass('pull-left');
    })
    $(".tab_content").hide();
    $("#tab1").show();
    $(".post-type .owl-carousel.owl-theme .item:first-child .tab").addClass("active");
    $(".tab").click(function(event) {
        event.preventDefault();
        $(".tab").removeClass("active");
        $(".tab_content").hide();
        $(this).addClass("active");
        $("#" + $(this).attr("rel")).show();
    });   
	var owl = $('.owl-carousel');
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
				items: 4
			},
			600: {
				items: 4
			},
			1000: {
				items: 4
			}
		}

	})
    /*=======================================*/
    $('.multipleimage-upload input[type="file"]').imageuploadify();
    $('.ui.radio.checkbox')
        .checkbox();
    $('.ui.checkbox').checkbox();

    $('.price-range').click(function() {
		var open_fixedprice = $(this).parents('form').find('.open-fixedprice');
		var open_pricerange = $(this).parents('form').find('.open-pricerange');
        $(open_fixedprice).hide();
        $(open_pricerange).show();
    });
    $('.fixed-price').click(function() {
		var open_fixedprice = $(this).parents('form').find('.open-fixedprice');
		var open_pricerange = $(this).parents('form').find('.open-pricerange');
        $(open_pricerange).hide();
        $(open_fixedprice).show();
    });
    $('.add-time').click(function() {
        var start_date = $(this).parents('form').find('.start-date');
        var start_time = $(this).parents('form').find('.start-time');
        $(start_date).toggleClass('col-xs-6');
        $(start_time).toggleClass('start-time-show');
    });
    $(".more-link").click(function() {
		var optional_detais_box_wrapper = $(this).parents('form').find('.optional-detais-box-wrapper');
        $(optional_detais_box_wrapper).toggle();
        $(this).children('span').children('i').toggleClass('fa-sort-up');
    });

	$('.reply-text').click(function() {
		var open_replybox = $(this).parents('.reply-box').find('.review-reply-area');
        $(open_replybox).show();
    });

	$('.close_box').click(function() {
		var close_replybox = $(this).parents('.reply-box').find('.review-reply-area');
        $(close_replybox).hide();
    });

    $(".add-button").on('change', function() {
        var val = $(this).val(); 
		var add_link = [ "Call now", "Publish", "Book", "Order online", "Buy", "Learn more", "Sign up"];
		var check_link = add_link.indexOf(val);			
		if(check_link == 0){//Call now
			$(this).parents('form').find(".link-your-button").hide();
			$(this).parents('form').find(".call_now").show();            
        } else if(check_link == 1){//Publish
            $(this).parents('form').find(".call_now").hide();
            $(this).parents('form').find(".link-your-button").hide();
        }else{
			$(this).parents('form').find(".call_now").hide();
            $(this).parents('form').find(".link-your-button").show();
		}
    });
    
    /*============= FORM VALIDATION ====================*/
    function check_validation(elements) {
        var error_free = true;
        for (var element in elements) {
            if (elements[element]) {
                var type = elements[element]['type'];
                var class_name = elements[element]['className'];
                var name = elements[element]['name'];
                var value = elements[element]['value'];
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
    $("form.validate-form").each(function() {
        $(this).submit(function() {
            var elements = this.elements;
            var error_free = check_validation(elements);
            if (error_free == false)
                return false;
        });
    });
    $("form.validate-form .validation").blur(function() {
        var msg = $(this).attr('data-error')
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
    var event_date_timepicker_start = new FooPicker({
      id: 'event_date_timepicker_start',
      dateFormat: 'dd/MM/yyyy',      
    });
	var event_date_timepicker_end = new FooPicker({
      id: 'event_date_timepicker_end',
      dateFormat: 'dd/MM/yyyy',      
    });
	var offer_date_timepicker_start = new FooPicker({
      id: 'offer_date_timepicker_start',
      dateFormat: 'dd/MM/yyyy',      
    });
	var offer_date_timepicker_end = new FooPicker({
      id: 'offer_date_timepicker_end',
      dateFormat: 'dd/MM/yyyy',      
    });
	  
	  $('.time-timepicker').calendar({
		  type: 'time'
	 }); 
	 $('.time-timepicker').click(function(){
		 //alert();
		  $(this).find('.popup').addClass('bottom left transition visible');
	 });
	 $('.column.minute .link').click(function(){
		 alert();
		 // $(this).find('.popup').addClass('bottom left transition visible');
	 });
	/*============*/
	$('.username-input').keyup(function () {
        if ($('.username-input').val().length > 0) {
            $(this).addClass('active-text');
			$('.right-tick').addClass('tick-show');
        }else {
			$(this).removeClass('active-text');
			$('.right-tick').removeClass('tick-show');
		}
    });
	$(".social-button-area .btn").click(function () {
		$(this).toggleClass('deactive')
		$(this).text(function(i, text){
			return text === "Connect" ? "Disconnect" : "Connect";
		})
	});
	/*------toggle flag------*/
	$(".bookmark-button a").click(function() {
		$(this).children('i').toggleClass('fas');
	});	
	/*------scroll to div------*/
	//alert();
	$(window).scroll(function() {
		//alert();
		if ($(window).scrollTop() > 200) { // this refers to window
			$("#myBtn").css("display", "block");
		}
		else{
			$("#myBtn").css("display", "none");
		}
	});
	$("#myBtn").click(function(event) {
		//alert();
		$('html, body').animate({
			scrollTop: $("#myDiv").offset().top
		}, 1000);
	});

	/*------result page funtion------*/

	jQuery('#showall').click(function() {
		jQuery('.targetDiv').show();
		jQuery('.targetDiv.all-hide-div').hide();
	});
	jQuery('.showSingle').click(function() {
		jQuery('.targetDiv').hide();
		jQuery('.accordian-tab' + $(this).attr('target')).show();
	});

	jQuery('.showSingle').click(function() {
		var jobs = $(this).attr('data-attr');
		if(jobs == 'jobs'){	
			jQuery('.price-renage-box').hide();
		}else{
			jQuery('.price-renage-box').show();
		}		
	});

	$(".more a").click(function(){
		$(".service-category-listing").toggleClass("expan-div")
	});

    jQuery(".more a span").click(function () {
		jQuery(this).text(function(i, text){
			return text === "See more" ? "See less" : "See more";
		});
		jQuery(this).parent().find('i').toggleClass("up")
    });

	$('.radio-select-feild .checkbox').each(function() {
        $(this).click(function (){
			var v = $(this).attr('data-attr')
			//alert(v)
			if(v == 'all'){
				$('.each-box-details').show();
			}
			else{
				$('.each-box-details').hide();
				$('.'+v).show();
			}
            
        });
    });

	$('.seller-others-heading-tab ul li a').click(function(){
		$('.seller-others-heading-tab ul li').removeClass( 'active' )
		$(this).parent().addClass('active') 
		
		var item_value = $(this).attr('data-attr')
		$('.sellers-items').removeClass('active');
		$('.'+item_value).addClass('active');
	});
	/*================ FOOTER FOR MOBILE==============*/
	if(jQuery(window).width()<768){		
		var lastScrollTop = 0;
		var navbarHeight = jQuery('.mobile-footer').outerHeight();
		jQuery(window).scroll(function(event){
			var st = jQuery(this).scrollTop();
			if (st > lastScrollTop && st > navbarHeight){// Scroll Down
				jQuery('.mobile-footer').removeClass('nav-up').addClass('nav-down');
			} else {// Scroll Up
				if(st + jQuery(window).height() < jQuery(document).height()) {
					jQuery('.mobile-footer').removeClass('nav-down').addClass('nav-up');
				}
			}
			if (st > 0) {
				jQuery('.mobile-footer').removeClass('hide-footer');
			} else {
				jQuery('.mobile-footer').addClass('hide-footer');
			}
			var scrollHeight = $(document).height();
			var scrollPosition = $(window).height() + $(window).scrollTop();
			console.log((scrollHeight - scrollPosition) / scrollHeight);
			if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
				jQuery('.mobile-footer').addClass('show-footer');
			}else{
				jQuery('.mobile-footer').removeClass('show-footer');
			}
			lastScrollTop = st;
		});		
	}

	$('.mobile-search-box').click(function(){
		$(this).hide();
		//alert();
		$(".search-bar").removeClass('hidden-xs');
		$('body').addClass('body_overlay_bg');
		
	});
	$(document).on("click", function(event) {   
		if($(event.target).find('.inner-page-header.mobile-header').length>0){
			$(".search-bar").addClass('hidden-xs');
			$('.mobile-search-box').show();
			$('body').removeClass('body_overlay_bg');
		}
	});
})
/*============== SCROLL BAR=====================*/
$(window).on("load", function() {
    $(".comment-list").mCustomScrollbar();
	$('.result-short-dropdown').mCustomScrollbar();
	//$(".libary-content ul li img").addClass('imgpreview');
});

/*============== Reply box open=====================*/


/*============ IMAGE CIECLE==============*/
$(window).on("load resize",function(e){
    var imgs = $('.imgpreview');
    imgs.each(function() {
        var img = $(this);
        var width = img.width();
        var height = img.height();
        if (width < height) {
            img.addClass('portrait');
        } else {
            img.addClass('landscape');
        }
    });
	if ($(window).width() < 768) {
		   //alert('Less than 960');
		    $('.ui.modal.sign-in').modal('show');
			$('.site-header').addClass('mobile-header');
			$(".right-sidebar-buttons").insertBefore(".mobile-more-button-insert");
		}
	else {
	   $('.site-header').removeClass('mobile-header');
	   $(".right-sidebar-buttons").insertBefore(".desktop-more-area");

	}
});

/*=============== SCROLL TO DIV JQUERY=================*/

$(window).on("load", function(){
	if($(window).width() < 767)	{
		//alert();
		$(".content p").click(function(){
			$(this).parent(".content").find("a.item").trigger("click");
		});
	}
});