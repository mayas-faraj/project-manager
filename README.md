# introduction

in the system, there are test users:

* user: **administrator**, password: **123456789**, role: admin
* user: **zaher**, password: **12345**, role: project manager
* user: **mayas**, password: **123**, role: viewer

the api for login:

```bash
curl -X POST -H 'Content-Type: application/json' -d '{"user": "mayas", "password": "123"}' http://localhost:4000/login
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
curl -X GET -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtIjoibWF5YXMiLCJyb2wiOiJWSUVXRVIiLCJleHAiOjE2NzM2NzA1NTUuNDUxLCJpYXQiOjE2NzM2NjY5NTV9.sNUIGhRGlxVBt50TSET1eiRP8Jk5eg3beQIuUK7a46' http://localhost:4000/api/users
```

after login in, admin can update any user name or password by using api:
```bash
curl -X PUT -H 'Content-Type: application/json' -H 'Authorization: Bearer <TOKEN>' -d '{"name": "zaher-updated", "password": "12345-updated"}' http://$url:4000/api/users/2
```

or the user can update his password or login name by using this api (setting user id to 0)
```bash
curl -X PUT -H 'Content-Type: application/json' -H 'Authorization: Bearer <TOKEN>' -d '{"name": "zaher-updated", "password": "12345-updated"}' http://$url:4000/api/users/0
```

if the user forget his password, the admin should update it

# Compay Model:

System contains projects that execute the project, to access project api, we will use these apis:

read all projects:
```bash
curl -X GET http://claudiopacificoambassador.com:4000/api/projects
```


read specific project, for example project with id: 2
```bash
curl -X GET -H 'Authorization: Bearer <TOKEN>' http://claudiopacificoambassador.com:4000/api/projects/2
```

create project:
```bash
curl -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer <TOKEN>' -d '{"name": "new project", "excerpt": "any description", "avatar": "/uploads/avatar.png" }' http://claudiopacificoambassador.com:4000/api/projects
```

update project:
you will add the field what you need to update only, for example, update excerpt and avatar, and provide the project id

```bash
curl -X PUT -H 'Content-Type: application/json' -H 'Authorization: Bearer <TOKEN>' -d '{"excerpt": "new description", "avatar": "/uploads/new-avatar.png" }' http://claudiopacificoambassador.com:4000/api/projects/2
```

delete project:
you should provide the id only
```bash
curl -X DELETE -H 'Authorization: Bearer <TOKEN>' http://claudiopacificoambassador.com:4000/api/projects/6
```

# Department Model:

System contains engineers that responsible to specific project, each engineer belong to to department

read all departments:
```bash
curl -X GET -H 'Authorization: Bearer <TOKEN>' http://claudiopacificoambassador.com:4000/api/departments
```

read specific department, for example department with id: 2
```bash
curl -X GET -H 'Authorization: Bearer <TOKEN>' http://claudiopacificoambassador.com:4000/api/departments/2
```

create department:
```bash
curl -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer <TOKEN>' -d '{"name": "new department", "excerpt": "any description", "avatar": "/uploads/avatar.png" }' http://claudiopacificoambassador.com:4000/api/departments
```

update department:
you will add the field what you need to update only, for example, update excerpt and avatar, and provide the department id

```bash
curl -X PUT -H 'Content-Type: application/json' -H 'Authorization: Bearer <TOKEN>' -d '{"excerpt": "new description", "avatar": "/uploads/new-avatar.png" }' http://claudiopacificoambassador.com:4000/api/departments/4
```

delete department:
you should provide the id only
```bash
curl -X DELETE -H 'Authorization: Bearer <TOKEN>' http://claudiopacificoambassador.com:4000/api/departments
```

# Engineer Model:

System contains engineers that execute the project, to access engineer api, we will use these apis:

read all engineers:
```bash
curl -X GET -H 'Authorization: Bearer <TOKEN>' http://claudiopacificoambassador.com:4000/api/engineers
```

read specific engineer, for example engineer with id: 2
```bash
curl -X GET -H 'Authorization: Bearer <TOKEN>' http://claudiopacificoambassador.com:4000/api/engineers/2
```

create engineer:
the engineer belong to department, so we should provide the department id
```bash
curl -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer <TOKEN>' -d '{"name": "new engineer", "excerpt": "any description", "avatar": "/uploads/avatar.png", "departmentId": 3 }' http://claudiopacificoambassador.com:4000/api/engineers
```

update engineer:
you will add the field what you need to update only, for example, update excerpt and avatar, and provide the engineer id
```bash
curl -X PUT -H 'Content-Type: application/json' -H 'Authorization: Bearer <TOKEN>' -d '{"id:" 2, "excerpt": "new description", "avatar": "/uploads/new-avatar.png" }' http://claudiopacificoambassador.com:4000/api/engineers/7
```

delete engineer:
you should provide the id only
```bash
curl -X DELETE -H 'Authorization: Bearer <TOKEN>' http://claudiopacificoambassador.com:4000/api/engineers/18
```
# Project Model:

the main model of system, we will use these apis:

read all projects:
```bash
curl -X GET -H 'Authorization: Bearer <TOKEN>' http://claudiopacificoambassador.com:4000/api/projects
```

read specific project, for example project with id: 2
```bash
curl -X GET -H 'Authorization: Bearer <TOKEN>' http://claudiopacificoambassador.com:4000/api/projects/2
```
update project:
you will add the field what you need to update only, for example, update excerpt and avatar, and provide the project id
```bash
curl -X PUT -H 'Content-Type: application/json' -H 'Authorization: Bearer <TOKEN>' -d '{"id:" 2, "excerpt": "new description", "avatar": "/uploads/new-avatar.png" }' http://claudiopacificoambassador.com:4000/api/projects/7
```

delete project:
```bash
you should provide the id only
curl -X DELETE -H 'Authorization: Bearer <TOKEN>' http://claudiopacificoambassador.com:4000/api/projects/4
```
project has sub items, each project contain media, suspend and payments, each one has a seperate api

## Media
comming soon...

## Suspend
comming soon...

## Payment
comming soon...