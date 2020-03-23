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