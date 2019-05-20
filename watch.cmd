cd ext\packages
sencha package build
cd ../..
rmdir /s build
cd apps\ExtApp
sencha app build
sencha app watch