$(function () {
    $('.remove-favourite-user-page').on('click', function () {
        $this = $(this);
        var id = $this.parent().next().find('a').attr('href').substring(14);
        var data = {
            id: id
        };

        $.ajax({
            method: 'DELETE',
            url: '/user/favourites',
            data: data,
            success: ((data) =>  {
                // location.reload();
                window.location.reload();
            }),
            error: ((error) => {
                // console.log(error);
                window.location.reload();
            })
        });
    });

});

$(function () {
    $('.remove-favourite').on('click', function () {
        $this = $(this);
        var pathname = window.location.pathname;
        var id = pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
        var data = {
            id: id
        };
        
        $.ajax({
            method: 'DELETE',
            url: '/user/favourites',
            data: data,
            success: ((data) =>  {
                window.location.reload();   
            }),
            error: ((error) => {
                window.location.reload();
            })
        });
    });
});


// $(function () {
//     $('.remove').on('click', function () {
//         $this = $(this);
//         var id = $this.parent().next().find('a').attr('href').substring(14);
//         var data = {
//             id: id
//         };

//         fetch('/user/removefavourites', {
//             method: "delete",
//             credentials: "include",
//             body: JSON.stringify(data),
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//         }).then(res => {
//             console.log(res)
//             return res.json();
//         })
//         .then(data => {
//             console.log(data);
//             window.location.reload();
//         });
//     });
// });