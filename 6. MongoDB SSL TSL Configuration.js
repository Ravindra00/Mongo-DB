**Create directory for the certificates**

**_[root@centosmn ~]# mkdir -p /etc/ssl/mongossl_**

[root@centosmn ~]# cd /etc/ssl/mongossl

[root@centosmn ~]# ls

[root@centosmn mongossl]# openssl genrsa -des3 -out server.key 2048

/*
Enter pass phrase for server.key: Password

Verifying - Enter pass phrase for server.key: Password
*/


[root@centosmn mongossl]# openssl rsa -in server.key -out server.key

/*
Enter pass phrase for server.key:Password
writing RSA key
*/

[root@centosmn mongossl]# openssl req -sha256 -new -key server.key -out server.csr -subj "/CN=localhost_ssl"

[root@centosmn mongossl]# openssl x509 -req -sha256 -days 365 -in server.csr -signkey server.key -out server.crt
/*
Signature ok

subject=/CN=localhost_ssl

Getting Private key
*/

[root@centosmn mongossl]# ll

total 12

-rw-r--r-- 1 root root  989 Jun  4 16:40 server.crt

-rw-r--r-- 1 root root  895 Jun  4 16:38 server.csr

-rw-r--r-- 1 root root 1679 Jun  4 16:37 server.key


[root@centosmn mongossl]#  cat server.crt server.key > cert.pem

[root@centosmn mongossl]# ll

total 16

-rw-r--r-- 1 root root 2668 Jun  4 16:56 cert.pem

-rw-r--r-- 1 root root  989 Jun  4 16:40 server.crt

-rw-r--r-- 1 root root  895 Jun  4 16:38 server.csr

-rw-r--r-- 1 root root 1679 Jun  4 16:37 server.key

[root@centosmn mongossl]# openssl genrsa -out mongodb.key 2048

/*
Generating RSA private key, 2048 bit long modulus

.............................................+++

.....+++

e is 65537 (0x10001)

*/

[root@centosmn mongossl]# openssl req -new -key mongodb.key -out mongodb.csr

/*
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.

Country Name (2 letter code) [XX]:
State or Province Name (full name) []:
Locality Name (eg, city) [Default City]:
Organization Name (eg, company) [Default Company Ltd]:
Organizational Unit Name (eg, section) []:
Common Name (eg, your name or your server's hostname) []:localhost_ssl
Email Address []:

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
An optional company name []:
*/

[root@centosmn mongossl]# openssl x509 -req -in mongodb.csr -CA cert.pem -CAkey server.key -CAcreateserial -out mongodb.crt -days 500 -sha256


Signature ok
subject=/C=XX/L=Default City/O=Default Company Ltd/CN=localhost_ssl
Getting CA Private Key



[root@centosmn mongossl]# cat mongodb.key mongodb.crt > mongodb.pem


[root@centosmn mongossl]# systemctl stop mongod


