var azure = require('azure-storage');
var express = require('express');
var uuid = require('uuid');

var router = express.Router();

var storageAccount = process.env.AZURE_STORAGE_ACCOUNT || 'ggmlrstor';
var storageAccessKey = process.env.AZURE_STORAGE_ACCESS_KEY || 't+iOnta9NSPaJgPdee9YOgzzI0wBYemzpjj3Ig8ED0C6wY4S/zNgFfDecV4fDxQLAFrOrGaraQjNXRHQPutYyA==';
var storageEndpoint = 'https://' + storageAccount + '.blob.core.windows.net/';

var blobService = azure.createBlobService(storageAccount, storageAccessKey);

var blobRouter = express.Router();

function generateSAS(operation, container, filename, permission) {
  var startDate = new Date();
  var expiryDate = new Date(startDate);
  expiryDate.setMinutes(startDate.getMinutes() + 1);
  startDate.setMinutes(startDate.getMinutes() - 1);

  /*
    azure.BlobUtilities.SharedAccessPermissions.READ + azure.BlobUtilities.SharedAccessPermissions.ADD
    + azure.BlobUtilities.SharedAccessPermissions.CREATE + azure.BlobUtilities.SharedAccessPermissions.WRITE
    + azure.BlobUtilities.SharedAccessPermissions.DELETE + azure.BlobUtilities.SharedAccessPermissions.LIST
  */

  var sharedAccessPolicy = {
    AccessPolicy: {
      Permissions: permission,
      Start: startDate,
      Expiry: expiryDate
    },
  };

  var storageContainer = 'default-container';
  if (container) {
    blobService.createContainerIfNotExists(container, function(error, result, response){
        if(!error){
          storageContainer = container;
        }
    });
    console.log('storageContainer: ' + storageContainer);
  }

  var blobName = filename;

  var blobSAS = blobService.generateSharedAccessSignature(storageContainer, blobName, sharedAccessPolicy);

  var sasUrl = storageEndpoint + storageContainer + '/' + blobName + '?' + blobSAS;
  if (operation == 'list') {
    sasUrl = storageEndpoint + storageContainer + '?' + blobSAS + '&restype=container&comp=list';
  }

  var result = {
    token: blobSAS,
    blobName: blobName,
    url: sasUrl
  };

  return result;
}

blobRouter.get('/put/:container?/:filename?', function(req, res, next) {
  var filename = req.params.filename ? uuid.v4() + '-' + req.params.filename : uuid.v4();
  var result = generateSAS('put', req.params.container, filename, 'w');
  res.send(result);
});

blobRouter.get('/get/:container/:filename', function(req, res, next) {
  var result = generateSAS('get', req.params.container, req.params.filename, 'r');
  res.send(result);
});

blobRouter.get('/list/:container/:filename?', function(req, res, next) {
  var result = generateSAS('list', req.params.container, undefined, 'l');
  res.send(result);
});

blobRouter.get('/delete/:container/:filename', function(req, res, next) {
  var result = generateSAS('delete', req.params.container, req.params.filename, 'd');
  res.send(result);
});

router.use('/blob', blobRouter);

module.exports = router;