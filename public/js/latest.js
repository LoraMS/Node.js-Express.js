// $(function () {
//     $.ajax({
//             url: '/publications/latest',
//             type: 'GET',
//             dataType: 'jsonp',
//             success: function(data) {
//                 const wrapper = $('.latest');
//                 data.forEach((publication) => {
//                     $('<div/>')
//                         .addClass('.col-md-12').text('hello')
//                         .append($('<a href="/publications/' + publication._id + '" >').append(
//                             $('<img src="../../static/images/' + publication.image1 + '" alt="image"/>')))
//                         .append($('<div/>').addClass('info').append($('<h6/>').text(publication.title)))
//                         .appendTo(wrapper);
//                 });
//             },
//             error: function(error) {
//                 console.log(error);
//             },
//     });
// });


// $(document).ready(function() {
//     $.getJSON('/publications/latest', function(res) {
//         const wrapper = $('.latest');
//         res.result.forEach((publication) => {
//             $('<div/>')
//                 .addClass('.col-md-12')
//                 .append($('<a href="/publications/' + publication._id + '" >').append(
//                     $('<img src="../../static/images/' + publication.image1 + '" alt="image"/>')))
//                 .append($('<div/>').addClass('info').append($('<h6/>').text(publication.title)))
//                 .appendTo(wrapper);
//         });
//     });
// });


$(function () {
    fetch('/publications/latest')
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            // console.log(data.result);
            const wrapper = $('.latest');
            data.result.forEach((publications) => {
                $('<div/>')
                    .addClass('.col-md-12')
                    .append($('<a href="/publications/' + publications._id + '">').append(
                        $('<img src="/' + publications.image1 + '" alt="image"/>')))
                    .append($('<div/>').addClass('info text-center').append($('<h6/>').text(publications.title)))
                    .appendTo(wrapper);
            });
        });
});