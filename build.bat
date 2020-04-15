call react-scripts build
rmdir ..\Indie-Vibe-Back\src\main\resources\static /s /q
md ..\Indie-Vibe-Back\src\main\resources\static
xcopy /e ..\Indie-Vibe-Front\build\** ..\Indie-Vibe-Back\src\main\resources\static