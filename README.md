# User Model

## introduction

in the system, there are test users:
user: administrator, password: 123456789, role: admin
user: zaher, password: 12345, role: project manager
user: mayas, password: 123, role: viewer

the api for login:

```bash
curl -X POST -H 'Content-Type: application/json' -d '{"user": "mayas", "password": "123"}' http://localhost:4000/login
```

the result of api:

```json
{
"message": "user is empty",
"token": "",
"status": false
}

{
"message": "password is empty",
"token": "",
"status": false
}

{
"message": "password is not valid",
"token": "",
"status": false
}

{
"message": "login success",
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtIjoibWF5YXMiLCJyb2wiOiJWSUVXRVIiLCJleHAiOjE2NzM2NzA1NTUuNDUxLCJpYXQiOjE2NzM2NjY5NTV9.sNUIGhRGlxVBt50TSET1eiRP8Jk5eg3beQIuUK7a46U",
"status": true
}
```

when login success, we should send send token in every api request by putting it in header (Authorization: Bearer <token>)
for example, to read all users:

```bash
curl -X GET -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtIjoibWF5YXMiLCJyb2wiOiJWSUVXRVIiLCJleHAiOjE2NzM2NzA1NTUuNDUxLCJpYXQiOjE2NzM2NjY5NTV9.sNUIGhRGlxVBt50TSET1eiRP8Jk5eg3beQIuUK7a46' http://localhost:4000/api/users
```


# Compay Model:

System contains projects that execute the project, to access project api, we will use these apis:

read all projects:
curl -X GET http://claudiopacificoambassador.com:4000/api/projects

read specific project, for example project with id: 2
curl -X GET http://claudiopacificoambassador.com:4000/api/projects/2

create project:
curl -X POST -H 'Content-Type: application/json' -d '{"name": "new project", "excerpt": "any description", "avatar": "/uploads/avatar.png" }' http://claudiopacificoambassador.com:4000/api/projects

update project:
you will add the field what you need to update only, for example, update excerpt and avatar, and provide the project id
curl -X PUT -H 'Content-Type: application/json' -d '{"id:" 2, "excerpt": "new description", "avatar": "/uploads/new-avatar.png" }' http://claudiopacificoambassador.com:4000/api/projects

delete project:
you should provide the id only
curl -X DELETE -H 'Content-Type: application/json' -d '{"id:" 2 }' http://claudiopacificoambassador.com:4000/api/projects

# Department Model:

System contains engineers that responsible to specific project, each engineer belong to to department

read all departments:
curl -X GET http://claudiopacificoambassador.com:4000/api/departments

read specific department, for example department with id: 2
curl -X GET http://claudiopacificoambassador.com:4000/api/departments/2

create department:
curl -X POST -H 'Content-Type: application/json' -d '{"name": "new department", "excerpt": "any description", "avatar": "/uploads/avatar.png" }' http://claudiopacificoambassador.com:4000/api/departments

update department:
you will add the field what you need to update only, for example, update excerpt and avatar, and provide the department id
curl -X PUT -H 'Content-Type: application/json' -d '{"id:" 2, "excerpt": "new description", "avatar": "/uploads/new-avatar.png" }' http://claudiopacificoambassador.com:4000/api/departments

delete department:
you should provide the id only
curl -X DELETE -H 'Content-Type: application/json' -d '{"id:" 2 }' http://claudiopacificoambassador.com:4000/api/departments



# Engineer Model:



System contains engineers that execute the project, to access engineer api, we will use these apis:

read all engineers:

curl -X GET http://claudiopacificoambassador.com:4000/api/engineers

read specific engineer, for example engineer with id: 2
curl -X GET http://claudiopacificoambassador.com:4000/api/engineers/2

create engineer:
curl -X POST -H 'Content-Type: application/json' -d '{"name": "new engineer", "excerpt": "any description", "avatar": "/uploads/avatar.png", "departmentId": 3 }' http://claudiopacificoambassador.com:4000/api/engineers

update engineer:
you will add the field what you need to update only, for example, update excerpt and avatar, and provide the engineer id
curl -X PUT -H 'Content-Type: application/json' -d '{"id:" 2, "excerpt": "new description", "avatar": "/uploads/new-avatar.png" }' http://claudiopacificoambassador.com:4000/api/engineers

delete engineer:
you should provide the id only
curl -X DELETE -H 'Content-Type: application/json' -d '{"id:" 2 }' http://claudiopacificoambassador.com:4000/api/engineers

# Project Model:

the main model of system, we will use these apis:

read all projects:
curl -X GET http://claudiopacificoambassador.com:4000/api/projects

read specific project, for example project with id: 2
curl -X GET http://claudiopacificoambassador.com:4000/api/projects/2

delete project:
you should provide the id only
curl -X DELETE -H 'Content-Type: application/json' -d '{"id:" 2 }' http://claudiopacificoambassador.com:4000/api/projects
