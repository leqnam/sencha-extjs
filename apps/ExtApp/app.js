/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'ExtApp.Application',

    name: 'ExtApp',

    requires: [
        // This will automatically load all classes in the ExtApp namespace
        // so that application classes do not need to require each other.
        'ExtApp.*'
    ],

    // The name of the initial view to create.
    mainView: 'ExtApp.view.main.Main'
});
