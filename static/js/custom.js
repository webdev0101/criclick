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
    $('.profile-modal-cancil').click(function () {
        $('.ui.modal#profile-photo-popup').modal('hide');
    })
    $('.banner-modal-cancil').click(function () {
        $('.ui.modal#cover-photo-popup').modal('hide');
    })
    /*======== SIGN IN FORM VALIDATION ==========*/
    $('#login_username').on('input', function () {
        const input = $(this);
        const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const is_email = re.test(input.val());
        if (is_email) {
            input.removeClass("invalid").addClass("valid");
        } else {
            input.removeClass("valid").addClass("invalid");
            let error_element = $("#login_error-message");
            error_element.html('You have entered an invalid email address, please try again. ');
        }
    });


    $('#login_password').on('input', function () {
        const input = $(this);
        const is_name = input.val();
        if (is_name) {
            input.removeClass("invalid").addClass("valid");
        } else {
            input.removeClass("valid").addClass("invalid");
        }
    });

    function loginFormSubmit(event) {
        const form_data = $("#login-form").serializeArray();
        let error_free = true;
        for (let input in form_data) {
            const element = $("#login_" + form_data[input]['name']);
            const valid = element.hasClass("valid");
            if (!valid) {
                error_free = false;
            } else {
            }
        }
        if (!error_free) {
            let error_element = $("#login_error-message");
            if (!error_free) {
                error_element.removeClass("error").addClass("error_show");
            } else {
                error_element.removeClass("error_show").addClass("error");
            }
            event.preventDefault();
        } else {
            //alert('No errors: Form will be submitted');
            $.ajax({
                type: 'POST',
                url: '/accounts/login/',
                data: $('#login-form').serialize(),
                success: function (response) {
                    window.location.href = '/home/';
                },
                error: function (xhr, status, error) {
                    let error_element = $("#login_error-message");
                    let responseJson = xhr.responseJSON;
                    for (key in responseJson) {
                        error_element.html(responseJson[key])
                    }
                    error_element.removeClass("error").addClass("error_show");
                }
            });
        }
    }

    $('#login-form input').unbind("keydown").bind('keydown', function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            loginFormSubmit(e);
            return false;
        }
    });

    //<!-- After Form Submitted Validation-->
    $("#login-submit").click(loginFormSubmit);
    /*======== SIGN UP FORM VALIDATION ==========*/
    $('#signup_email').on('input', function () {
        const input = $(this);
        const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const is_email = re.test(input.val());
        if (is_email) {
            input.removeClass("invalid").addClass("valid");
        } else {
            let error_element = $("#signup_error-message");
            error_element.html('Please use a valid email address.');
            input.removeClass("valid").addClass("invalid");
        }
    });

    $('#signup_first_name').on('input', function () {
        const input = $(this);
        const is_name = input.val();
        if (is_name) {
            input.removeClass("invalid").addClass("valid");
        } else {
            input.removeClass("valid").addClass("invalid");
        }
    });

    $('#signup_last_name').on('input', function () {
        const input = $(this);
        const is_name = input.val();
        if (is_name) {
            input.removeClass("invalid").addClass("valid");
        } else {
            input.removeClass("valid").addClass("invalid");
        }
    });


    $('#signup_password1').on('input', function () {
        const input = $(this);
        const is_name = input.val();
        const input_email = $('#signup_email').val();
        let error_element = $("#signup_error-message");
        if (is_name.length < 8) {
            error_element.html('Password must be at least 8 characters long.');
            input.removeClass("valid").addClass("invalid");
        } else {
            if (is_name === input_email) {
                error_element.html('Password should not be the same as the email address.');
                input.removeClass("valid").addClass("invalid");
            } else {
                error_element.html('');
                input.removeClass("invalid").addClass("valid");
            }
        }
    });

    $('#signup_password2').on('input', function () {
        const input = $(this);
        const is_name = input.val();
        if (is_name) {
            input.removeClass("invalid").addClass("valid");
        } else {
            input.removeClass("valid").addClass("invalid");
        }
    });

    function signupFormSubmit(event) {
        const form_data = $("#signup-form").serializeArray();
        let error_free = true;
        for (let input in form_data) {
            const element = $("#signup_" + form_data[input]['name']);
            const valid = element.hasClass("valid");
            if (!valid) {
                error_free = false;
            } else {
            }
        }
        if (!error_free) {
            var error_element = $("#signup_error-message");
            if (!error_free) {
                error_element.removeClass("error").addClass("error_show");
            } else {
                error_element.html('');
                error_element.removeClass("error_show").addClass("error");
            }
            event.preventDefault();
        } else {
            $.ajax({
                type: 'POST',
                url: '/accounts/register/',
                data: $('#signup-form').serialize(),
                success: function (response) {
                    window.location.href = '/accounts/profile/';
                },
                error: function (xhr, status, error) {
                    let responseJson = xhr.responseJSON;
                    let error_element = $("#signup_error-message");
                    for (key in responseJson) {
                        error_element.html(responseJson[key])
                    }
                    error_element.removeClass("error").addClass("error_show");
                }
            });
        }
    }

    //<!-- After Form Submitted Validation-->
    $('#signup-form input').unbind("keydown").bind('keydown', function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            signupFormSubmit(e);
            return false;
        }
    });
    $("#signup-submit").click(signupFormSubmit);
    /*======== SIGN RESET_PASSWORD FORM VALIDATION ==========*/
    $('#reset_password_email').on('input', function () {
        const input = $(this);
        const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const is_email = re.test(input.val());
        let error_element = $('#reset_password_error_message');
        if (is_email) {
            error_element.html('');
            input.removeClass("invalid").addClass("valid");
        } else {
            error_element.html('Please use a valid email address.\n');
            input.removeClass("valid").addClass("invalid");
        }
    });

    function resetPasswordFormSubmit(event) {
        const form_data = $("#reset_password_form").serializeArray();
        let error_free = true;
        for (let input in form_data) {
            const element = $("#reset_password_" + form_data[input]['name']);
            const valid = element.hasClass("valid");
            if (!valid) {
                error_free = false;
            } else {
            }
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
            $.ajax({
                type: 'POST',
                url: '/accounts/password/reset/',
                data: $('#reset_password_form').serialize(),
                success: function (response) {
                    let error_element = $("#reset_password_error_message");
                    error_element.html(response.message);
                    error_element.css('color', '#0c77bf !important');
                    error_element.removeClass("error").addClass("error_show");
                },
                error: function (xhr, status, error) {
                    let responseJson = xhr.responseJSON;
                    let error_element = $("#reset_password_error_message");
                    for (key in responseJson) {
                        error_element.html(responseJson[key])
                    }
                    error_element.css('color', '#e24242 !important');
                    error_element.removeClass("error").addClass("error_show");
                }
            });
        }
    }

    $('#reset_password_form input').unbind("keydown").bind('keydown', function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            resetPasswordFormSubmit(e);
            return false;
        }
    });

    //<!-- After Form Submitted Validation-->
    $("#reset_password_submit").click(resetPasswordFormSubmit);
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

    /*======== VALIDATE ACCOUNT FORM VALIDATION ==========*/
    function limitText(field, maxChar) {
        const ref = $(field),
            val = ref.val();
        if (val.length >= maxChar) {
            ref.val(function () {
                return val.substr(0, maxChar);
            });
        }
    }

    $("#verified_code").inputFilter(function(value) {
        return /^\d*$/.test(value);    // Allow digits only, using a RegExp
    });

    $('#verified_code').on({
        keyup: function () {
            limitText(this, 6)
        },
        keydown: function () {
            limitText(this, 6)
        }
    });

    $('#verified_code').on('input', function () {
        const input = $(this);
        const is_name = input.val();
        if (is_name) {
            input.removeClass("invalid").addClass("valid");
        } else {
            input.removeClass("valid").addClass("invalid");
        }
    });

    function verifyCodeFormSubmit(event) {
        const form_data = $("#validate-form").serializeArray();
        let error_free = true;
        for (let input in form_data) {
            const element = $("#verified_" + form_data[input]['name']);
            const valid = element.hasClass("valid");
            if (!valid) {
                error_free = false;
            } else {
            }
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
            $.ajax({
                type: 'POST',
                url: '/accounts/email/verify/',
                data: $('#validate-form').serialize(),
                success: function (response) {
                    window.location.href = '/accounts/profile/';
                },
                error: function (xhr, status, error) {
                    let responseJson = xhr.responseJSON;
                    console.log(responseJson);
                    let error_element = $("#login_error-message");
                    for (key in responseJson) {
                        error_element.html(responseJson[key])
                    }
                    error_element.removeClass("error").addClass("error_show");
                }
            });
        }
    }

    $('#validate-form input').unbind("keydown").bind('keydown', function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            verifyCodeFormSubmit(e);
            return false;
        }
    });

    //<!-- After Form Submitted Validation-->
    $("#validate").click(verifyCodeFormSubmit);

    $('#resend-code').click(function () {
        let form = $('#resend-form');
        $.ajax({
            type: 'POST',
            url: '/accounts/email/resend/',
            data: form.serialize(),
            success: function () {
                $('#resend-message').show()
            },
            error: function (xhr, statusCode, error) {
                $('#resend-message').hide()
            }
        })
    });

    // New Password Form
    $('#password_new_password1').on('input', function () {
        const input = $(this);
        const is_name = input.val();
        if (is_name) {
            var error_element = $("#password_error-message");
            error_element.html('');
            input.removeClass("invalid").addClass("valid");
        } else {
            input.removeClass("valid").addClass("invalid");
        }
    });

    $('#password_new_password2').on('input', function () {
        const input = $(this);
        const is_name = input.val();
        if (is_name) {
            var error_element = $("#password_error-message");
            error_element.html('');
            input.removeClass("invalid").addClass("valid");
        } else {
            input.removeClass("valid").addClass("invalid");
        }
    });

    function passwordFormSubmit(event) {
        const form_data = $("#password-form").serializeArray();
        let error_free = true;
        for (let input in form_data) {
            const element = $("#password_" + form_data[input]['name']);
            const valid = element.hasClass("valid");
            if (!valid) {
                error_free = false;
            } else {
            }
        }
        if (!error_free) {
            var error_element = $("#password_error-message");
            if (!error_free) {
                error_element.removeClass("error").addClass("error_show");
            } else {
                error_element.removeClass("error_show").addClass("error");
            }
            event.preventDefault();
        } else {
            $.ajax({
                type: 'POST',
                url: '',
                data: $('#password-form').serialize(),
                success: function (response) {
                    window.location.href = '/';
                },
                error: function (xhr, status, error) {
                    let responseJson = xhr.responseJSON;
                    let error_element = $("#password_error-message");
                    for (key in responseJson) {
                        error_element.html(responseJson[key])
                    }
                    error_element.removeClass("error").addClass("error_show");
                }
            });
        }
    }

    $('#password-form input').unbind("keydown").bind('keydown', function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            passwordFormSubmit(e);
            return false;
        }
    });

    $("#submit-password").click(passwordFormSubmit);
    /*====================== Library ================*/
    $('.upload-photo').click(function () {
        $(this).parent('.cover-photo-tab').find('.upload-photo, .library-photo').removeClass('active');
        $(this).addClass('active');
        $(this).parents('form').find('.libary-content').hide();
        $(this).parents('form').find('.upload-photo-content').show();
        $('.pop-up-buttons-for-cover').show();
    });
    $('.library-photo').click(function () {
        $(this).parent('.cover-photo-tab').find('.upload-photo, .library-photo').removeClass('active');
        $(this).addClass('active');
        $(this).parents('form').find('.upload-photo-content').hide();
        $(this).parents('form').find('.libary-content').show();
        $('.pop-up-buttons-for-cover').hide();

    });
    const folder = "/assets/images/upload/";
    $.ajax({
        url: folder,
        success: function (data) {
            $(data).find("a").attr("href", function (i, val) {
                if (val.match(/\.(jpe?g|png|gif)$/)) {
                    $(".libary-content ul.library-image").append("<li><img src='" + folder + val + "' class='imgpreview'></li>");
                }
            });
        },
        complete: function (data) {
            $(".libary-content ul.library-image li img").click(function () {
                $('.upload-photo').click();
                const submit_btn = $(this).parents('.form').find('.profile-photo-submit');
                const photo_list = $(this).parents('.form').find('.files-holder');
                const files = $(this).parents('.form').find('.files');
                photo_list.hide();
                photo_list.next('.pip').find(".profile-overlay").show();
                photo_list.next('.pip').show();
                photo_list.next('.pip').css("background-image", "url(" + $(this).attr("src") + ")");
                console.log($(this).attr("src"));

                photo_list.next('.pip').find(".profile-overlay").show();
                photo_list.next('.pip').show();
                photo_list.next('.pip').css("background-image", "url(" + $(this).attr("src") + ")");
                photo_list.next('.pip').next(".remove").click(function () {
                    $(this).prev(".pip").css("background-image", "none");
                    $(this).prev(".pip").hide();
                    photo_list.show();
                    submit_btn.prop("disabled", true);
                    submit_btn.addClass('disabled');
                    $(this).hide();
                });
                const eleml = photo_list.next('.pip').find(".myProgress");
                eleml.show();
                let i = 0;
                if (i == 0) {
                    i = 1;
                    const elem = photo_list.next('.pip').find(".myBar");
                    let width = 1;
                    const id = setInterval(frame, 10);

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

    /*
    Change password in setting page start
     */
    $('#change-password-form input').unbind('keydown').bind('keydown', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            changePasswordFormSubmit(event);
            return false;
        }
    });

    function changePasswordFormSubmit(event) {
        let form = $('#change-password-form');
        $.ajax({
            type: 'POST',
            url: '/accounts/password/change/',
            data: form.serialize(),
            success: function (response) {
                $("#change-password-form :input").each(function(){
                    if ($(this).attr('name') !== 'csrfmiddlewaretoken') {
                        $(this).val('');
                        $(this).removeClass('invalid').addClass('valid');
                    }
                });
                $('.ui.modal.password-popup').modal('hide');
            },
            error: function (xhr, statusCode, error) {
                let messages = xhr.responseJSON;
                $("#change-password-form :input").each(function(){
                    $(this).removeClass('invalid').addClass('valid');
                });
                // let error_container = $('#change-password-errors');
                // error_container.html('');
                // error_container.hide();
                for (x in messages) {
                    $("#change-password-form input[name="+ x +"]").removeClass('valid').addClass('invalid');
                    // error_container.append('<p>' + messages[x] + '</p>');
                    // error_container.show();
                }
            }
        })
    }
    $('#change-password-submit').click(changePasswordFormSubmit);

    /*
    Send password link
     */
    $('#send-password-link').click(function () {
        $.ajax({
            type: 'GET',
            url: '/accounts/password/reset/',
            success: function (response) {
                $('#send-link-error').html(response.message);
            },
            error: function (xhr, status, error) {
                let responseJson = xhr.responseJSON;
                // let error_element = $("#reset_password_error_message");
                for (key in responseJson) {
                    // error_element.html(responseJson[key])
                }
            }
        });
    });

    /*====================== IMAGE UPLOAD ================*/
    if (window.File && window.FileList && window.FileReader) {
        $(".files").on("change", function (e) {
            const submit_btn = $(this).parents('.form').find('.profile-photo-submit');
            submit_btn.prop("disabled", true);
            submit_btn.addClass('disabled');
            const photo_list = $(this).parent('.files-holder');
            const files = e.target.files,
                filesLength = files.length;
            //for (var i = 0; i > filesLength; i++) {
            const f = files[0];
            const fileReader = new FileReader();
            fileReader.onload = (function (e) {
                photo_list.hide();
                const file = e.target;
                photo_list.next('.pip').find(".profile-overlay").show();
                photo_list.next('.pip').show();
                photo_list.next('.pip').css("background-image", "url(" + e.target.result + ")");
                photo_list.next('.pip').next(".remove").click(function () {
                    $(this).prev(".pip").css("background-image", "none");
                    $(this).prev(".pip").hide();
                    photo_list.show();
                    submit_btn.prop("disabled", true);
                    submit_btn.addClass('disabled');
                    $(this).hide();
                });
                const eleml = photo_list.next('.pip').find(".myProgress");
                eleml.show();
                let i = 0;
                if (i == 0) {
                    i = 1;
                    const elem = photo_list.next('.pip').find(".myBar");
                    let width = 1;
                    const id = setInterval(frame, 10);

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

    /*
    Save account settings
     */
    function submitSettingForm(event) {
        let form = $('#setting-form');
        $.ajax({
            type: 'POST',
            url: '/accounts/settings/',
            data: form.serialize(),
            success: function (response) {
                $("#setting-form :input").each(function(){
                    $(this).removeClass('invalid').addClass('valid');
                    let error_element = $('#username-error');
                    error_element.html('');
                    error_element.hide();
                });
                if (response.phone_verified === 'false') {
                    $('.phone-popup').modal('show');
                    $('#resend-code').show();
                }
            },
            error: function (xhr, statusCode, error) {
                let messages = xhr.responseJSON;
                $("#setting-form :input").each(function(){
                    $(this).removeClass('invalid').addClass('valid');
                });
                for (x in messages) {
                    $("#setting-form input[name="+ x +"]").removeClass('valid').addClass('invalid');
                    if (x === 'username') {
                        let error_element = $('#username-error');
                        error_element.html(messages[x]);
                        error_element.show();
                    }
                }
            }
        })
    }

    $('#setting-form input').unbind('keydown').bind('keydown', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            submitSettingForm(event);
            return false;
        }
    });
    $('#save-account-setting').click(submitSettingForm);

    /*
    Phone verify
     */
    function submitVerifyCode(event) {
        let form = $('#phone-verify-form');
        $.ajax({
            type: 'POST',
            url: '/accounts/phone/verify/',
            data: form.serialize(),
            success: function (response) {
                $("#phone-verify-form :input").each(function(){
                    $(this).removeClass('invalid').addClass('valid');
                });
                $('.phone-popup').modal('hide');
                $('#resend-code').hide();
                $('#phone-verified').show();
            },
            error: function (xhr, statusCode, error) {
                let messages = xhr.responseJSON;
                $("#phone-verify-form :input").each(function(){
                    $(this).removeClass('invalid').addClass('valid');
                });
                for (x in messages) {
                    $("#phone-verify-form input[name="+ x +"]").removeClass('valid').addClass('invalid');
                }
            }
        })
    }
    $('#phone-verify-form input').unbind('keydown').bind('keydown', function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            submitVerifyCode(event);
            return false;
        }
    });
    $('#submit-phone-verify').click(submitVerifyCode);

    $('#resend-code').click(function () {
        $.ajax({
            type: 'GET',
            url: '/accounts/phone/resend/',
            success: function (response) {
                $('.phone-popup').modal('show');
            },
            error: function (xhr, statusCode, error) {

            }
        })
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
        const add_link = ["Call now", "Publish", "Book", "Order online", "Buy", "Learn more", "Sign up"];
        const check_link = add_link.indexOf(val);
        if (check_link == 0) {//Call now
            $(this).parents('form').find(".link-your-button").hide();
            $(this).parents('form').find(".call_now").show();
        } else if (check_link == 1) {//Publish
            $(this).parents('form').find(".call_now").hide();
            $(this).parents('form').find(".link-your-button").hide();
        } else {
            $(this).parents('form').find(".call_now").hide();
            $(this).parents('form').find(".link-your-button").show();
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
    const imgs = $('.imgpreview');
    imgs.each(function () {
        const img = $(this);
        const width = img.width();
        const height = img.height();
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