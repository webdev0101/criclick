$(document).ready(function () {
    $('#login_username').on('input', function () {
        const input = $(this);
        const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const is_email = re.test(input.val());
        if (is_email) {
            input.removeClass("invalid").addClass("valid");
        } else {
            input.removeClass("valid").addClass("invalid");
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
                error_element.html('Please use a valid email address.');
                error_element.removeClass("error").addClass("error_show");
            } else {
                error_element.html('');
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
                    let messages = xhr.responseJSON;
                    for (key in messages) {
                        error_element.html(messages[key])
                    }
                    error_element.removeClass("error").addClass("error_show");
                    $("#login-form :input").each(function () {
                        $(this).removeClass('invalid').addClass('valid');
                    });
                    for (x in messages) {
                        $("#login-form input[name=" + x + "]").removeClass('valid').addClass('invalid');
                    }
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

    $("#login-submit").click(loginFormSubmit);

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

    $("#reset_password_submit").click(resetPasswordFormSubmit);

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

    $('.show-password-icon').on('click', function () {
        if ($(this).find('i').hasClass('fa-eye')) {
            $(this).find('i').removeClass('fa-eye').addClass('fa-eye-slash');
            $(this).prev().attr('type', 'text');
        } else if ($(this).find('i').hasClass('fa-eye-slash')) {
            $(this).find('i').removeClass('fa-eye-slash').addClass('fa-eye');
            $(this).prev().attr('type', 'password');
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
                    error_element.css('margin-bottom', '12px');
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

    function limitText(field, maxChar) {
        const ref = $(field),
            val = ref.val();
        if (val.length >= maxChar) {
            ref.val(function () {
                return val.substr(0, maxChar);
            });
        }
    }

    $("#verified_code").inputFilter(function (value) {
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
                    window.location.href = '/home/';
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
                $("#change-password-form :input").each(function () {
                    if ($(this).attr('name') !== 'csrfmiddlewaretoken') {
                        $(this).val('');
                        $(this).removeClass('invalid').addClass('valid');
                    }
                });
                $('.ui.modal.password-popup').modal('hide');
            },
            error: function (xhr, statusCode, error) {
                let messages = xhr.responseJSON;
                $("#change-password-form :input").each(function () {
                    $(this).removeClass('invalid').addClass('valid');
                });
                // let error_container = $('#change-password-errors');
                // error_container.html('');
                // error_container.hide();
                for (x in messages) {
                    $("#change-password-form input[name=" + x + "]").removeClass('valid').addClass('invalid');
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

    /*
    Save account settings
     */
    $('#setting-form input[name=username]').on('input', function () {
        $.ajax({
            type: 'GET',
            url: '/accounts/check-username/',
            data: {
                username: $(this).val()
            },
            success: function (response) {
                let error_element = $('#username-error');
                error_element.html('Available');
                error_element.css('color', '#6fc694');
                error_element.show();
                $('#setting-form input[name=username]').removeClass('invalid').addClass('valid');
            },
            error: function (xhr, status, error) {
                let res = xhr.responseJSON;
                let error_element = $('#username-error');
                error_element.html(res.message);
                error_element.css('color', '#ff0000');
                error_element.show();
                $('#setting-form input[name=username]').removeClass('valid').addClass('invalid');
                $('.right-tick').removeClass('tick-show');
            }
        });
    });

    function submitSettingForm(event) {
        let form = $('#setting-form');
        $.ajax({
            type: 'POST',
            url: '/accounts/settings/',
            data: form.serialize(),
            success: function (response) {
                $("#setting-form :input").each(function () {
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
                $("#setting-form :input").each(function () {
                    $(this).removeClass('invalid').addClass('valid');
                });
                for (x in messages) {
                    $("#setting-form input[name=" + x + "]").removeClass('valid').addClass('invalid');
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
                $("#phone-verify-form :input").each(function () {
                    $(this).removeClass('invalid').addClass('valid');
                });
                $('.phone-popup').modal('hide');
                $('#resend-code').hide();
                $('#phone-verified').show();
                window.location.reload();
            },
            error: function (xhr, statusCode, error) {
                let messages = xhr.responseJSON;
                $("#phone-verify-form :input").each(function () {
                    $(this).removeClass('invalid').addClass('valid');
                });
                for (x in messages) {
                    $("#phone-verify-form input[name=" + x + "]").removeClass('valid').addClass('invalid');
                }
            }
        })
    }

    $('#phone-verify-form input').unbind('keydown').bind('keydown', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            submitVerifyCode(event);
            return false;
        }
    });
    $('#submit-phone-verify').click(submitVerifyCode);

    $('#resend-sms-code').click(function () {
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

    let uploadCrop;
    if (window.File && window.FileList && window.FileReader) {
        let avatarRemoveButton = $('.profile-photo-wrapper .remove');
        let bannerRemoveButton = $('.cover-photo-wrapper .remove');
        let avatarFilesHolder = $('.profile-photo-wrapper .files-holder');
        let bannerFilesHolder = $('.cover-photo-wrapper .files-holder');
        let avatarUploadButton = $('#profile-photo-popup .profile-photo-submit');
        let bannerUploadButton = $('.cover-photo-wrapper .profile-photo-submit');
        let xhrObject, xhrObject2;
        avatarUploadButton.prop('disabled', true);
        avatarUploadButton.addClass('disabled');
        bannerUploadButton.prop('disabled', true);
        bannerUploadButton.addClass('disabled');

        function readAvatarFile(input) {
            if (input.files && input.files[0]) {
                let format = input.files[0].type.split("/")[1];
                let reader = new FileReader();
                avatarFilesHolder.hide();
                avatarRemoveButton.show();
                reader.onload = function (e) {
                    uploadCrop.croppie('bind', {
                        url: e.target.result
                    }).then(function () {
                        console.log('jQuery bind complete');
                    });
                    avatarUploadButton.prop('disabled', false);
                    avatarUploadButton.removeClass('disabled');
                };

                reader.readAsDataURL(input.files[0]);

                avatarUploadButton.on('click', function () {
                    uploadCrop.croppie('result', {
                        type: 'blob',
                        size: 'original',
                        format: format
                    }).then(function (response) {
                        $('.profile-photo-wrapper .ko-progress-circle').removeClass('display-none');
                        let formData = new FormData();
                        formData.append('file', response);
                        xhrObject2 = $.ajax({
                            type: 'POST',
                            data: formData,
                            processData: false,
                            contentType: false,
                            url: "/accounts/settings/upload/avatar/",
                            beforeSend: function (xhr, settings) {
                                function getCookie(name) {
                                    let cookieValue = null;
                                    if (document.cookie && document.cookie != '') {
                                        let cookies = document.cookie.split(';');
                                        for (let i = 0; i < cookies.length; i++) {
                                            let cookie = jQuery.trim(cookies[i]);
                                            // Does this cookie string begin with the name we want?
                                            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                                                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                                break;
                                            }
                                        }
                                    }
                                    return cookieValue;
                                }

                                xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                            },
                            xhr: function () {
                                let xhr = new window.XMLHttpRequest();
                                xhr.upload.addEventListener('progress', function (evt) {
                                    if (evt.lengthComputable) {
                                        let percentComplete = evt.loaded / evt.total * 100;
                                        console.log(percentComplete);
                                        $('.profile-photo-wrapper .ko-progress-circle').attr('data-progress', Math.floor(percentComplete));
                                    }
                                }, false);
                                xhr.addEventListener('progress', function (evt) {
                                    if (evt.lengthComputable) {
                                        let percentComplete = evt.loaded / evt.total;

                                    }
                                }, false);
                                return xhr;
                            },
                            success: function (data) {
                                window.location.reload();
                            }
                        });
                    });
                });
            }
        }

        function readBannerFile(input) {
            if (input.files && input.files[0]) {
                let reader = new FileReader();
                let format = input.files[0].type.split("/")[1];
                bannerFilesHolder.hide();
                bannerRemoveButton.show();
                reader.onload = function (e) {
                    $uploadCrop2.croppie('bind', {
                        url: e.target.result
                    }).then(function () {
                        console.log('jQuery bind complete');
                    });
                    bannerUploadButton.prop('disabled', false);
                    bannerUploadButton.removeClass('disabled');
                };

                reader.readAsDataURL(input.files[0]);

                bannerUploadButton.on('click', function () {
                    let pointsData = $uploadCrop2.croppie('get');
                    console.log(pointsData);
                    let formData = new FormData();
                    formData.append('file', input.files[0]);
                    formData.append('points', pointsData.points);
                    formData.append('zoom', pointsData.zoom);
                    $('.cover-photo-wrapper .ko-progress-circle').removeClass('display-none');
                    xhrObject = $.ajax({
                        type: 'POST',
                        data: formData,
                        processData: false,
                        contentType: false,
                        url: "/accounts/settings/upload/banner/",
                        beforeSend: function (xhr, settings) {
                            function getCookie(name) {
                                let cookieValue = null;
                                if (document.cookie && document.cookie != '') {
                                    let cookies = document.cookie.split(';');
                                    for (let i = 0; i < cookies.length; i++) {
                                        let cookie = jQuery.trim(cookies[i]);
                                        // Does this cookie string begin with the name we want?
                                        if (cookie.substring(0, name.length + 1) === (name + '=')) {
                                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                            break;
                                        }
                                    }
                                }
                                return cookieValue;
                            }

                            xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                        },
                        xhr: function () {
                            let xhr = new window.XMLHttpRequest();
                            xhr.upload.addEventListener('progress', function (evt) {
                                if (evt.lengthComputable) {
                                    let percentComplete = evt.loaded / evt.total * 100;
                                    $('.cover-photo-wrapper .ko-progress-circle').attr('data-progress', Math.floor(percentComplete));
                                }
                            }, false);
                            xhr.addEventListener('progress', function (evt) {
                                if (evt.lengthComputable) {
                                    let percentComplete = evt.loaded / evt.total;

                                }
                            }, false);
                            return xhr;
                        },
                        success: function (data) {
                            $('.cover-photo-wrapper .ko-progress-circle').addClass('display-none');
                            window.location.reload();
                        }
                    });
                });
            }
        }

        $("#profile-photo-popup .files-holder .files").on("change", function (e) {
            readAvatarFile(this);
        });
        $("#cover-photo-popup .files-holder .files").on("change", function (e) {
            readBannerFile(this);
        });
        avatarRemoveButton.on('click', function () {
            avatarFilesHolder.show();
            avatarUploadButton.prop('disabled', true);
            avatarUploadButton.addClass('disabled');
            $(this).hide();
            if (xhrObject2) {
                xhrObject2.abort();
            }
            $('.profile-photo-wrapper .ko-progress-circle').addClass('display-none');
            $('#upload-avatar .files-holder .files').val('');
            $('#upload-avatar img').attr('src', '');
        });
        bannerRemoveButton.on('click', function () {
            bannerFilesHolder.show();
            bannerUploadButton.prop('disabled', true);
            bannerUploadButton.addClass('disabled');
            if (xhrObject) {
                xhrObject.abort();
            }
            $('.cover-photo-wrapper .ko-progress-circle').addClass('display-none');
            $(this).hide();
            $('.files-holder .files').val('');
            $('#upload-banner img').attr('src', '');
        });
        $uploadCrop2 = $('#upload-banner').croppie({
            enableExif: true,
            viewport: {
                width: 530,
                height: 220,
                type: 'square'
            },
            boundary: {
                width: 530,
                height: 295
            }
        });
        uploadCrop = $('#upload-avatar').croppie({
            enableExif: true,
            viewport: {
                width: 150,
                height: 150,
                type: 'circle'
            },
            boundary: {
                width: 530,
                height: 295
            }
        });
    } else {
        alert("Your browser doesn't support to File API")
    }

});