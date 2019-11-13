# BugBuster
Chrome extension to capture replication steps along with network data and browser console data

If you use Chrome to open the bug report, make following changes
Open registry, go to key Computer\HKEY_CLASSES_ROOT\ChromeHTML\shell\open\command, change value to 
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --allow-file-access-from-files "%1"

If you use Firefox to open bug report, make following changes
Open Firefox, then open about:config, then search for privacy.file_unique_origin, change it to false