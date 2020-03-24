function readAvatarFile(input) {
    if (input.files && input.files[0]) {
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

        $('#profile-photo-popup .profile-photo-submit').on('click', function () {
            uploadCrop.croppie('result', {
                type: 'canvas',
                size: 'viewport'
            }).then(function (response) {
                $('.profile-photo-wrapper .pip').removeClass('display-none');
                $.ajax({
                    type: 'POST',
                    data: {
                        cropped_image: response,
                        original_image: reader.result
                    },
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
                                $('.profile-photo-wrapper .pip').find('.myBar').css('width', percentComplete + '%');
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

        $('.cover-photo-wrapper .profile-photo-submit').on('click', function () {
            $uploadCrop2.croppie('result', {
                type: 'canvas',
                size: 'viewport'
            }).then(function (response) {
                $('.cover-photo-wrapper .pip').removeClass('display-none');
                $.ajax({
                    type: 'POST',
                    data: {
                        cropped_image: response,
                        original_image: reader.result
                    },
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
                                console.log(percentComplete);
                                $('.cover-photo-wrapper .pip').find('.myBar').css('width', percentComplete + '%');
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