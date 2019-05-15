
Ext.define('ExtApp.view.assignement.assignement1',{
    extend: 'Ext.panel.Panel',

    requires: [
        'ExtApp.view.assignement.assignement1Controller',
        'ExtApp.view.assignement.assignement1Model'
    ],

    controller: 'assignement-assignement1',
    viewModel: {
        type: 'assignement-assignement1'
    },

    html: 'Hello, World!!'
});
