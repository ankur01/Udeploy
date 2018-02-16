package com.urbancode.installer

interface HACapableInstaller {

    boolean isHAInstall()

    String getAppStorageDir()
}
