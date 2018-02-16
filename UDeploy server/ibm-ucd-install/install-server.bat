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

REM If we can't find a codepage, fall back to UTF-8.
set ENCODING=UTF-8

set CODEPAGE=UNKNOWN
for /f "tokens=3*" %%x in ('reg query "HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Control\Nls\CodePage" /v OEMCP') do set CODEPAGE=%%x

REM This is the exhaustive list of all supported OEM code pages.

REM By default, use the Java encoding "CP<codepage>"
if NOT %CODEPAGE%==UNKNOWN set ENCODING=CP%CODEPAGE%

REM Multilingual Latin I + Euro (Indirect match to Charset CP850)
if %CODEPAGE%==858 set ENCODING=CP850

REM Japanese codepage requires a specific encoding name
if %CODEPAGE%==932 set ENCODING=Shift_JIS

cd %~dp0

set ANT_HOME=opt\apache-ant-1.7.1
set CLASSPATH=
set ANT_OPTS=-Xmx1024m -Dfile.encoding=%ENCODING%

if "%1"=="-fips" set ANT_OPTS=%ANT_OPTS% -Dcom.ibm.jsse2.usefipsprovider=true

opt\apache-ant-1.7.1\bin\ant.bat -f install.with.groovy.xml install
