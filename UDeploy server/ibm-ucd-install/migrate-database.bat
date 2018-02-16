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

cd %~dp0

set ANT_HOME=opt\apache-ant-1.7.1
set CLASSPATH=
set ANT_OPTS="-Xmx1024m"

opt\apache-ant-1.7.1\bin\ant.bat -f install.with.groovy.xml migrate-database
