$(function () {
    let data = {
        'name': $('#name').val(),
        'e-mail': $('#email').val(),
        'subject': $('#subject').val(),
        'message': $('#message').val()
    };

    $('#btnContactUs').on('click', function () {
        $.ajax({
            method: 'POST',
            url: '/contact',
            data: data,
            success: function(data) {
                // console.log(data)
                $('#name').val('');
                $('#email').val('');
                $('#subject').val('');
                $('#message').val('');
            },
            error: ((error) => {
                alert('There was an error with sending your data. Please try again!');
            })
        });
    });
});