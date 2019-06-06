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

Edit the hosts file with vi.
[root@centosmn ~]# vi /etc/hosts
[root@sqlnode1 ~]# vi /etc/hosts
[root@sqlnode2 ~]# vi /etc/hosts

Paste hosts configuration below on all 3 nodes:

192.168.19.134 centosms
192.168.19.132 sqlnode1
192.168.19.133 sqlnode2
 
 Save the file and exit.

Next, We will disable SELinux by editing the configuration file with vi
 
[root@centosmn ~]# vi /etc/sysconfig/selinux
[root@sqlnode1 ~]# vi /etc/sysconfig/selinux
[root@sqlnode2 ~]# vi /etc/sysconfig/selinux

Change value 'enforcing' to 'disabled'.

SELINUX=disabled

Save and exit, then reboot the servers.

[root@centosmn ~]# reboot
[root@sqlnode1 ~]# reboot
[root@sqlnode2 ~]# reboot
 
 Check the SELinux status with the command.
 
 
[root@centosmn ~]# getenforce
[root@sqlnode1 ~]# getenforce
[root@sqlnode2 ~]# getenforce
 
Make sure you get 'Disabled' as the result

Step 2 - Install MongoDB on All Nodes

Note:
If you want a complete tutorial about 'MongoDB Installation', you see this link below
https://github.com/sumanpantha/Mongo-DB/blob/master/1.%20Install%20Mongo%20DB%20in%20Linux.js.

Step 3 - Configure Firewalld

In the first step, we already disabled SELinux. 
For security reasons, we will now enable firewalld on all nodes and open only the ports that are used by MongoDB and SSH.

Install Firewalld with the yum command.
 
[root@centosmn ~]# yum -y install firewalld
[root@sqlnode1 ~]# yum -y install firewalld
[root@sqlnode2 ~]# yum -y install firewalld

Start firewalld and enable it to start at boot time on all nodes.

systemctl start firewalld
systemctl enable firewalld
 
 Next, open your ssh port and the MongoDB default port 27017 on all nodes.
 
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
 
 
Step 4 - Configure MongoDB Replica Set
/*
A Replica Set is a group of mongod processes in MongoDB that maintain same data and information. 
The Replica Set provides high-availability and fault tolerance for production deployments of the database.

Replication in mongodb is composed of several MongoDB server instances running mongod process, 
only one instance runs as 'PRIMARY', all other instances are 'SECONDARY'. 
Data is written only on the 'PRIMARY' instance, the data sets are then replicated to all 'SECONDARY' instances.

In this step, we will prepare all server nodes to implement the replica sets in MongoDB.
*/
Edit the MongoDB configuration file mongod.conf file with vi on all nodes.

vim /etc/mongod.conf

Change the bindIP to 0.0.0.0 so all the IP can access.
net:
  port: 27017
   bindIP: 0.0.0.0

Next, uncomment replication , and set the replication name to 'MongoDBRep'

replication:
  replSetName: "MongoDBRep" 

Save th file and exit vi

Restart MongoDB on all nodes.

[root@centosmn ~]# systemctl restart mongod
[root@sqlnode1 ~]# systemctl restart mongod
[root@sqlnode2 ~]# systemctl restart mongod
 
 
 Now check mongodb and makesure it's running on the server ipadress, not localhost ipaddress.
 
[root@centosmn ~]# netstat -plntu
[root@sqlnode1 ~]# netstat -plntu
[root@sqlnode2 ~]# netstat -plntu

Step 5 - MongoDB Replica Set initiate

In this step, we will create the replica set. 
We will use the 'centosmn' server as 'PRIMARY' node, and 'sqlnode1' and 'sqlnode2' as 'SECONDARY' nodes.
 
Login to the 'centosmn' server and start the mongo shell.

[root@centosmn ~]# mongo
 
 Initiate the replica set from the 'centosmn' server with the query below.
 
 > rs.initiate()
 /*
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
*/
 
 Make sure 'ok' value is 1.
 
 Now add the 'sqlnode1' and 'sqlnode2' nodes to the replica sets.
 You will see the results below and make sure there is no error.
 
 MongoDBRep:OTHER> rs.add("sqlnode1")
 /*
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
*/
MongoDBRep:PRIMARY> rs.add("sqlnode2")
 /*
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
 */
 
 Next, check the replica sets status with the rs query below.
 
 MongoDBRep:PRIMARY> rs.status()
 /*
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
*/
 
 Another query to check the status is:
 
 MongoDBRep:PRIMARY> rs.isMaster()
 /*
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
*/
 
 Step 6 - Test the Replication
 
 Test the data set replication from the 'PRIMARY' instance 'centosmn' to 'SECONDARY' nodes 'sqlnode1' and 'sqlnode2'.
 In this step, we will try to write or create a new database on the 'PRIMARY' node 'cenosmn', 
 then check if the replication is working by checking the database on 'SECONDARY' nodes 'sqlnode1' and 'sqlnode2'.
 
Login to the 'centosmn' server and open mongo shell.

[root@centosmn ~]# mongo
 
 Now create a new database 'lemp' and new 'stack' collection for the database.
 
--Node1------------------------------------------------------

MongoDBRep:PRIMARY> use lemp
switched to db lemp

MongoDBRep:PRIMARY> db.stack.save(
... {
...     "desc": "LEMP Stack",
...     "apps":  ["Linux", "Nginx", "MySQL", "PHP"],
... })
WriteResult({ "nInserted" : 1 })
 
 --Node1------------------------------------------------------ 
 
Next, go to the 'SECONDARY' node 'sqlnode1' and open the mongo shell.

--Node2------------------------------------------------------ 
Enable reading from the 'SECONDARY' node with the query 'rs.slaveOk()', 
 and then check if the 'lemp' database exists on the 'SECONDARY' nodes.
 
[root@sqlnode1 ~]# mongo
 
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

--Node2------------------------------------------------------ 


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

--Node3------------------------------------------------------


The database from the 'PRIMARY' node has been replicated to the 'SECONDARY' nodes, 
  the database 'lemp' from the 'centosmn' instance replicated sucessfully to the 'sqlnode1' and 'sqlnode2' instances.

A MongoDB Replica Set has been successfully created.

