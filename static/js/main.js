$(document).ready(function () {
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

    function beforeSendCallback(xhr, settings) {
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }

    Dropzone.options.updateFiles = {
        addRemoveLinks: true,
        dictDefaultMessage: 'Drag and Drop your Photos',
        acceptedFiles: '.xlsx,.xls,image/*,.doc,audio/*,.docx,video/*,.ppt,.pptx,.txt,.pdf',
        dictRemoveFile: '<i class="fal fa-2x fa-trash-alt"></i>',
        maxFiles: 4,
        removedfile: function (file) {
            $.ajax({
                type: 'POST',
                url: '/profiles/updates/remove/',
                data: {
                    filename: file.name
                },
                beforeSend: beforeSendCallback
            });
            let _ref;
            return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
        },
    };
    Dropzone.options.serviceFiles = {
        addRemoveLinks: true,
        dictDefaultMessage: 'Drag and Drop your Photos',
        acceptedFiles: '.xlsx,.xls,image/*,.doc,audio/*,.docx,video/*,.ppt,.pptx,.txt,.pdf',
        dictRemoveFile: '<i class="fal fa-2x fa-trash-alt"></i>',
        maxFiles: 4,
        removedfile: function (file) {
            $.ajax({
                type: 'POST',
                url: '/profiles/services/remove/',
                data: {
                    filename: file.name
                },
                beforeSend: beforeSendCallback
            });
            let _ref;
            return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
        },
    };
    Dropzone.options.saleFiles = {
        addRemoveLinks: true,
        dictDefaultMessage: 'Drag and Drop your Photos',
        acceptedFiles: '.xlsx,.xls,image/*,.doc,audio/*,.docx,video/*,.ppt,.pptx,.txt,.pdf',
        dictRemoveFile: '<i class="fal fa-2x fa-trash-alt"></i>',
        maxFiles: 4,
        removedfile: function (file) {
            $.ajax({
                type: 'POST',
                url: '/profiles/sales/remove/',
                data: {
                    filename: file.name
                },
                beforeSend: beforeSendCallback
            });
            let _ref;
            return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
        },
    };
    Dropzone.options.offerFiles = {
        addRemoveLinks: true,
        dictDefaultMessage: 'Drag and Drop your Photos',
        acceptedFiles: '.xlsx,.xls,image/*,.doc,audio/*,.docx,video/*,.ppt,.pptx,.txt,.pdf',
        dictRemoveFile: '<i class="fal fa-2x fa-trash-alt"></i>',
        maxFiles: 4,
        removedfile: function (file) {
            $.ajax({
                type: 'POST',
                url: '/profiles/offers/remove/',
                data: {
                    filename: file.name
                },
                beforeSend: beforeSendCallback
            });
            let _ref;
            return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
        },
    };
    Dropzone.options.eventFiles = {
        addRemoveLinks: true,
        dictDefaultMessage: 'Drag and Drop your Photos',
        acceptedFiles: '.xlsx,.xls,image/*,.doc,audio/*,.docx,video/*,.ppt,.pptx,.txt,.pdf',
        dictRemoveFile: '<i class="fal fa-2x fa-trash-alt"></i>',
        maxFiles: 4,
        removedfile: function (file) {
            $.ajax({
                type: 'POST',
                url: '/profiles/events/remove/',
                data: {
                    filename: file.name
                },
                beforeSend: beforeSendCallback
            });
            let _ref;
            return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
        },
    };
    Dropzone.options.jobFiles = {
        addRemoveLinks: true,
        dictDefaultMessage: 'Drag and Drop your Photos',
        acceptedFiles: '.xlsx,.xls,image/*,.doc,audio/*,.docx,video/*,.ppt,.pptx,.txt,.pdf',
        dictRemoveFile: '<i class="fal fa-2x fa-trash-alt"></i>',
        maxFiles: 4,
        removedfile: function (file) {
            $.ajax({
                type: 'POST',
                url: '/profiles/jobs/remove/',
                data: {
                    filename: file.name
                },
                beforeSend: beforeSendCallback
            });
            let _ref;
            return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
        },
    };

    function createUpdateFormSubmit() {
        let form = $('#create-updates-form');
        form.find('textarea').removeClass('invalid');
        form.find('textarea').nextAll('span').remove();
        form.find('input').removeClass('invalid');
        form.find('input[name="button_link"]').nextAll('span').remove();
        $.ajax({
            type: 'POST',
            url: '/profiles/posts/create/',
            data: form.serialize(),
            success: function (data) {
                window.location.reload();
            },
            error: function (xhr, statusCode, error) {
                let messages = xhr.responseJSON;
                for (key in messages) {
                    if (key === 'description') {
                        form.find('textarea').addClass('invalid');
                        form.find('textarea').after('<span class="error error_show">' + messages[key] + '</span>');
                    }
                    if (key === 'button_link') {
                        form.find('input[name="button_link"]').addClass('invalid');
                        form.find('input[name="button_link"]').after('<span class="error error_show">' + messages[key] + '</span>');
                    }
                }
            }
        });
    }

    $('#create-updates-form input').on('keydown', function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            createUpdateFormSubmit();
        }
    });
    $('#create-updates-form button.publish').on('click', function () {
        createUpdateFormSubmit();
    });

    function createServiceFormSubmit(form) {
        form.find('textarea').removeClass('invalid');
        form.find('textarea[name="title"]').nextAll('span').remove();
        form.find('textarea[name="description"]').nextAll('span').remove();
        form.find('input').removeClass('invalid');
        form.find('input[name="button_link"]').nextAll('span').remove();
        form.find('input[name="price"]').nextAll('span').remove();
        form.find('input[name="min_price"]').nextAll('span').remove();
        form.find('input[name="max_price"]').nextAll('span').remove();
        $.ajax({
            type: 'POST',
            url: '/profiles/products/create/',
            data: form.serialize(),
            success: function () {
                window.location.reload();
            },
            error: function (xhr, statusCode, error) {
                let messages = xhr.responseJSON;
                for (key in messages) {
                    if (key === 'title') {
                        form.find('textarea[name="title"]').addClass('invalid');
                        form.find('textarea[name="title"]').after('<span class="error error_show">' + messages[key] + '</span>');
                    }
                    if (key === 'price') {
                        form.find('input[name="price"]').addClass('invalid');
                        form.find('input[name="price"]').after('<span class="error error_show">' + messages[key] + '</span>');
                    }
                    if (key === 'min_price') {
                        form.find('input[name="min_price"]').addClass('invalid');
                        form.find('input[name="min_price"]').after('<span class="error error_show">' + messages[key] + '</span>');
                    }
                    if (key === 'max_price') {
                        form.find('input[name="max_price"]').addClass('invalid');
                        form.find('input[name="max_price"]').after('<span class="error error_show">' + messages[key] + '</span>');
                    }
                    if (key === 'description') {
                        form.find('textarea[name="description"]').addClass('invalid');
                        form.find('textarea[name="description"]').after('<span class="error error_show">' + messages[key] + '</span>');
                    }
                    if (key === 'button_link') {
                        form.find('input[name="button_link"]').addClass('invalid');
                        form.find('input[name="button_link"]').after('<span class="error error_show">' + messages[key] + '</span>');
                    }
                }
            }
        })
    }

    $('#create-service-form button.publish').on('click', function () {
        let form = $('#create-service-form');
        createServiceFormSubmit(form);
    });
    $('#create-service-form input').on('keydown', function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            let form = $('#create-service-form');
            createServiceFormSubmit(form);
        }
    });

    $('#create-sale-form button.publish').on('click', function () {
        let form = $('#create-sale-form');
        createServiceFormSubmit(form);
    });
    $('#create-sale-form input').on('keydown', function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            let form = $('#create-sale-form');
            createServiceFormSubmit(form);
        }
    });

    function createOfferFormSubmit() {
        let form = $('#create-offer-form');
        form.find('textarea').removeClass('invalid');
        form.find('textarea').nextAll("span").remove();
        form.find('input').removeClass('invalid');
        form.find('input[name="start_date"]').nextAll("span").remove();
        form.find('input[name="end_date"]').nextAll("span").remove();
        form.find('input[name="price"]').nextAll("span").remove();
        form.find('input[name="description"]').nextAll("span").remove();
        $.ajax({
            type: 'POST',
            url: '/profiles/offers/create/',
            data: form.serialize(),
            success: function () {
                window.location.reload();
            },
            error: function (xhr, statusCode, error) {
                let messages = xhr.responseJSON;
                for (key in messages) {
                    if (key === 'title') {
                        form.find('textarea[name="title"]').addClass('invalid');
                        form.find('textarea[name="title"]').after('<span class="error error_show">' + messages[key] + '</span>');
                    }
                    if (key === 'start_date') {
                        form.find('input[name="start_date"]').addClass('invalid');
                        form.find('input[name="start_date"]').after('<span class="error error_show">' + messages[key] + '</span>');
                    }
                    if (key === 'end_date') {
                        form.find('input[name="end_date"]').addClass('invalid');
                        form.find('input[name="end_date"]').after('<span class="error error_show">' + messages[key] + '</span>');
                    }
                    if (key === 'price') {
                        form.find('input[name="price"]').addClass('invalid');
                        form.find('input[name="price"]').after('<span class="error error_show">' + messages[key] + '</span>');
                    }
                    if (key === 'description') {
                        form.find('textarea[name="description"]').addClass('invalid');
                        form.find('textarea[name="description"]').after('<span class="error error_show">' + messages[key] + '</span>');
                    }
                }
            }
        })
    }

    $('#create-offer-form button.publish').on('click', function () {
        createOfferFormSubmit();
    });
    $('#create-offer-form input').on('keydown', function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            createOfferFormSubmit();
        }
    });

    function eventCreateFormSubmit() {
        let form = $('#create-event-form');
        form.find('textarea').removeClass('invalid');
        form.find('textarea').nextAll("span").remove();
        form.find('input').removeClass('invalid');
        form.find('input[name="start_date"]').nextAll("span").remove();
        form.find('input[name="end_date"]').nextAll("span").remove();
        form.find('input[name="button_link"]').nextAll("span").remove();
        $.ajax({
            type: 'POST',
            url: '/profiles/events/create/',
            data: form.serialize(),
            success: function () {
                window.location.reload();
            },
            error: function (xhr, statusCode, error) {
                let messages = xhr.responseJSON;
                for (key in messages) {
                    if (key === 'title') {
                        form.find('textarea[name="title"]').addClass('invalid');
                        form.find('textarea[name="title"]').after('<span class="error error_show">' + messages[key] + '</span>');
                    }
                    if (key === 'start_date') {
                        form.find('input[name="start_date"]').addClass('invalid');
                        form.find('input[name="start_date"]').after('<span class="error error_show">' + messages[key] + '</span>');
                    }
                    if (key === 'end_date') {
                        form.find('input[name="end_date"]').addClass('invalid');
                        form.find('input[name="end_date"]').after('<span class="error error_show">' + messages[key] + '</span>');
                    }
                    if (key === 'description') {
                        form.find('textarea[name="description"]').addClass('invalid');
                        form.find('textarea[name="description"]').after('<span class="error error_show">' + messages[key] + '</span>');
                    }
                    if (key === 'button_link') {
                        form.find('input[name="button_link"]').addClass('invalid');
                        form.find('input[name="button_link"]').after('<span class="error error_show">' + messages[key] + '</span>');
                    }
                }
            }
        });
    }

    $('#create-event-form button.publish').on('click', function () {
        eventCreateFormSubmit();
    });

    $('#create-event-form input').on('keydown', function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            eventCreateFormSubmit();
        }
    });

    function jobCreateFormSubmit() {
        let form = $('#job-create-form');
        form.find('textarea').removeClass('invalid');
        form.find('textarea').nextAll('span').remove();
        $.ajax({
            type: 'POST',
            url: '/profiles/jobs/create/',
            data: form.serialize(),
            success: function (data) {
                window.location.reload();
            },
            error: function (xhr, statusCode, error) {
                let messages = xhr.responseJSON;
                for (key in messages) {
                    if (key === 'title') {
                        form.find('textarea[name="title"]').addClass('invalid');
                        form.find('textarea[name="title"]').after('<span class="error error_show">' + messages[key] + '</span>');
                    }
                    if (key === 'description') {
                        form.find('textarea[name="description"]').addClass('invalid');
                        form.find('textarea[name="description"]').after('<span class="error error_show">' + messages[key] + '</span>');
                    }
                }
            }
        })
    }

    $('#job-create-form input').on('keydown', function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            jobCreateFormSubmit();
        }
    });
    $('#job-create-form button.publish').on('click', function () {
        jobCreateFormSubmit();
    });

});