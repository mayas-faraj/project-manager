# introduction

in the system, there are test users:

* user: **administrator**, password: **123456789**, role: admin
* user: **zaher**, password: **12345**, role: project manager
* user: **mayas**, password: **123**, role: viewer

the api for login:

```bash
curl -X POST -H 'Content-Type: application/json' -d '{"user": "mayas", "password": "123"}' http://<DOMAIN>:4000/login
```

the result of api:

```json
{
"message": "user is empty",
"token": "",
"success": false
}
```
```json
{
"message": "password is empty",
"token": "",
"success": false
}
```
```json
{
"message": "password is not valid",
"token": "",
"success": false
}
```
```json
{
"message": "login success",
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtIjoibWF5YXMiLCJyb2wiOiJWSUVXRVIiLCJleHAiOjE2NzM2NzA1NTUuNDUxLCJpYXQiOjE2NzM2NjY5NTV9.sNUIGhRGlxVBt50TSET1eiRP8Jk5eg3beQIuUK7a46U",
"success": true,
"role": "ADMIN"
}
```

when login success, we should send send token in every api request by putting it in header (Authorization: Bearer <token>)
for example, to read all users:

```bash
curl -X GET -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtIjoibWF5YXMiLCJyb2wiOiJWSUVXRVIiLCJleHAiOjE2NzM2NzA1NTUuNDUxLCJpYXQiOjE2NzM2NjY5NTV9.sNUIGhRGlxVBt50TSET1eiRP8Jk5eg3beQIuUK7a46' http://<DOMAIN>:4000/api/users
```

after login in, admin can update any user name or password by using api:
```bash
curl -X PUT -H 'Content-Type: application/json' -H 'Authorization: Bearer <TOKEN>' -d '{"name": "zaher-updated", "password": "12345-updated"}' http://<DOMAIN>:4000/api/users/2
```

or the user can update his password or login name by using this api (setting user id to 0)
```bash
curl -X PUT -H 'Content-Type: application/json' -H 'Authorization: Bearer <TOKEN>' -d '{"name": "zaher-updated", "password": "12345-updated"}' http://<DOMAIN>:4000/api/users/0
```

if the user forget his password, the admin should update it

# User Model

There are three types of roles for users, ADMIN, PROJECT_MANAGER, VIEWER
* admin can creates user, projects and admin has all priveleges
* project manager can create projects, add user to project as viewer
* viewer can view specific projects

to create user, admin should use this api:
```bash
curl -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer <TOKEN>' -d '{"name": "ali", "password": "12345", "avatar": "/imgs/users/ali.jpg", "role": "ADMIN"}' http://<DOMAIN>:4000/api/users
```
if the operation success, the message should returned from server:
```json
{"success":true,"message":"user has been created"}
```

the avatar should have valid image url, you can upload the image of users to this api endpoint: http://<DOMAIN>:4000/user-image
and the app should send the authorization key by header, as the same as sending any other request,
the request type is post, and content type is (multipart/formdata) and the response contain basic informations about uploaded image.
```json
{
  "fieldname":"avatar",
  "originalname":"samabay.svg",
  "encoding":"7bit",
  "mimetype":"image/svg+xml",
  "destination":"dist/uploads/imgs/users",
  "filename":"img_1674554784746.svg",
  "path":"/imgs/users/img_1674554784746.svg",
  "size":13889}
```
just json the result path with the domain name and port to retrive the image, the supported extensions and type of uploaded image are:
jpeg, jpg, png, gif, svg, and maximum size is 800KB, if the other extensions of file type was uploaded or bigger size than 800KB, the server return an error.

the result of this end point is json object contains uploaded image, we should url -path- field of result as the avatar value.
here are a code example to upload file to this endpoint using flutter.

```dart
// FLUTTER - PICK A FILE
test() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles();
    if (result != null) {
      List<int> bytes = result.files.single.bytes!.cast();
      var name = result.files.single.name;
      _projectProvider.test(bytes, name);
    }
}
```

```dart
// FLUTTER - MAKE A HTTP REQUEST
import 'dart:developer';
import 'package:http_parser/http_parser.dart';

import 'package:dio/dio.dart';

class ProjectProvider {
  ProjectProvider() : _dio = Dio();

  late Response _response;
  late final Dio _dio;

  test(List<int> bytes, String name) async {
    String extension = name.split(".").last;

    var formData = FormData.fromMap({
      "avatar": MultipartFile.fromBytes(
        bytes,
        filename: name,
        contentType: MediaType("File", extension),
      ),
    });

    _response = await _dio.post("http://<DOMAIN>:4000/user-image", data: formData);

    log("test response");
    log(_response.data.toString());
  }
}
```

to update user, admin should use this api:
```bash
curl -X PUT -H 'Content-Type: application/json' -H 'Authorization: Bearer <TOKEN>' -d '{"name": "ali2", "password": "12345789", "avatar": "/imgs/users/ali2.jpg", "role": "PROJECT_MANAGER"}' http://<DOMAIN>:4000/api/users/4
```
the avatar field in json data which sent to server should contains a valid image url, or uploaded url to the previous uploaded endpoint: http://<DOMAIN>:4000/user-image

to delete user, admin should use this api:
```bash
curl -X DELETE -H 'Authorization: Bearer <TOKEN>' http://<DOMAIN>:4000/api/users/4
```

and the expected result if the user is exists:
```json
{"success":true,"message":"user has been delete"}
```

or if the id of users is not exists of there are an error:
```json
{"success":false,"message":"user 4 not found or internal error"}
```

only admin can manage users, if other role try to manage user, the api returns this message

```json
{"success":false,"message":"user: zaher is under role <viewr> or <project-manager> and cann't delete user"}
```

# Project Model:

the main model of system, we will use these apis:

read all projects:
```bash
curl -X GET -H 'Authorization: Bearer <TOKEN>' http://<DOMAIN>:4000/api/projects
```

if your user's role is admin, the api returns all the projects, if the user's role is project_manager, the api returns the list of projects which created by the authorized user, and if there is no error on server side, the result look like:

```json
[
  {
    "id": 7,
    "name": "ملعب الاتحاد",
    "remark": "ملعب كرة قدم",
    "avatar": "/imgs/projects/project2-1.jpg",
    "status": "WORKING"
  },
  {
    "id": 8,
    "name": "ساحة الحياة",
    "remark": "ساحة وسط المحافظة مزودة بنوافير لضخ المياة وحديقة ازهار",
    "avatar": "/imgs/projects/project3-1.jpg",
    "status": "LATE"
  }
]
```
if there is not authorization token, the result look like: 
```json
{
  "name": "JsonWebTokenError",
  "message": "jwt must be provided"
}
```

if something happened or the user don't have permissions (viewer role) the result will be:
```json
{
  "success": false,
  "message": "user: mayas is under role <viewr> and cann't read projects"
}
```

read specific project, for example project with id: 2
```bash
curl -X GET -H 'Authorization: Bearer <TOKEN>' http://<DOMAIN>:4000/api/projects/2
```
the result's form like the json data below:
```json
{
  "id": 9,
  "name": "مشفى الامل",
  "remark": "مشفى عامل لعلاج جميع الامراض",
  "longitude": 44.302062,
  "latitude": 32.041384,
  "companyName": "شركة تعمير العراق",
  "engineerName": "عادل الحموي",
  "engineerPhone": "09776655",
  "engineerDepartment": "دائرة الهندسة المعمارية",
  "avatar": "/imgs/projects/project4-1.jpg",
  "duration": 180,
  "cost": "1200000000",
  "amountPaid": "400000000",
  "status": "WORKING",
  "viewers": [
    {
      "id": 2,
      "user": {
        "id": 3,
        "name": "mayas",
        "avatar": "/imgs/users/mayas.png"
      }
    },
    {
      "id": 3,
      "user": {
        "id": 2,
        "name": "zaher",
        "avatar": "/imgs/users/zaher.png"
      }
    }
  ],
  "suspends": [],
  "extensions": [],
  "payments": [
    {
      "id": 27,
      "amount": "1000000",
      "paidAt": "2023-01-22T04:13:18.799Z",
      "description": "افتتاح المشروع"
    },
    {
      "id": 28,
      "amount": "3000000",
      "paidAt": "2023-01-22T04:13:18.799Z",
      "description": "بناء الجوائز"
    },
    {
      "id": 29,
      "amount": "4000000",
      "paidAt": "2023-01-22T04:13:18.799Z",
      "description": ""
    }
  ],
  "media": [
    {
      "id": 15,
      "src": "/imgs/projects/project4-2.png",
      "title": "منظر رئيسي"
    },
    {
      "id": 16,
      "src": "/imgs/projects/project4-3.png",
      "title": ""
    }
  ],
  "creator": {
    "id": 1,
    "name": "administrator",
    "avatar": "/imgs/users/admin.png"
  }
}
```
viewers sub-data container list of users who has privelege to view project, and createor sub-data represents the info of user who create the project.


update project:
you will add the field what you need to update only, for example, update excerpt and avatar, and provide the project id
```bash
curl -X PUT -H 'Content-Type: application/json' -H 'Authorization: Bearer <TOKEN>' -d '{"id:" 2, "remark": "new description", "avatar": "/uploads/new-avatar.png", "cost": 340000000, "duration": 360}' http://<DOMAIN>:4000/api/projects/7
```

delete project:
```bash
you should provide the id only
curl -X DELETE -H 'Authorization: Bearer <TOKEN>' http://<DOMAIN>:4000/api/projects/4
```
project has sub items, each project contain media, suspend and payments, each one has a seperate api

## Project viewer
the project viewers is users with the permissions to display project info (read-only), the list of viewers can be displayed by using the project api.
to add user to project as viewer, we should have the user id and the project id and then using the api:
```bash
curl -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer <TOKEN>' -d '{"projectId": 9, "userId": 2}' http://<DOMAIN>:4000/api/viewers 
```
if the user added successfully, the api return this message:
```json
{
  "success": true,
  "message": "project viewer has been created"
}
```
or if there are error, look like the user is added before:
```json
{
  "success": false,
  "message": "server error: <ERROR>"
}
```

to delete the project viewer, we should have viewer id - not user id, you can use this api:
```bash
curl -X DELETE -H 'Content-Type: application/json' -H 'Authorization: Bearer <TOKEN>' http://<DOMAIN>:4000/api/viewers/2 
```
if the operation success, the result should be:
```json
{"success":true,"message":"project viewer has been delete"}
```
## Media
the media is image file for the project, the media file should upload to the server first and use the result path to store it,
to upload media file to the server, we should use this api endpoint: http://<DOMAIN>:4000/project-image
and the app should send the authorization key by header, as the same as sending any other request,
the request type is post, and content type is (multipart/formdata) and the response contain basic informations about uploaded image.
```json
{
  "fieldname":"avatar",
  "originalname":"project-1.jpg",
  "encoding":"7bit",
  "mimetype":"image/jpeg",
  "destination":"dist/uploads/imgs/projects",
  "filename":"img_1674554784746.jpg",
  "path":"/imgs/users/img_1674554784746.jpg",
  "size":13889
}
```
just json the result path with the domain name and port to retrive the image, the supported extensions and type of uploaded image are:
jpeg, jpg, png, gif, svg, and maximum size is 800KB, if the other extensions of file type was uploaded or bigger size than 800KB, the server return an error.

after uploading the image, we should use this api to save the project media:
```bash
curl -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer <TOKEN>' -d '{"projectId": 4, "title": "image title", "src": "/imgs/users/img_1674554784746.jpg", "orderIndex": 40}' http://<url>:4000/api/media
```

if the operation success, the server replay this response:
```json
{
  "success": true,
  "message": "media has been created"
}
```
the title and order index are optional, order index is used to control the order of media image ascending, for example, if your use value 10, the image will be last element in the result array, and if you insert value 5 for other media, it will inserted before it.

if the user's role is VIEWER, so ther server replay this response:
```json
{
  "success": false,
  "message": "user: mayas is under role <VIEWER> and cann't perform operation"
}
```

if the user's role is PROJECT_MANAGER, but he's not the owener of projectId, the server replay this response:
```json
{
  "success": false,
  "message": "user: zaher is under role <PROJECT_MANAGER> and cann't perform operation"
}
```

if the user dosn't provide (src) in the requested data, the server replay this response:
```json
{
  "success": false,
  "message": "src is required for this opeation"
}
```

to read all media that user able to view, we can use this api:
```bash
curl -X GET -H 'Content-Type: application/json' -H 'Authorization: Bearer <TOKEN>'  http://<URL>:4000/api/media
```

the result example is:
```json
[
  {
    "src": "/imgs/projects/project2-1.png",
    "title": "منظر علوي",
    "createdAt": "2023-02-01T07:46:44.732Z",
    "orderIndex": 0,
    "project": {
      "id": 2,
      "name": "ملعب الاتحاد",
      "avatar": "/imgs/projects/project2-1.jpg"
    }
  },
  {
    "src": "/imgs/projects/project2-2.png",
    "title": "منظر جانبي",
    "createdAt": "2023-02-01T07:46:44.732Z",
    "orderIndex": 0,
    "project": {
      "id": 2,
      "name": "ملعب الاتحاد",
      "avatar": "/imgs/projects/project2-1.jpg"
    }
  },
  {
    "src": "/imgs/projects/project4-2.png",
    "title": "منظر رئيسي",
    "createdAt": "2023-02-01T07:46:44.761Z",
    "orderIndex": 0,
    "project": {
      "id": 4,
      "name": "مشفى الامل",
      "avatar": "/imgs/projects/project4-1.jpg"
    }
  },
  {
    "src": "/imgs/projects/project4-3.png",
    "title": "",
    "createdAt": "2023-02-01T07:46:44.761Z",
    "orderIndex": 0,
    "project": {
      "id": 4,
      "name": "مشفى الامل",
      "avatar": "/imgs/projects/project4-1.jpg"
    }
  },
  {
    "src": "new image from zaher.jpg",
    "title": "any title from zaher",
    "createdAt": "2023-02-01T07:52:38.712Z",
    "orderIndex": 50,
    "project": {
      "id": 2,
      "name": "ملعب الاتحاد",
      "avatar": "/imgs/projects/project2-1.jpg"
    }
  },
  {
    "src": "new image from zaher.jpg",
    "title": "any title from zaher",
    "createdAt": "2023-02-01T07:53:10.630Z",
    "orderIndex": 50,
    "project": {
      "id": 3,
      "name": "ساحة الحياة",
      "avatar": "/imgs/projects/project3-1.jpg"
    }
  }
]
```

to api for delete media:
```bash
curl -X DELETE -H 'Content-Type: application/json' -H 'Authorization: Bearer <TOKEN>' http://<URL>:4000/api/media/7
```

```json
{
  "success": true,
  "message": "media has been delete"
}
```

if there is no privelege to delete medis:
```json
{
  "success": false,
  "message": "user: mayas is under role <VIEWER> and cann't perform operation"
}
```

if the media is not exists, or user cann't delete media (not project owner):
```json
{
  "success": false,
  "message": "media 7 not found or user: zaher is cann't delete the media"
}
```

## Suspend
the suspend is record contain file and date range for the project, the suspend file should upload to the server first and use the result path to store it,
to upload suspend file to the server, we should use this api endpoint: http://<DOMAIN>:4000/project-docs
and the app should send the authorization key by header, as the same as sending any other request, the key is (doc) instead of (avatar)
the request type is post, and content type is (multipart/formdata) and the response contain basic informations about uploaded image.
```json
{
  "fieldname":"doc",
  "originalname":"project-1.pdf",
  "encoding":"7bit",
  "mimetype":"applicatoin/pdf",
  "destination":"dist/uploads/docs/project-1.pdf",
  "filename":"doc_1674554784746.pdf",
  "path":"/docs/doc_1674554784746.pdf",
  "size":13889
}
```
just json the result path with the domain name and port to retrive the image, the supported extensions and type of uploaded document are:
doc, docx, txt, xls, xlsx, pdf, and maximum size is 5MB, if the other extensions of file type was uploaded or bigger size than 5MB, the server return an error.

after uploading the image, we should use this api to save the project suspend:
```bash
curl -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer <TOKEN>' -d '{"projectId": 4, "fromDate": "12/10/2019", "toDate": "12/25/2019" ,"documentUrl": "/docs/doc_1674554784746.pdf", "description": "any desc"}' http://<URL>:4000/api/suspends
```
the date format is US-date format: MM/dd/YYYY.

if the operation success, the server replay this response:
```json
{
  "success": true,
  "message": "suspend has been created"
}
```

if the user's role is VIEWER, so ther server replay this response:
```json
{
  "success": false,
  "message": "user: mayas is under role <VIEWER> and cann't perform operation"
}
```

if the user's role is PROJECT_MANAGER, but he's not the owener of projectId, the server replay this response:
```json
{
  "success": false,
  "message": "user: zaher is under role <PROJECT_MANAGER> and cann't perform operation"
}
```

if the user dosn't provide one of (projectId, fromDate, toDate) in the requested data, the server replay this response:
```json
{
  "success": false,
  "message": "projectId, fromDate, toDate are required for this operation"
}
```

to read all suspend that user able to view, we can use this api:
```bash
curl -X GET -H 'Content-Type: application/json' -H 'Authorization: Bearer <TOKEN>'  http://<URL>:4000/api/suspends
```

the result example is:
```json
[
  {
    "id": 1,
    "documentUrl": "/docs/doc-s-1.docx",
    "fromDate": "2023-02-14T22:00:00.000Z",
    "toDate": "2023-03-11T22:00:00.000Z",
    "description": "نقص مواد",
    "project": {
      "id": 1,
      "name": "نقابة المهندسين",
      "avatar": "/imgs/projects/project1-1.jpg"
    }
  },
  {
    "id": 2,
    "documentUrl": "/docs/doc-s-2.docx",
    "fromDate": "2023-05-24T21:00:00.000Z",
    "toDate": "2023-06-30T21:00:00.000Z",
    "description": "ظروف جوية سيئة",
    "project": {
      "id": 1,
      "name": "نقابة المهندسين",
      "avatar": "/imgs/projects/project1-1.jpg"
    }
  },
  {
    "id": 3,
    "documentUrl": "/docs/doc-s-3.docx",
    "fromDate": "2023-06-04T21:00:00.000Z",
    "toDate": "2023-08-10T21:00:00.000Z",
    "description": "تسريح عدد كبير من موظفي الشركة",
    "project": {
      "id": 2,
      "name": "ملعب الاتحاد",
      "avatar": "/imgs/projects/project2-1.jpg"
    }
  },
  {
    "id": 4,
    "documentUrl": "/docs/doc-s-4.docx",
    "fromDate": "2023-02-11T22:00:00.000Z",
    "toDate": "2023-04-11T21:00:00.000Z",
    "description": "عدم توفر المواد الاولية",
    "project": {
      "id": 3,
      "name": "ساحة الحياة",
      "avatar": "/imgs/projects/project3-1.jpg"
    }
  },
  {
    "id": 5,
    "documentUrl": "/docs/doc-s-5.docx",
    "fromDate": "2023-04-14T21:00:00.000Z",
    "toDate": "2023-04-30T21:00:00.000Z",
    "description": "تغير سعر الصرف",
    "project": {
      "id": 3,
      "name": "ساحة الحياة",
      "avatar": "/imgs/projects/project3-1.jpg"
    }
  },
  {
    "id": 6,
    "documentUrl": null,
    "fromDate": "2023-05-14T21:00:00.000Z",
    "toDate": "2023-07-11T21:00:00.000Z",
    "description": "توقف قانوني",
    "project": {
      "id": 3,
      "name": "ساحة الحياة",
      "avatar": "/imgs/projects/project3-1.jpg"
    }
  },
  {
    "id": 7,
    "documentUrl": "/docs/doc-s-6.docx",
    "fromDate": "2023-03-22T22:00:00.000Z",
    "toDate": "2023-06-05T21:00:00.000Z",
    "description": "صعوبة توفر المحروقات لنقل المواد",
    "project": {
      "id": 5,
      "name": "مدرسة التفوق للمتميزين",
      "avatar": "/imgs/projects/project5-1.jpg"
    }
  },
  {
    "id": 8,
    "documentUrl": "/docs/doc_1674554784746.pdf",
    "fromDate": "2019-12-14T22:00:00.000Z",
    "toDate": "2019-12-29T22:00:00.000Z",
    "description": "any desc",
    "project": {
      "id": 4,
      "name": "مشفى الامل",
      "avatar": "/imgs/projects/project4-1.jpg"
    }
  },
  {
    "id": 9,
    "documentUrl": "/docs/zzz.pdf",
    "fromDate": "2022-01-07T22:00:00.000Z",
    "toDate": "2022-01-09T22:00:00.000Z",
    "description": "zaher doc",
    "project": {
      "id": 3,
      "name": "ساحة الحياة",
      "avatar": "/imgs/projects/project3-1.jpg"
    }
  }
]
```

to api for delete suspend:
```bash
curl -X DELETE -H 'Content-Type: application/json' -H 'Authorization: Bearer <TOKEN>' http://<URL>:4000/api/suspends/7
```

```json
{
  "success": true,
  "message": "suspend has been delete"
}
```

if there is no privelege to delete medis:
```json
{
  "success": false,
  "message": "user: mayas is under role <VIEWER> and cann't perform operation"
}
```

if the suspend is not exists, or user cann't delete suspend (not project owner):
```json
{
  "success": false,
  "message": "suspend 7 not found or user: zaher is cann't delete the suspend"
}
```

## Extensions
the extension is record contain file and extendion duration period (in hours, days, month...) for the project, the extension file should upload to the server first and use the result path to store it,
to upload extension file to the server, we should use this api endpoint: http://<DOMAIN>:4000/project-docs
and the app should send the authorization key by header, as the same as sending any other request, the key is (doc) instead of (avatar)
the request type is post, and content type is (multipart/formdata) and the response contain basic informations about uploaded image.
```json
{
  "fieldname":"doc",
  "originalname":"project-1.pdf",
  "encoding":"7bit",
  "mimetype":"applicatoin/pdf",
  "destination":"dist/uploads/docs/project-1.pdf",
  "filename":"doc_1674554784746.pdf",
  "path":"/docs/doc_1674554784746.pdf",
  "size":13889
}
```
just json the result path with the domain name and port to retrive the image, the supported extensions and type of uploaded document are:
doc, docx, txt, xls, xlsx, pdf, and maximum size is 5MB, if the other extensions of file type was uploaded or bigger size than 5MB, the server return an error.

after uploading the image, we should use this api to save the project extension:
```bash
curl -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer <TOKEN>' -d '{"projectId": 2, "byDuration": 350 ,"documentUrl": "/docs/doc_1674554784746.pdf", "description": "any desc"}' http://<URL>:4000/api/extensions
```

if the operation success, the server replay this response:
```json
{
  "success": true,
  "message": "extension has been created"
}
```

if the user's role is VIEWER, so ther server replay this response:
```json
{
  "success": false,
  "message": "user: mayas is under role <VIEWER> and cann't perform operation"
}
```

if the user's role is PROJECT_MANAGER, but he's not the owener of projectId, the server replay this response:
```json
{
  "success": false,
  "message": "user: zaher is under role <PROJECT_MANAGER> and cann't perform operation"
}
```

if the user dosn't provide one of byDuration or project idin the requested data, the server replay this response:
```json
{
  "success": false,
  "message": "projectId, byDuration are required for this operation"
}
```

to read all extension that user able to view, we can use this api:
```bash
curl -X GET -H 'Content-Type: application/json' -H 'Authorization: Bearer <TOKEN>'  http://<URL>:4000/api/extensions
```

the result example is:
```json
[
  {
    "id": 1,
    "documentUrl": "/docs/doc1.docx",
    "byDuration": 30,
    "description": "تمديد اولي",
    "project": {
      "id": 1,
      "name": "نقابة المهندسين",
      "avatar": "/imgs/projects/project1-1.jpg"
    }
  },
  {
    "id": 2,
    "documentUrl": "/docs/doc2.docx",
    "byDuration": 22,
    "description": "تمديد غير مشروع",
    "project": {
      "id": 2,
      "name": "ملعب الاتحاد",
      "avatar": "/imgs/projects/project2-1.jpg"
    }
  },
  {
    "id": 3,
    "documentUrl": "/docs/doc3.docx",
    "byDuration": 17,
    "description": "تمديد بسبب الاحوال الجوية",
    "project": {
      "id": 2,
      "name": "ملعب الاتحاد",
      "avatar": "/imgs/projects/project2-1.jpg"
    }
  },
  {
    "id": 4,
    "documentUrl": "/docs/doc_1674554784746.pdf",
    "byDuration": 350,
    "description": "any desc",
    "project": {
      "id": 2,
      "name": "ملعب الاتحاد",
      "avatar": "/imgs/projects/project2-1.jpg"
    }
  }
]
```

to api for delete extension:
```bash
curl -X DELETE -H 'Content-Type: application/json' -H 'Authorization: Bearer <TOKEN>' http://<URL>:4000/api/extensions/7
```

```json
{
  "success": true,
  "message": "extension has been delete"
}
```

if there is no privelege to delete medis:
```json
{
  "success": false,
  "message": "user: mayas is under role <VIEWER> and cann't perform operation"
}
```

if the extension is not exists, or user cann't delete extension (not project owner):
```json
{
  "success": false,
  "message": "extension 7 not found or user: zaher is cann't delete the extension"
}
```



## Payments
the payment is record contain money amount and date for the project, to create new payment, we should use this api:
```bash
curl -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer <TOKEN>' -d '{"projectId": 2, "amount": 600000 ,"paidAt": "12/30/2022", "description": "any desc"}' http://<URL>:4000/api/payments
```

if the operation success, the server replay this response:
```json
{
  "success": true,
  "message": "payment has been created"
}
```

if the user's role is VIEWER, so ther server replay this response:
```json
{
  "success": false,
  "message": "user: mayas is under role <VIEWER> and cann't perform operation"
}
```

if the user's role is PROJECT_MANAGER, but he's not the owener of projectId, the server replay this response:
```json
{
  "success": false,
  "message": "user: zaher is under role <PROJECT_MANAGER> and cann't perform operation"
}
```

if the user dosn't provide one of byDuration or project idin the requested data, the server replay this response:
```json
{
  "success": false,
  "message": "projectId, byDuration are required for this operation"
}
```

to read all payment that user able to view, we can use this api:
```bash
curl -X GET -H 'Content-Type: application/json' -H 'Authorization: Bearer <TOKEN>'  http://<URL>:4000/api/payments
```

the result example is:
```json
[
  {
    "id": 5,
    "amount": "900000",
    "paidAt": "2023-02-01T07:46:44.732Z",
    "description": "دفعة اولية",
    "project": {
      "id": 2,
      "name": "ملعب الاتحاد",
      "avatar": "/imgs/projects/project2-1.jpg"
    }
  },
  {
    "id": 6,
    "amount": "1200000",
    "paidAt": "2023-02-01T07:46:44.732Z",
    "description": "دفعة اضافية",
    "project": {
      "id": 2,
      "name": "ملعب الاتحاد",
      "avatar": "/imgs/projects/project2-1.jpg"
    }
  },
  {
    "id": 7,
    "amount": "1000000",
    "paidAt": "2023-02-01T07:46:44.732Z",
    "description": "دفعة مع شراء مواد",
    "project": {
      "id": 2,
      "name": "ملعب الاتحاد",
      "avatar": "/imgs/projects/project2-1.jpg"
    }
  },
  {
    "id": 11,
    "amount": "1000000",
    "paidAt": "2023-02-01T07:46:44.761Z",
    "description": "افتتاح المشروع",
    "project": {
      "id": 4,
      "name": "مشفى الامل",
      "avatar": "/imgs/projects/project4-1.jpg"
    }
  },
  {
    "id": 12,
    "amount": "3000000",
    "paidAt": "2023-02-01T07:46:44.761Z",
    "description": "بناء الجوائز",
    "project": {
      "id": 4,
      "name": "مشفى الامل",
      "avatar": "/imgs/projects/project4-1.jpg"
    }
  },
  {
    "id": 13,
    "amount": "4000000",
    "paidAt": "2023-02-01T07:46:44.761Z",
    "description": "",
    "project": {
      "id": 4,
      "name": "مشفى الامل",
      "avatar": "/imgs/projects/project4-1.jpg"
    }
  }
]
```

to api for delete payment:
```bash
curl -X DELETE -H 'Content-Type: application/json' -H 'Authorization: Bearer <TOKEN>' http://<URL>:4000/api/payments/7
```

```json
{
  "success": true,
  "message": "payment has been delete"
}
```

if there is no privelege to delete medis:
```json
{
  "success": false,
  "message": "user: mayas is under role <VIEWER> and cann't perform operation"
}
```

if the payment is not exists, or user cann't delete payment (not project owner):
```json
{
  "success": false,
  "message": "payment 7 not found or user: zaher is cann't delete the payment"
}
```


## Comments
the comment is text combie with  date for the project, to create new comment, we should use this api:
```bash
curl -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer <TOKEN>' -d '{"projectId": 11, "text": "any test for the comment"}' http://<URL>:4000/api/comments
```

if the operation success, the server replay this response:
```json
{
  "success": true,
  "message": "comment has been created"
}
```

if the user's role is VIEWER, so ther server replay this response:
```json
{
  "success": false,
  "message": "user: mayas is under role <VIEWER> and cann't perform operation"
}
```

if the user's role is PROJECT_MANAGER, but he's not the owener of projectId, the server replay this response:
```json
{
  "success": false,
  "message": "user: zaher is under role <PROJECT_MANAGER> and cann't perform operation"
}
```

if the user dosn't provide one of byDuration or project idin the requested data, the server replay this response:
```json
{
  "success": false,
  "message": "projectId, byDuration are required for this operation"
}
```

to read all comment that user able to view, we can use this api:
```bash
curl -X GET -H 'Content-Type: application/json' -H 'Authorization: Bearer <TOKEN>'  http://<URL>:4000/api/comments
```

the result example is:
```json
[
  {
    "id": 10,
    "text": "any text",
    "createdAt": "2023-02-02T14:20:46.958Z",
    "project": {
      "id": 12,
      "name": "ملعب الاتحاد",
      "avatar": "/imgs/projects/project2-1.jpg"
    }
  },
  {
    "id": 11,
    "text": "other text",
    "createdAt": "2023-01-02T11:25:49.307Z",
    "project": {
      "id": 12,
      "name": "ملعب الاتحاد",
      "avatar": "/imgs/projects/project2-1.jpg"
    }
  }
]

```

to api for delete comment:
```bash
curl -X DELETE -H 'Content-Type: application/json' -H 'Authorization: Bearer <TOKEN>' http://<URL>:4000/api/comments/7
```

```json
{
  "success": true,
  "message": "comment has been delete"
}
```

if there is no privelege to delete medis:
```json
{
  "success": false,
  "message": "user: mayas is under role <VIEWER> and cann't perform operation"
}
```

if the comment is not exists, or user cann't delete comment (not project owner):
```json
{
  "success": false,
  "message": "comment 7 not found or user: zaher is cann't delete the comment"
}
```