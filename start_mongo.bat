@echo off
echo Starting MongoDB...
"C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath "c:\Users\ASUS\react_collage\backend\db_data" --port 27017 --bind_ip 127.0.0.1
pause
