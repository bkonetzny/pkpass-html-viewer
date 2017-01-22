var handleJsonData = function(zip, filename){
  var $pass = $('#pass');
  var $meta = $('#meta dl');
  $meta.html('');

  zip
  .file(filename)
  .async('string')
  .then(function success(content) {
    var passData = JSON.parse(content);

    $pass.css('background-color', passData.backgroundColor);

    if (passData.eventTicket) {
      if (passData.eventTicket.headerFields) {
        $fields = $('<dl></dl>');

        jQuery.each(passData.eventTicket.headerFields, function(key, field) {
          $fields.append('<dt>' + field.label + '</dt>');
          $fields.append('<dd>' + field.value + '</dd>');
        });

        $('.headerFields').append($fields);
      }

      if (passData.eventTicket.primaryFields) {
        $fields = $('<dl></dl>');

        jQuery.each(passData.eventTicket.primaryFields, function(key, field) {
          $fields.append('<dt>' + field.label + '</dt>');
          $fields.append('<dd>' + field.value + '</dd>');
        });

        $('.primaryFields').append($fields);
      }

      if (passData.eventTicket.secondaryFields) {
        $fields = $('<dl></dl>');

        jQuery.each(passData.eventTicket.secondaryFields, function(key, field) {
          $fields.append('<dt>' + field.label + '</dt>');
          $fields.append('<dd>' + field.value + '</dd>');
        });

        $('.secondaryFields').append($fields);
      }

      if (passData.eventTicket.auxiliaryFields) {
        $fields = $('<dl></dl>');

        jQuery.each(passData.eventTicket.auxiliaryFields, function(key, field) {
          $fields.append('<dt>' + field.label + '</dt>');
          $fields.append('<dd>' + field.value + '</dd>');
        });

        $('.auxiliaryFields').append($fields);
      }

      if (passData.eventTicket.backFields) {
        $fields = $('<dl></dl>');

        jQuery.each(passData.eventTicket.backFields, function(key, field) {
          $fields.append('<dt>' + field.label + '</dt>');
          $fields.append('<dd>' + field.value + '</dd>');
        });

        $('.backFields').append($fields);
      }
    }

    if (passData.labelColor) {
      $pass.find('dt, .switch').css('color', passData.labelColor);
    }
    if (passData.foregroundColor) {
      $pass.find('dd, .switch').css('color', passData.foregroundColor);
    }
    
    qr.canvas({
      canvas: document.getElementById('qrcode'),
      value: passData.barcode.message
    });

    $meta.append('<dt>Description</dt><dd>' + passData.description + '</dd>');
    $meta.append('<dt>Organization Name</dt><dd>' + passData.organizationName + '</dd>');
    $meta.append('<dt>Pass Type Identifier</dt><dd>' + passData.passTypeIdentifier + '</dd>');
    $meta.append('<dt>Serial Number</dt><dd>' + passData.serialNumber + '</dd>');
    $meta.append('<dt>Team Identifier</dt><dd>' + passData.teamIdentifier + '</dd>');
    $meta.append('<dt>Format Version</dt><dd>' + passData.formatVersion + '</dd>');
  }, function error(e) {
      // handle the error
  });
};

var handleForegroundImage = function(zip, filename, $element){
  zip
  .file(filename)
  .async('base64')
  .then(function success(content) {
    $element.prepend('<img src="data:image/png;base64,' + content + '">');
  }, function error(e) {
      // handle the error
  });
};

var handleBackgroundImage = function(zip, filename, $element){
  zip
  .file(filename)
  .async('base64')
  .then(function success(content) {
    $element.css('background-image', 'url(data:image/png;base64,' + content + ')');
  }, function error(e) {
      // handle the error
  });
};

(function() {
  $('.switchToBack').on('click', function() {
    $('.side.front').hide();
    $('.side.back').show();
  });
  $('.switchToFront').on('click', function() {
    $('.side.back').hide();
    $('.side.front').show();
  });

  $("#file").on("change", function(evt) {
    var files = evt.target.files;

    for (var i = 0, f; f = files[i]; i++) {
      JSZip.loadAsync(f)
      .then(function(zip) {
        var $pass = $('#pass');
        $pass.find('dl, img').remove();
        $pass.find('.side.front, .primaryFields').css('background-image', 'none');
        var $files = $('#files');
        $files.html('');

        $.each(zip.files, function(index, zipEntry) {
          $files.append($('<li>', {text: zipEntry.name}));

          switch (zipEntry.name) {
          case 'pass.json':
            handleJsonData(zip, zipEntry.name);
            break;

          case 'logo.png':
            handleForegroundImage(zip, zipEntry.name, $('.headerFields'));
            break;

          case 'thumbnail.png':
            handleForegroundImage(zip, zipEntry.name, $('.primaryFields'));
            break;

          case 'background.png':
            handleBackgroundImage(zip, zipEntry.name, $pass.find('.side.front'));
            break;

          case 'strip.png':
            handleBackgroundImage(zip, zipEntry.name, $pass.find('.primaryFields'));
            break;
          }
        });
      }, function (e) {
        console.error(e.message);
      });
    }
  });
})();
