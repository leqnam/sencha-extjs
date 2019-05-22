Ext.define('ExtApp.view.assignement.assignement1', {
    extend: 'Ext.container.Container',
    html: '',
    requires: [
        'Leqnam.sencha.Treee'

    ],
    // defaults: {
    //     bodyPadding: 20,
    //     padding: 10,
    //     margin: 10,
    // },
    items: [{
            xtype: 'datefield',
            label: 'Start date'
        }, {
            xtype: 'datefield',
            label: 'End date'
        },
        {
            xtype: 'nrd-tree',
            height: 400,
            width: 400,
        }
    ]
})