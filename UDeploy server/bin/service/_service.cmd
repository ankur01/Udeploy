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

rem == BEGIN INSTALL MODIFICATIONS =============================================

set SERVER_HOME=C:\Users\Ankur.Kashyap\Documents\UDeploy server
set ARCH=x64
set JAVA_OPTS=-Xmx1024m;-XX:MaxPermSize=192m;-XX:-OmitStackTraceInFastThrow;-XX:+HeapDumpOnOutOfMemoryError;-Dcatalina.base=C:\Users\Ankur.Kashyap\Documents\UDeploy server\opt\tomcat;-Dcatalina.home=C:\Users\Ankur.Kashyap\Documents\UDeploy server\opt\tomcat;-Djava.endorsed.dirs=C:\Users\Ankur.Kashyap\Documents\UDeploy server\endorsed;-Dfile.encoding=UTF-8;-Djava.library.path=C:\Users\Ankur.Kashyap\Documents\UDeploy server\lib\rcl\win\x386_64
set JAVA_HOME=C:\Program Files\Java\jdk1.8.0_101

rem == END INSTALL MODIFICATIONS ===============================================

set SRV=%SERVER_HOME%\native\%ARCH%\winservice.exe

set SERVICE_NAME=ibm-ucd
set DISPLAY_NAME=IBM UrbanCode Deploy Server
set DESCRIPTION=IBM UrbanCode Deploy Server

if ""%1"" == ""install"" goto installService
if ""%1"" == ""remove"" goto removeService
if ""%1"" == ""uninstall"" goto removeService

echo Usage: %SERVICE_NAME% {install^|remove [servicename]}
goto end

rem -- Remove Service ----------------------------------------------------------

:removeService
set SERVICE_NAME=%2
"%SRV%" //DS//%SERVICE_NAME%
goto end

rem -- Install Service ---------------------------------------------------------

:installService
set JVM_DLL=auto
set SERVICE_NAME=%2
set DISPLAY_NAME=%DISPLAY_NAME% (%2)
set DESCRIPTION=%DESCRIPTION% (%2)

call :getJvmDll
set SVCPATH=%JVM_BASE%\..
set SVCPATH=%SVCPATH:"=%
set SVCPATH=%SVCPATH:;=';'%
set SVCPATH=%SVCPATH:#='#'%

"%SRV%" //IS//%SERVICE_NAME% --DisplayName "%DISPLAY_NAME%" --Install "%SRV%" || goto installFailed
"%SRV%" //US//%SERVICE_NAME% --Description "%DESCRIPTION%" || goto configFailed

"%SRV%" //US//%SERVICE_NAME% --Jvm "%JVM_DLL%" || goto configFailed
"%SRV%" //US//%SERVICE_NAME% --JavaHome "%JAVA_HOME%" || goto configFailed
"%SRV%" //US//%SERVICE_NAME% --JvmOptions "%JAVA_OPTS%" || goto configFailed

"%SRV%" //US//%SERVICE_NAME% --Environment "PATH=%SVCPATH%';'%%PATH%%;JAVA_HOME=%JAVA_HOME%" || goto configFailed

"%SRV%" //US//%SERVICE_NAME% --StartMode jvm || goto configFailed
"%SRV%" //US//%SERVICE_NAME% --StartClass com.urbancode.launcher.Launcher || goto configFailed
"%SRV%" //US//%SERVICE_NAME% --StartParams "%SERVER_HOME%\bin\classpath.conf;com.urbancode.ds.UDeployServer" || goto configFailed
"%SRV%" //US//%SERVICE_NAME% --StartPath "%SERVER_HOME%\bin" || goto configFailed

"%SRV%" //US//%SERVICE_NAME% --StopMode jvm || goto configFailed
"%SRV%" //US//%SERVICE_NAME% --StopClass com.urbancode.launcher.Launcher || goto configFailed
"%SRV%" //US//%SERVICE_NAME% --StopParams "%SERVER_HOME%\bin\classpath.conf;com.urbancode.container.tomcat.ContainerShutdown" || goto configFailed
"%SRV%" //US//%SERVICE_NAME% --StopPath "%SERVER_HOME%\bin" || goto configFailed

"%SRV%" //US//%SERVICE_NAME% --LogPath "%SERVER_HOME%\var\log" || goto configFailed
"%SRV%" //US//%SERVICE_NAME% --StdOutput auto || goto configFailed
"%SRV%" //US//%SERVICE_NAME% --StdError auto || goto configFailed

"%SRV%" //US//%SERVICE_NAME% --Classpath "%SERVER_HOME%\bin\launcher.jar" || goto configFailed

goto end

rem -- Subroutines -------------------------------------------------------------

:getJvmDll
    if exist "%JAVA_HOME%\bin\client\jvm.dll" set JVM_BASE=%JAVA_HOME%\bin\client
    if exist "%JAVA_HOME%\bin\server\jvm.dll" set JVM_BASE=%JAVA_HOME%\bin\server
    if exist "%JAVA_HOME%\bin\j9vm\jvm.dll" set JVM_BASE=%JAVA_HOME%\bin\j9vm
    if exist "%JAVA_HOME%\jre\bin\client\jvm.dll" set JVM_BASE=%JAVA_HOME%\jre\bin\client
    if exist "%JAVA_HOME%\jre\bin\server\jvm.dll" set JVM_BASE=%JAVA_HOME%\jre\bin\server
    if exist "%JAVA_HOME%\jre\bin\j9vm\jvm.dll" set JVM_BASE=%JAVA_HOME%\jre\bin\j9vm
    set JVM_DLL=%JVM_BASE%\jvm.dll
goto :eof

:installFailed
    echo Service installation failed
    exit /b 1
goto :eof

:configFailed
    echo Service configuration failed
    exit /b 1
goto :eof
:end
