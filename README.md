# azure-blob-storage-sas-express-app

**PUT Blob (write)**
--------------------
  /api/sas/blob/put/:container/:filename?

**GET Blob (read)**
-------------------
  /api/sas/blob/get/:container/:filename

**LIST Blobs (list)**
---------------------
  /api/sas/blob/list/:container/:filename?

**DELETE Blob (delete)**
------------------------
  /api/sas/blob/delete/:container/:filename

For each request you will get, json.

**PUT Blob**
------------
Method: PUT
Request URI: json.url
with additional header 'x-ms-blob-type: BlockBlob' and binary on body

**GET Blob**
------------
METHOD: GET
Request URI: json.url

**LIST Blobs**
--------------
Method: GET
Request URI: json.url

**DELETE Blob**
---------------
Method: DELETE
Request URI: json.url

More details: [Blob Service REST API | Microsoft Docs](https://docs.microsoft.com/en-us/rest/api/storageservices)