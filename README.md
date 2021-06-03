# BugBuster
Chrome extension to capture replication steps along with network data and browser console data

### To open bug report in Chrome
Open registry, go to key ```Computer\HKEY_CLASSES_ROOT\ChromeHTML\shell\open\command```, change value to   
```"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --allow-file-access-from-files "%1"```
> **_NOTE:_** when you want to open Bug Report html, make sure there is no instance of chrome open  

  
### To open bug report in Firefox 
Open Firefox, then open ```about:config```, then search for ```privacy.file_unique_origin```, change it to false  
No need of closing existing instances of firefox.  
