$(function () {
    var pathname = window.location.pathname;
    var id = pathname.substring(window.location.pathname.lastIndexOf('/') + 1);

    var data = {
        'id': id,
        'publisher': $('.post-by').text().substring(3),
        'title': $('h2').text(),
        'destination': $('.destination-info').text(),
    };

    $('.remove').click(function () {
        $.ajax({
            method: 'DELETE',
            url: '/publications',
            data: data,
            success: (() =>  {     
                window.location.href = '/publications';
            }),
            error: ((error) => {     
                window.location.href = '/publications';
            })
        })
        .then(() =>{
        // window.location.href = '/publications';
        });
    });
});
