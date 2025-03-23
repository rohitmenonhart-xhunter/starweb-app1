; StarWeb Installer Script
; NSIS (Nullsoft Scriptable Install System) script

; Define application name and version
!define APPNAME "StarWeb"
!define COMPANYNAME "StarWeb Analysis"
!define DESCRIPTION "Website Analysis Tool"
!define VERSION "1.0.0"

; Define installer attributes
OutFile "StarWeb-Setup.exe"
InstallDir "$PROGRAMFILES64\${APPNAME}"
InstallDirRegKey HKLM "Software\${APPNAME}" "Install_Dir"
RequestExecutionLevel admin

; Include Modern UI
!include "MUI2.nsh"

; Modern UI settings
!define MUI_ABORTWARNING
!define MUI_ICON "..\public\favicon.ico"
!define MUI_UNICON "..\public\favicon.ico"
!define MUI_WELCOMEPAGE_TITLE "Welcome to ${APPNAME} ${VERSION} Setup"
!define MUI_WELCOMEPAGE_TEXT "This wizard will guide you through the installation of ${APPNAME} ${VERSION}, a powerful website analysis tool.$\r$\n$\r$\nClick Next to continue."
!define MUI_FINISHPAGE_RUN "$INSTDIR\StarWeb.exe"
!define MUI_FINISHPAGE_RUN_TEXT "Launch ${APPNAME}"

; Pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "..\LICENSE"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

; Languages
!insertmacro MUI_LANGUAGE "English"

; Function to check if Node.js is installed
Function CheckNodeJS
  ; Try to find node.exe in PATH
  nsExec::ExecToStack 'node --version'
  Pop $0 ; return value
  Pop $1 ; stdout/stderr
  
  ${If} $0 != 0
    MessageBox MB_YESNO|MB_ICONQUESTION "Node.js is required but not installed. Would you like to download and install it now?" IDYES download IDNO continue
    
    download:
      ExecShell "open" "https://nodejs.org/en/download/"
      MessageBox MB_OK|MB_ICONINFORMATION "Please run the installer again after installing Node.js."
      Abort
    
    continue:
      MessageBox MB_OK|MB_ICONINFORMATION "The application requires Node.js to run. You can install it later from https://nodejs.org/"
  ${EndIf}
FunctionEnd

; Installation section
Section "Install"
  SetOutPath $INSTDIR
  
  ; Call function to check if Node.js is installed
  Call CheckNodeJS
  
  ; Copy all files from your application directory
  File /r "..\*.*"
  
  ; Create Start Menu shortcuts
  CreateDirectory "$SMPROGRAMS\${APPNAME}"
  CreateShortCut "$SMPROGRAMS\${APPNAME}\${APPNAME}.lnk" "$INSTDIR\scripts\start-app.bat" "" "$INSTDIR\public\favicon.ico"
  CreateShortCut "$SMPROGRAMS\${APPNAME}\Uninstall.lnk" "$INSTDIR\uninstall.exe"
  CreateShortCut "$DESKTOP\${APPNAME}.lnk" "$INSTDIR\scripts\start-app.bat" "" "$INSTDIR\public\favicon.ico"
  
  ; Create uninstaller
  WriteUninstaller "$INSTDIR\uninstall.exe"
  
  ; Add uninstall information to Add/Remove Programs
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "DisplayName" "${APPNAME} - ${DESCRIPTION}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "UninstallString" '"$INSTDIR\uninstall.exe"'
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "DisplayIcon" "$INSTDIR\public\favicon.ico"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "Publisher" "${COMPANYNAME}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "DisplayVersion" "${VERSION}"
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "NoModify" 1
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "NoRepair" 1
SectionEnd

; Uninstallation section
Section "Uninstall"
  ; Remove Start Menu shortcuts
  Delete "$SMPROGRAMS\${APPNAME}\${APPNAME}.lnk"
  Delete "$SMPROGRAMS\${APPNAME}\Uninstall.lnk"
  RMDir "$SMPROGRAMS\${APPNAME}"
  Delete "$DESKTOP\${APPNAME}.lnk"
  
  ; Remove installed files and directories
  RMDir /r "$INSTDIR\node_modules"
  RMDir /r "$INSTDIR\dist"
  Delete "$INSTDIR\*.*"
  
  ; Remove uninstaller and remaining directories
  Delete "$INSTDIR\uninstall.exe"
  RMDir /r "$INSTDIR"
  
  ; Remove registry keys
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}"
  DeleteRegKey HKLM "Software\${APPNAME}"
SectionEnd 