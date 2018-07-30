$(function () {
    fetch('/publishers/mostpopular')
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            const wrapper = $('.popular');
            data.result.forEach((publishers) => {
                $('<div/>')
                    .addClass('col-md-12')
                    .append($('<a href="/publishers/' + publishers._id + '">').addClass('info').text(publishers.name))
                    .appendTo(wrapper);
            });
        });
});