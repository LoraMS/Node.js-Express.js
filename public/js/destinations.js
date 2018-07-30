$(function () {
    fetch('/destinations/display')
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            const wrapper = $('.nav-destinations');
            data.result.forEach((destination) => {
                $('<li/>')
                    .attr('role', 'presentation')
                    .append($('<a href="/destinations/' + destination._id + '">').text(destination.destination))
                    .appendTo(wrapper);
            });
        });
});