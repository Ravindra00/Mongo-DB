MongoDB is a NoSQL enterprise-class database that offers high performance, high availability, and automatic scaling. 
On a NoSQL database, so you can't use SQL (Structured Query Language) to insert and retrieve data, 
and it does not store data in tables like MySQL or Postgres. 
Data is stored in a "document" structure in JSON format (in MongoDB called BSON) instead. 
MongoDB was first introduced in 2009 and is currently developed by the company MongoDB Inc.

In this tutorial, I will guide you step-by-step build a replica set in MongoDB. 
We will use 3 server nodes with CentOS 7 installed on them and then install and configure MongoDB.

Prerequisites:
Three Servers with CentOS 7 installed
Root privileges

Connect to all server nodes with ssh.
Node1 : 192.168.19.134 centosms
Node2 : 192.168.19.132 sqlnode1
Node3 : 192.168.19.133 sqlnode2

Step 1 - Prepare the server

Install MongoDB in all the Nodes (1. Install MongoDB in Linux)
Install firewalld on all Nodes

Edit the hosts file with vi.
[root@centosmn ~]# vim /etc/hosts
[root@sqlnode1 ~]# vim /etc/hosts
[root@sqlnode2 ~]# vim /etc/hosts


yum -y install firewalld

systemctl start firewalld
systemctl enable firewalld


--Node1------------------------------------------------------

[root@centosmn ~]# firewall-cmd --permanent --add-port=22/tcp
success

[root@centosmn ~]# firewall-cmd --permanent --add-port=27017/tcp
success

[root@centosmn ~]# firewall-cmd --reload
success

--Node2------------------------------------------------------
[root@sqlnode1 ~]# firewall-cmd --permanent --add-port=22/tcp
success

[root@sqlnode1 ~]# firewall-cmd --permanent --add-port=27017/tcp
success

[root@sqlnode1 ~]# firewall-cmd --reload
success


--Node3------------------------------------------------------
[root@sqlnode2 ~]# firewall-cmd --permanent --add-port=22/tcp
success

[root@sqlnode2 ~]# firewall-cmd --permanent --add-port=27017/tcp
success

[root@sqlnode2 ~]# firewall-cmd --reload
success




vim /etc/mongod.conf



net:
  port: 27017
   bindIP: 0.0.0.0
  
  
replication:
  replSetName: "MongoDBRep"  










> rs.initiate()
{
        "info2" : "no configuration specified. Using a default configuration for the set",
        "me" : "centosmn:27017",
        "ok" : 1,
        "operationTime" : Timestamp(1559814082, 1),
        "$clusterTime" : {
                "clusterTime" : Timestamp(1559814082, 1),
                "signature" : {
                        "hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
                        "keyId" : NumberLong(0)
                }
        }
}
MongoDBRep:OTHER> rs.add("sqlnode1")
{
        "ok" : 1,
        "operationTime" : Timestamp(1559814102, 1),
        "$clusterTime" : {
                "clusterTime" : Timestamp(1559814102, 1),
                "signature" : {
                        "hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
                        "keyId" : NumberLong(0)
                }
        }
}
MongoDBRep:PRIMARY> rs.add("sqlnode2")
{
        "ok" : 1,
        "operationTime" : Timestamp(1559814113, 1),
        "$clusterTime" : {
                "clusterTime" : Timestamp(1559814113, 1),
                "signature" : {
                        "hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
                        "keyId" : NumberLong(0)
                }
        }
}





MongoDBRep:PRIMARY> rs.status()
{
        "set" : "MongoDBRep",
        "date" : ISODate("2019-06-06T09:42:21.564Z"),
        "myState" : 1,
        "term" : NumberLong(1),
        "syncingTo" : "",
        "syncSourceHost" : "",
        "syncSourceId" : -1,
        "heartbeatIntervalMillis" : NumberLong(2000),
        "optimes" : {
                "lastCommittedOpTime" : {
                        "ts" : Timestamp(1559814134, 1),
                        "t" : NumberLong(1)
                },
                "readConcernMajorityOpTime" : {
                        "ts" : Timestamp(1559814134, 1),
                        "t" : NumberLong(1)
                },
                "appliedOpTime" : {
                        "ts" : Timestamp(1559814134, 1),
                        "t" : NumberLong(1)
                },
                "durableOpTime" : {
                        "ts" : Timestamp(1559814134, 1),
                        "t" : NumberLong(1)
                }
        },
        "lastStableCheckpointTimestamp" : Timestamp(1559814084, 2),
        "members" : [
                {
                        "_id" : 0,
                        "name" : "centosmn:27017",
                        "health" : 1,
                        "state" : 1,
                        "stateStr" : "PRIMARY",
                        "uptime" : 281,
                        "optime" : {
                                "ts" : Timestamp(1559814134, 1),
                                "t" : NumberLong(1)
                        },
                        "optimeDate" : ISODate("2019-06-06T09:42:14Z"),
                        "syncingTo" : "",
                        "syncSourceHost" : "",
                        "syncSourceId" : -1,
                        "infoMessage" : "could not find member to sync from",
                        "electionTime" : Timestamp(1559814082, 2),
                        "electionDate" : ISODate("2019-06-06T09:41:22Z"),
                        "configVersion" : 3,
                        "self" : true,
                        "lastHeartbeatMessage" : ""
                },
                {
                        "_id" : 1,
                        "name" : "sqlnode1:27017",
                        "health" : 1,
                        "state" : 2,
                        "stateStr" : "SECONDARY",
                        "uptime" : 39,
                        "optime" : {
                                "ts" : Timestamp(1559814134, 1),
                                "t" : NumberLong(1)
                        },
                        "optimeDurable" : {
                                "ts" : Timestamp(1559814134, 1),
                                "t" : NumberLong(1)
                        },
                        "optimeDate" : ISODate("2019-06-06T09:42:14Z"),
                        "optimeDurableDate" : ISODate("2019-06-06T09:42:14Z"),
                        "lastHeartbeat" : ISODate("2019-06-06T09:42:21.495Z"),
                        "lastHeartbeatRecv" : ISODate("2019-06-06T09:42:20.020Z"),
                        "pingMs" : NumberLong(2),
                        "lastHeartbeatMessage" : "",
                        "syncingTo" : "centosmn:27017",
                        "syncSourceHost" : "centosmn:27017",
                        "syncSourceId" : 0,
                        "infoMessage" : "",
                        "configVersion" : 3
                },
                {
                        "_id" : 2,
                        "name" : "sqlnode2:27017",
                        "health" : 1,
                        "state" : 2,
                        "stateStr" : "SECONDARY",
                        "uptime" : 28,
                        "optime" : {
                                "ts" : Timestamp(1559814134, 1),
                                "t" : NumberLong(1)
                        },
                        "optimeDurable" : {
                                "ts" : Timestamp(1559814134, 1),
                                "t" : NumberLong(1)
                        },
                        "optimeDate" : ISODate("2019-06-06T09:42:14Z"),
                        "optimeDurableDate" : ISODate("2019-06-06T09:42:14Z"),
                        "lastHeartbeat" : ISODate("2019-06-06T09:42:21.496Z"),
                        "lastHeartbeatRecv" : ISODate("2019-06-06T09:42:19.721Z"),
                        "pingMs" : NumberLong(2),
                        "lastHeartbeatMessage" : "",
                        "syncingTo" : "sqlnode1:27017",
                        "syncSourceHost" : "sqlnode1:27017",
                        "syncSourceId" : 1,
                        "infoMessage" : "",
                        "configVersion" : 3
                }
        ],
        "ok" : 1,
        "operationTime" : Timestamp(1559814134, 1),
        "$clusterTime" : {
                "clusterTime" : Timestamp(1559814134, 1),
                "signature" : {
                        "hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
                        "keyId" : NumberLong(0)
                }
        }
}




MongoDBRep:PRIMARY> rs.isMaster()
{
        "hosts" : [
                "centosmn:27017",
                "sqlnode1:27017",
                "sqlnode2:27017"
        ],
        "setName" : "MongoDBRep",
        "setVersion" : 3,
        "ismaster" : true,
        "secondary" : false,
        "primary" : "centosmn:27017",
        "me" : "centosmn:27017",
        "electionId" : ObjectId("7fffffff0000000000000001"),
        "lastWrite" : {
                "opTime" : {
                        "ts" : Timestamp(1559814184, 1),
                        "t" : NumberLong(1)
                },
                "lastWriteDate" : ISODate("2019-06-06T09:43:04Z"),
                "majorityOpTime" : {
                        "ts" : Timestamp(1559814184, 1),
                        "t" : NumberLong(1)
                },
                "majorityWriteDate" : ISODate("2019-06-06T09:43:04Z")
        },
        "maxBsonObjectSize" : 16777216,
        "maxMessageSizeBytes" : 48000000,
        "maxWriteBatchSize" : 100000,
        "localTime" : ISODate("2019-06-06T09:43:06.438Z"),
        "logicalSessionTimeoutMinutes" : 30,
        "minWireVersion" : 0,
        "maxWireVersion" : 7,
        "readOnly" : false,
        "ok" : 1,
        "operationTime" : Timestamp(1559814184, 1),
        "$clusterTime" : {
                "clusterTime" : Timestamp(1559814184, 1),
                "signature" : {
                        "hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
                        "keyId" : NumberLong(0)
                }
        }
}


--Node1------------------------------------------------------

MongoDBRep:PRIMARY> cls

MongoDBRep:PRIMARY> use lemp
switched to db lemp

MongoDBRep:PRIMARY> db.stack.save(
... {
...     "desc": "LEMP Stack",
...     "apps":  ["Linux", "Nginx", "MySQL", "PHP"],
... })
WriteResult({ "nInserted" : 1 })



--Node2------------------------------------------------------

MongoDBRep:SECONDARY> rs.slaveOk()

MongoDBRep:SECONDARY> show dbs
admin   0.000GB
config  0.000GB
lemp    0.000GB
local   0.000GB

MongoDBRep:SECONDARY> use lemp
switched to db lemp

MongoDBRep:SECONDARY> show collections
stack

MongoDBRep:SECONDARY> db.stack.find()
{ "_id" : ObjectId("5cf8e08088ecc5baadfc5c74"), "desc" : "LEMP Stack", "apps" : [ "Linux", "Nginx", "MySQL", "PHP" ] }

--Node3------------------------------------------------------

MongoDBRep:SECONDARY> rs.slaveOk()

MongoDBRep:SECONDARY> show dbs
admin   0.000GB
config  0.000GB
lemp    0.000GB
local   0.000GB

MongoDBRep:SECONDARY> use lemp
switched to db lemp

MongoDBRep:SECONDARY> show collections
stack

MongoDBRep:SECONDARY> db.stack.find()
{ "_id" : ObjectId("5cf8e08088ecc5baadfc5c74"), "desc" : "LEMP Stack", "apps" : [ "Linux", "Nginx", "MySQL", "PHP" ] }


References : https://www.howtoforge.com/tutorial/mongodb-replication-on-centos-7/
