var azure = require('azure-storage');
var express = require('express');
var uuid = require('uuid');

var router = express.Router();

var storageAccount = process.env.AZURE_STORAGE_ACCOUNT || 'ggmlrstor';
var storageAccessKey = process.env.AZURE_STORAGE_ACCESS_KEY || 't+iOnta9NSPaJgPdee9YOgzzI0wBYemzpjj3Ig8ED0C6wY4S/zNgFfDecV4fDxQLAFrOrGaraQjNXRHQPutYyA==';
var storageEndpoint = 'https://' + storageAccount + '.blob.core.windows.net/';

var blobService = azure.createBlobService(storageAccount, storageAccessKey);

var blobRouter = express.Router();

blobRouter.get('/:container?/:filename?', function(req, res, next) {
  var startDate = new Date();
  var expiryDate = new Date(startDate);
  expiryDate.setMinutes(startDate.getMinutes() + 1);
  startDate.setMinutes(startDate.getMinutes() - 1);

  var sharedAccessPolicy = {
    AccessPolicy: {
      Permissions: azure.BlobUtilities.SharedAccessPermissions.READ + azure.BlobUtilities.SharedAccessPermissions.ADD
        + azure.BlobUtilities.SharedAccessPermissions.CREATE + azure.BlobUtilities.SharedAccessPermissions.WRITE
        + azure.BlobUtilities.SharedAccessPermissions.DELETE + azure.BlobUtilities.SharedAccessPermissions.LIST,
      Start: startDate,
      Expiry: expiryDate
    },
  };

  var storageContainer = 'default-container';
  if (req.params.container) {
    blobService.createContainerIfNotExists(req.params.container, function(error, result, response){
        if(!error){
          storageContainer = req.params.container;
        }
    });
  }

  var blobName;
  if (req.params.filename) {
    var split = (req.params.filename).split('.');
    var name = split.slice(0, split.length - 1).join('.');
    var ext = split[split.length - 1];

    blobName = name + '-' + uuid.v4() + '.' + ext;
  } else {
    blobName = uuid.v4();
  }

  var blobSAS = blobService.generateSharedAccessSignature(storageContainer, blobName, sharedAccessPolicy);

  var result = {
    token: blobSAS,
    blobURI: storageEndpoint + storageContainer + '/' + blobName,
    tokenURI: storageEndpoint + storageContainer + '/' + blobName + '?' + blobSAS
  };

  res.send(result);
});

router.use('/blob', blobRouter);

module.exports = router;