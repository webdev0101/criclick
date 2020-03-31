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
});