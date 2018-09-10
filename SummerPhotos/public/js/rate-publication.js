$(function () {
    // var pathname = window.location.pathname;
    // var id = pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
    // var data = {
    //     'id': id,
    // };

    $('.like').on('click', function (e) {
        var target = $(e.target);
        console.log(target);
        var id = target.parent().attr('data-id');
        console.log(id);
        var data = {
            'id': id,
        };
        $.ajax({
            method: 'POST',
            url: '/publications/like',
            data: data,
            success: ((data) => {
                toastr.success('You like this pulication!');
                window.location.reload();        
            }),
            error: ((error) => {
                toastr.error(error);
            })
        });
    });

    $('.dislike').on('click', function (e) {
        var target = $(e.target);
        console.log(target);
        var id = target.parent().attr('data-id');
        console.log(id);
        var data = {
            'id': id,
        };
        $.ajax({
            method: 'POST',
            url: '/publications/dislike',
            data: data,
            success: ((data) => {
                toastr.success('You dislike this pulication!');
                window.location.reload(); 
            }),
            error: ((error) => {
                toastr.error(error);
            })
        });
    });
});
