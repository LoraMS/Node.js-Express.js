$(function () {
    var pathname = window.location.pathname;
    var id = pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
    var data = {
        'id': id,
    };

    $('.like').on('click', function () {
        $.ajax({
            method: 'POST',
            url: '/publications/like',
            data: data,
            success: ((data) => {
                console.log('success');
            }),
            error: ((error) => {
                console.log(error);
            })
        });
    });

    $('.dislike').on('click', function () {
        $.ajax({
            method: 'POST',
            url: '/publications/dislike',
            data: data,
            success: ((data) => {
                console.log('success');
            }),
            error: ((error) => {
                console.log(error);
            })
        });
    });
});
