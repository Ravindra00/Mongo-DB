
# 1. Create User in MongoDb

[root@localhost /]# mongo
> show dbs

/*
admin    0.000GB
config   0.000GB
local    0.000GB
*/

# Choose admin Database to create Admin user.
To create user with admin privileges in your MongoDB server.

> use admin

> db.createUser(
             {
               user:"superadmin",
               pwd:"Admin@P@55w0rd",
               roles:[{role:"root",db:"admin"}]
              }
        )

/*
Successfully added user: {
        "user" : "superadmin",
        "roles" : [
                {
                        "role" : "root",
                        "db" : "admin"
                }
        ]
}
*/

# To check the User added.

> db.getUsers()

/*
[
        {
                "_id" : "test.superadmin",
                "userId" : UUID("a7cab1f4-cca0-420c-ae98-49b74d05fbb0"),
                "user" : "superadmin",
                "db" : "test",
                "roles" : [
                        {
                                "role" : "root",
                                "db" : "admin"
                        }
                ],
                "mechanisms" : [
                        "SCRAM-SHA-1",
                        "SCRAM-SHA-256"
                ]
        }
]
*/

# To authenticate the newly created User

> db.auth('superadmin','Admin@P@55w0rd')

/*
1
*/
# Create Database 

> use EightSquare
/*
switched to db EightSquare
*/

# Create Collection

> db.createCollection("Test")
/*
{ "ok" : 1 }
*/

> db.getCollectionNames()
/*
[ "Test" ]
*/


> show dbs
/*
EightSquare  0.000GB
admin        0.000GB
config       0.000GB
local        0.000GB
*/

> db.getUsers()
/*
No Users shows
*/



/*
To create database specific users, that user will have access to that database only.
You can also specify access level for that user on database.
For example we are creating a user account with read write access on EightSquare database.
*/

# Create User User1

> db.createUser(
              {
                user:"User1",
                pwd:"User1@P@55w0rd",
                roles:[{role:"readWrite",db:"EightSquare"}]
              }
         )


> db.getUsers()
/*
[
        {
                "_id" : "EightSquare.User1",
                "userId" : UUID("59c7ef7a-f891-413c-a5d1-dd3fd91fe606"),
                "user" : "User1",
                "db" : "EightSquare",
                "roles" : [
                        {
                                "role" : "readWrite",
                                "db" : "EightSquare"
                        }
                ],
                "mechanisms" : [
                        "SCRAM-SHA-1",
                        "SCRAM-SHA-256"
                ]
        }
]
*/

# Create User User2

> db.createUser(
              {
                user:"User2",
                pwd:"User2@P@55w0rd",
                roles:[{role:"readWrite",db:"EightSquare"}]
              }
         )




> db.getUsers()
/*
[
        {
                "_id" : "EightSquare.User1",
                "userId" : UUID("59c7ef7a-f891-413c-a5d1-dd3fd91fe606"),
                "user" : "User1",
                "db" : "EightSquare",
                "roles" : [
                        {
                                "role" : "readWrite",
                                "db" : "EightSquare"
                        }
                ],
                "mechanisms" : [
                        "SCRAM-SHA-1",
                        "SCRAM-SHA-256"
                ]
        },
        {
                "_id" : "EightSquare.User2",
                "userId" : UUID("bcfc6964-6a44-4109-b95d-d4418b55597a"),
                "user" : "User2",
                "db" : "EightSquare",
                "roles" : [
                        {
                                "role" : "readWrite",
                                "db" : "EightSquare"
                        }
                ],
                "mechanisms" : [
                        "SCRAM-SHA-1",
                        "SCRAM-SHA-256"
                ]
        }
]
*/


# Drop User User2

> db.dropUser("User2")
/*
true
*/
> db.getUsers()
/*
[
        {
                "_id" : "EightSquare.User1",
                "userId" : UUID("59c7ef7a-f891-413c-a5d1-dd3fd91fe606"),
                "user" : "User1",
                "db" : "EightSquare",
                "roles" : [
                        {
                                "role" : "readWrite",
                                "db" : "EightSquare"
                        }
                ],
                "mechanisms" : [
                        "SCRAM-SHA-1",
                        "SCRAM-SHA-256"
                ]
        }
]
*/

# Authenticate User1 for EightSquare Database

> db.auth('User1','User1@P@55w0rd')
/*
1
*/

