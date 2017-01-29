$(function() {
    console.log('Team 06');

    $('[data-toggle="popover"]').popover();
    $('[data-toggle="tooltip"]').tooltip();


    var $btnCopy = $('<button>')
        .addClass('btn btn-primary btn-xs pull-right')
        .html('<i class=\'fa fa-dedent\'></i>')
        .click(function(e) {
            var txtToCopy = $(this).parent()[0].innerText;
            console.log('To copy :', txtToCopy);
            // Copy the txt into the clipboard
        });

    $(".to-copy").hover(function() {
        $(this).append($btnCopy); // Add the little btn to make the copy
        $btnCopy.show();
    }, function() {
        $btnCopy.hide();
    });


    $('#reset,#delete').click(function() {
        var $btn = $(this),
            $modal = $($btn.data('target'));

        $modal.find('.btn-confirm').attr('href', $btn.data("link"));
    });


    var inputImg = document.getElementById('appLogo');
    var appChosenLogo = document.getElementById('appChosenLogo');
    //var previewImg = document.getElementById('previewLogo');
    var previewImg = new window.Image();
    var file, fileDetails = document.getElementById('fileDetails');
    var canvas = document.getElementById('canv');
    var fileName = document.getElementById('fileName');
    var fileType = document.getElementById('fileType');
    var fileSize = document.getElementById('fileSize');
    var fileSrc = document.getElementById('fileSrc');


    inputImg.addEventListener("change", function() {

        file = this.files[0];
        //previewImg.width = fit.width;
        //previewImg.height = fit.height;
        previewImg.src = fileSrc.innerHTML = window.URL.createObjectURL(file);

        if (previewImg.complete)
            drawImage(previewImg);
        else
            previewImg.onload = function() {
                return drawImage(previewImg)
            };

        fileDetails.className = 'dl-horizontal'
        fileSize.innerHTML = /*Math.floor*/ (file.size / 1024).toFixed(3) + ' Kb.';
        fileType.innerHTML = file.type;
        fileName.innerHTML = file.name;

    }, false);



    /**
     * Conserve aspect ratio of the orignal region. Useful when shrinking/enlarging
     * images to fit into a certain area.
     *  src : http://stackoverflow.com/questions/3971841/how-to-resize-images-proportionally-keeping-the-aspect-ratio
     *
     * @param {Object} dimension : contains the width and height of src and max.

     * @return {Object} { width, heigth } the src dimension * ratio
     */
    function calculateAspectRatioFit(dimension) {
        var ratio = Math.min(dimension.maxWidth / dimension.srcWidth, dimension.maxHeight / dimension.srcHeight);
        return {
            maxWidth: dimension.maxWidth, maxHeight: dimension.maxHeight ,
            width: dimension.srcWidth * ratio,
            height: dimension.srcHeight * ratio
        };
    }

    function drawImage(img) {
        var fit = calculateAspectRatioFit({
            maxWidth: 300,
            maxHeight: 250,
            srcWidth: img.width || 10,
            srcHeight: img.height || 10
        });
        canvas.className = ''
        var ctx = canvas.getContext("2d");
        canvas.width = fit.maxWidth;
        canvas.height = fit.maxWidth;
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);

        appChosenLogo.value = canvas.toDataURL();
        console.log(appChosenLogo.value);

    }


});
