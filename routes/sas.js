var azure = require('azure-storage');
var express = require('express');
var router = express.Router();

var storageAccount = process.env.AZURE_STORAGE_ACCOUNT || 'ggmlrstor';
var storageAccessKey = process.env.AZURE_STORAGE_ACCESS_KEY || 't+iOnta9NSPaJgPdee9YOgzzI0wBYemzpjj3Ig8ED0C6wY4S/zNgFfDecV4fDxQLAFrOrGaraQjNXRHQPutYyA==';
var storageEndpoint = 'https://' + storageAccount + '.blob.core.windows.net/';

var blobService = azure.createBlobService(storageAccount, storageAccessKey);

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;