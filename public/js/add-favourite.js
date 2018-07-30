$(function () {
    var pathname = window.location.pathname;
    var id = pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
    var data = {
        'id': id,
        'image': $('.single-publication-container').find('img:first').attr('src').substring(7),
        'title': $('h2').text(),
        'date': $('.date').text(),
        'publisher': $('.post-by').text()
    };

    $('.favourite').on('click', function () {
        $.ajax({
            method: 'POST',
            url: '/user/favourites',
            data: data,
            success: ((data) =>  {
            window.location.reload();                
            }),
            error: ((error) => {
            window.location.reload();        
            })
        })
        .then(() => {
         });
    });
});
