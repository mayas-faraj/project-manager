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

    _response = await _dio.post("http://<URL>:4000/user-image", data: formData);

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
curl -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer '$at -d '{"projectId": 9, "userId": 2}' http://$url:4000/api/viewers 
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
curl -X DELETE -H 'Content-Type: application/json' -H 'Authorization: Bearer '$at http://$url:4000/api/viewers/2 
```
if the operation success, the result should be:
```json
{"success":true,"message":"project viewer has been delete"}
```
## Media
comming soon...

## Suspend
comming soon...

## Payment
comming soon...