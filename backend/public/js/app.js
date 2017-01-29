$(function() {
    console.log('Team 06');

    $('[data-toggle="popover"]').popover();
    $('[data-toggle="tooltip"]').tooltip();


    var $btnCopy = $('<button>')
                    .addClass('btn btn-primary btn-xs pull-right')
                    .html('<i class=\'fa fa-dedent\'></i>')
                    .click(function (e){
                        var txtToCopy = $(this).parent()[0].innerText;
                        console.log('To copy :',txtToCopy);
                        // Copy the txt into the clipboard
                    });

    $(".to-copy").hover(function() {
        $(this).append($btnCopy); // Add the little btn to make the copy
        $btnCopy.show();
    }, function() {
        $btnCopy.hide();
    });


    $('#reset,#delete').click(function(){
        var $btn = $(this), $modal = $($btn.data('target'));
        $modal.find('.btn-confirm').attr('href',$btn.data("link"));
    });




});