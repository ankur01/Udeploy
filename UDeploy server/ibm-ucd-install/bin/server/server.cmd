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

set SERVER_HOME=@SERVER_HOME@

rem -- Set environment variables that can be customized after install ----------
call "%SERVER_HOME%\bin\set_env.cmd"

set JAVACMD=%JAVA_HOME%\bin\java
set START_CLASS=com.urbancode.ds.UDeployServer
set STOP_CLASS=com.urbancode.container.tomcat.ContainerShutdown

rem -- Execute -----------------------------------------------------------------

if ""%1"" == ""run"" goto doRun
if ""%1"" == ""start"" goto doStart
if ""%1"" == ""stop"" goto doStop

echo Usage: server.cmd {run^|start^|stop}
goto end

:doRun
shift
if ""%1"" == ""-debug"" (
    set JAVA_OPTS=%JAVA_OPTS% %JAVA_DEBUG_OPTS%
)
pushd "%SERVER_HOME%\bin"
"%JAVACMD%" %JAVA_OPTS% -Dserver.log.to.console=y -jar "%SERVER_HOME%\bin\launcher.jar" "%SERVER_HOME%\bin\classpath.conf" %START_CLASS%
popd
goto end

:doStart
shift
if ""%1"" == ""-debug"" (
    set JAVA_OPTS=%JAVA_OPTS% %JAVA_DEBUG_OPTS%
)
set ACTION=start
pushd "%SERVER_HOME%\bin"
start "Server" "%JAVACMD%" %JAVA_OPTS% -jar "%SERVER_HOME%\bin\launcher.jar" "%SERVER_HOME%\bin\classpath.conf" %START_CLASS%
popd
goto end

:doStop
shift
pushd "%SERVER_HOME%\bin"
"%JAVACMD%" %JAVA_OPTS% -jar "%SERVER_HOME%\bin\launcher.jar" "%SERVER_HOME%\bin\classpath.conf" %STOP_CLASS%
popd
goto end

:end
