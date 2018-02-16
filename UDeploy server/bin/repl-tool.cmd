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

setlocal
set SERVER_HOME=C:\Users\Ankur.Kashyap\Documents\UDeploy server
call "%SERVER_HOME%\bin\set_env.cmd"

set JAVACMD=%JAVA_HOME%\bin\java
pushd "%SERVER_HOME%\bin"
"%JAVACMD%" %REPL_TOOL_JAVA_OPTS% -jar "%SERVER_HOME%\bin\launcher.jar" "%SERVER_HOME%\bin\classpath.conf" com.urbancode.ds.repl.tool.Tool %*
popd
