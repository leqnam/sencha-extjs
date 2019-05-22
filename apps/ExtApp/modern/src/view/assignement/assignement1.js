Ext.define('ExtApp.view.assignement.assignement1', {
    extend: 'Ext.Panel',
    xtype: 'assignment1',

    requires: [
        'ExtApp.view.assignement.assignement1Controller',
        'ExtApp.view.assignement.assignement1Model',
        'Ext.layout.HBox',
        'Ext.Toolbar',
        'ExtApp.view.assignement.Basictoolbar',
        'ExtApp.view.assignement.Calendarpanel'

    ],

    controller: 'assignement-assignement1',
    viewModel: {
        type: 'assignement-assignement1'
    },
    defaultType: 'panel',
    defaults: {
        bodyPadding: 20,
        padding: 10,
        margin: 10,
    },
    layout: 'fit', // take note
    items: [
            // {
            //     xtype: 'datefield',
            //     label: 'Start date'
            // }, {
            //     xtype: 'datefield',
            //     label: 'End date'
            // }
            {
                html: 'Basic Panel 1',
                closable: true,
                bind: {
                    title: '{title}',
                },
                iconCls: 'x-fa fa-html5',
                height: 400,
                width: 400,
                bodyStyle: {
                    background: "red",
                    color: "#fff",
                    margin: 40,
                    padding: 20
                },
                shadow: 'true',
                items: [{
                    xtype: "basic-toolbar",
                    docked: 'bottom',
                }]
            },
            {
                title: 'Panel 2',
                html: '<strong>Basic Panel 2</strong>',
                closable: true,
                width: 400,
                height: 400,
            },
            {
                title: 'Panel 3',
                html: '<strong>Basic Panel 3</strong>',
                width: 400,
                height: 400,
            },
            {
                xtype: 'nrd-calendar',
                width: 400,
                height: 400,
            },
            {
                title: 'Panel 3',
                html: '<strong>Basic Panel 3</strong>',
                width: 400,
                height: 400,
            }
        ]
        //html: 'Hello, World!!'
});