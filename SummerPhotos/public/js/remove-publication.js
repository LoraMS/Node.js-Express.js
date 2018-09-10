$(function () {
    // var pathname = window.location.pathname;
    // var id = pathname.substring(window.location.pathname.lastIndexOf('/') + 1);

    // var data = {
    //     'id': id,
    //     'publisher': $('.post-by').text().substring(3),
    //     'title': $('h2').text(),
    //     'destination': $('.destination-info').text(),
    // };

    $('.remove').click(function (e) {
        var target = $(e.target);
        var id = target.parent().attr('data-id');
        var data = {
            'id': id,
            'publisher': $('.post-by').text().substring(3),
            'title': $('h2').text(),
            'destination': $('.destination-info').text(),
        };
        $.ajax({
            method: 'DELETE',
            url: '/publications',
            data: data,
            success: (() =>  {  
                toastr.success('Publication was removed successfully!')   
                window.location.href = '/publications';
            }),
            error: ((error) => {   
                toastr.error(error, 'Please try again!');  
                window.location.href = '/publications';
            })
        })
    });
});
