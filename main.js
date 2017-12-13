var express = require('express');
var fileUpload = require('express-fileupload');
var xlsx = require('node-xlsx');
var app = express();

app.use(fileUpload());

app.use('/', express.static('public'));
app.post('/parse', function(req, res) {
  if (!req.files)
    return res.json({
    	status: false,
    	message: 'File not uploaded'
    });

  try {
	  res.json({
	  	status: true,
	  	file: xlsx.parse(req.files.xlsx.data)
	  });
  } catch(e) {
  	res.json({
  		status: false,
  		message: 'Invalid file!'
  	});
  }
});

app.listen(80);