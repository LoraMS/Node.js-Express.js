$(function () {
    // var pathname = window.location.pathname;
    // var id = pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
    // var data = {
    //     'id': id,
    //     'image': $('.single-publication-container').find('img:first').attr('src').substring(1),
    //     'title': $('h2').text(),
    //     'date': $('.date').text(),
    //     'publisher': $('.post-by').text()
    // };

    $('.favourite').on('click', function (e) {
        var target = $(e.target);
        var id = target.parent().attr('data-id');
        var data = {
                'id': id,
                'image': $('.single-publication-container').find('img:first').attr('src').substring(1),
                'title': $('h2').text(),
                'date': $('.date').text(),
                'publisher': $('.post-by').text()
            };
        $.ajax({
            method: 'POST',
            url: '/user/favourites',
            data: data,
            success: ((data) =>  {
                if(data.message === 'already added'){
                    toastr.info('This publication is already in your favourites!');
                } else {
                    toastr.success('Successfully added to favorites!');
                }             
            }),
            error: ((error) => {
                toastr.error(error, 'Please try again!');       
            })
        })
    });
});
