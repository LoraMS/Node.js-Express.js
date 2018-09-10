$(function () {   
    $('#btnContactUs').on('click', function () {
        let data = {
            'name': $('#name').val(),
            'e-mail': $('#email').val(),
            'subject': $('#subject').val(),
            'message': $('#message').val()
        };
    
        let emailPattern = /^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}$/;
        
        if(!data.name || !data["e-mail"] || !data.message){
            toastr.warning('Please fill the form.')
            return;
        }
    
        if (data.name.length < 2) {
            toastr.error('Name must be more than 2 symbols!');
            return;
        }
    
        if (!data["e-mail"].match(emailPattern)) {
            toastr.error('Please fill valid e-mail field!');
            return;
        }
    
        if (data.message.length < 10) {
            toastr.error('Message must be more than 10 symbols!');
            return;
        }
    
        if(/^[a-zA-Z0-9 ]+$/.test(data.message)){
            toastr.error('Message must contains alphanumerical symbols only');
            return;
        }

        $.ajax({
            method: 'POST',
            url: '/contact',
            data: data,
            success: ((data) => {
                toastr.success('Your message was send successfully!');
            }),
            error: ((error) => {
                toastr.error(error, 'There was an error with sending your data. Please try again!');
            })
        });
    });
});
