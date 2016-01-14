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
			var reader = new FileReader();

			// Closure to capture the file information.
			reader.onload = (function(theFile) {
				return function(e) {
					var zip = new JSZip(e.target.result);

					var $pass = $('#pass');
					$pass.find('dl, img').remove();
					$pass.find('.side.front, .primaryFields').css('background-image', 'none');
					var $meta = $('#meta dl');
					$meta.html('');
					var $files = $('#files ul');
					$files.html('');

					$.each(zip.files, function(index, zipEntry) {
						$files.append($('<li>', {text: zipEntry.name}));

						if (zipEntry.name === 'pass.json') {
							var passData = JSON.parse(zipEntry.asText());
							console.log(passData);

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

							var qrcode = new QRCode(document.getElementById('qrcode'), {
								text : passData.barcode.message,
								width : 80,
								height : 80,
								colorDark : "#000000",
								colorLight : "#ffffff",
								correctLevel : QRCode.CorrectLevel.H
							});

							$meta.append('<dt>Description</dt><dd>' + passData.description + '</dd>');
							$meta.append('<dt>Organization Name</dt><dd>' + passData.organizationName + '</dd>');
							$meta.append('<dt>Pass Type Identifier</dt><dd>' + passData.passTypeIdentifier + '</dd>');
							$meta.append('<dt>Serial Number</dt><dd>' + passData.serialNumber + '</dd>');
							$meta.append('<dt>Team Identifier</dt><dd>' + passData.teamIdentifier + '</dd>');
							$meta.append('<dt>Format Version</dt><dd>' + passData.formatVersion + '</dd>');
						}
						else if (zipEntry.name === 'logo.png') {
							$('.headerFields').prepend('<img src="data:image/png;base64,' + btoa(zipEntry.asBinary()) + '">');
						}
						else if (zipEntry.name === 'thumbnail.png') {
							$('.primaryFields').prepend('<img src="data:image/png;base64,' + btoa(zipEntry.asBinary()) + '">');
						}
						else if (zipEntry.name === 'background.png') {
							$pass.find('.side.front').css('background-image', 'url(data:image/png;base64,' + btoa(zipEntry.asBinary()) + ')');
						}
						else if (zipEntry.name === 'strip.png') {
							$('.primaryFields').css('background-image', 'url(data:image/png;base64,' + btoa(zipEntry.asBinary()) + ')');
						}
					});
				}
			})(f);

			reader.readAsArrayBuffer(f);
		}
	});
})();
