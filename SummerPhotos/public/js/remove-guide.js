$(function () {
    $('.remove').click(function (e) {
        var target = $(e.target);
        var id = target.parent().attr('data-id');
        var data = {
            'id': id,
            'destination': $('#guide-destination').text(),
        };
        console.log(data);
        $.ajax({
            method: 'DELETE',
            url: '/guides',
            data: data,
            success: (() =>  {  
                toastr.success('Guide was removed successfully!')   
                window.location.href = '/guides';
            }),
            error: ((error) => {   
                toastr.error(error, 'Please try again later!');  
                window.location.href = '/guides';
            })
        })
    });
});