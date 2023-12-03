CONTENTS OF THIS FILE
---------------------

 * Introduction
 * Requirements
 * Recommended modules
 * Installation
 * Configuration
 * User guide
 * Troubleshooting
 * Maintainers

INTRODUCTION
------------

This is a Chat pub-sub microservice which having support for horizontal scaling using redis without effecting the sockets :-
  
   - In this service there are two types of users ["HOST", "CUSTOMER"].
   - Customer can be created by user him/her self but the host is only created by admin.
   - A custumer can have at-most one active chat session at a time. He/She is able to create new session once the previous is marked as "CLOSED" by host or by him/her self.
   - On the other hand a host may have n numbers of active sessions. The host have to choose a session from "UNASSIGN" sessions list and mark as "ASSIGN".
   - Host's are able to see statistics of there chats. like how many are active, closed, etc.
   - Whole the web-socket connection is secured by bearer token which will expires within 2 hours from creation.
   - Once the USER and the HOST left the session un-closed then that session is marked "CLOSING" within 30 days of its creation and is marked "CLOSED" by system automatically after 90 days as it's a NO-SHOW. (UPCOMMING)

REQUIREMENTS
------------

This project have some special requirements like :-

   - docker : "^20.10.22"
   - redis : "latest"
   - mongoDb : "latest"

INSTALLATION
------------

 * Run [docker compose -f .\docker-compose.yml up] in terminal.


CONFIGURATION
-------------

The module has already been configured in docker-compose for all menu or modifiable settings. There is no configuration other than that run it in development mode only.


USER GUIDE
---------------

 * https://bhanujodha.notion.site/Chat-app-a508a0cf7409413090f99ec8f532681f?pvs=4


TROUBLESHOOTING
---------------

 * If the localhost:8080/custom-string not respond, check the following:

   - Did you run the container in docker?
   - Do you check for all images mentioned in the requirement?
   - URL "localhost:8080/custom-string" only allows GET requests.


MAINTAINERS
-----------

Current maintainers:
 * Bhanu Pratap Singh Rathore - https://github.com/BhanuJodha