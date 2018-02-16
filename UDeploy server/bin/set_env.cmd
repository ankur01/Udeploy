@echo off
REM Licensed Materials - Property of IBM Corp.
REM IBM UrbanCode Build
REM IBM UrbanCode Deploy
REM IBM UrbanCode Release
REM IBM AnthillPro
REM (c) Copyright IBM Corporation 2002, 2014. All Rights Reserved.
REM
REM U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
REM GSA ADP Schedule Contract with IBM Corp.


set JAVA_OPTS=-Xmx1024m -XX:MaxPermSize=192m -XX:-OmitStackTraceInFastThrow -XX:+HeapDumpOnOutOfMemoryError -Dcatalina.base="C:\Users\Ankur.Kashyap\Documents\UDeploy server\opt\tomcat" -Dcatalina.home="C:\Users\Ankur.Kashyap\Documents\UDeploy server\opt\tomcat" -Djava.endorsed.dirs="C:\Users\Ankur.Kashyap\Documents\UDeploy server\endorsed" -Dfile.encoding=UTF-8 %UC_JAVA_OPTS% -Djava.library.path="C:\Users\Ankur.Kashyap\Documents\UDeploy server\lib\rcl\win\x386_64"
set JAVA_DEBUG_OPTS=-Xdebug -Xrunjdwp:transport=dt_socket,address=10000,server=y,suspend=n -Dcom.sun.management.jmxremote
set JAVA_HOME=C:\Program Files\Java\jdk1.8.0_101
