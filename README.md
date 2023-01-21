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
    "companyName": "شركة الأفق الدولية",
    "engineerName": "حسان الثابت",
    "engineerPhone": "0933123123",
    "engineerDepartment": "قسم البحوث العلمية",
    "avatar": "/uploads/imgs/project2-1.jpg",
    "duration": 450,
    "cost": "1100000000",
    "amountPaid": "340000000",
    "longitude": 44.309062,
    "latitude": 32.041784,
    "status": "WORKING",
    "createdAt": "2023-01-18T18:38:37.823Z",
    "updatedAt": "2023-01-18T18:38:37.823Z"
  },
  {
    "id": 8,
    "name": "ساحة الحياة",
    "remark": "ساحة وسط المحافظة مزودة بنوافير لضخ المياة وحديقة ازهار",
    "companyName": "شركة جلجامش",
    "engineerName": "علي الاسمر",
    "engineerPhone": "09656578",
    "engineerDepartment": "دائرة التعمير",
    "avatar": "/uploads/imgs/project3-1.jpg",
    "duration": 250,
    "cost": "200000000",
    "amountPaid": "100000000",
    "longitude": 44.309062,
    "latitude": 32.041784,
    "status": "LATE",
    "createdAt": "2023-01-18T18:38:37.846Z",
    "updatedAt": "2023-01-18T18:38:37.846Z"
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

## Media
comming soon...

## Suspend
comming soon...

## Payment
comming soon...