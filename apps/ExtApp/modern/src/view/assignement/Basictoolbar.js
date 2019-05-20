Ext.define('ExtApp.view.assignement.Basictoolbar', {
    extend: 'Ext.Toolbar',
    xtype: 'basic-toolbar',
    //alias: 'widget.Basictoolbar',
    requires: [
        'Ext.SegmentedButton'
    ],
    layout: {
        overflow: 'scroller'
    },
    // layout: 'center',
    items: [{
        text: 'Default',
        badgeText: '2'
    }, {
        xtype: 'spacer'
    }, {
        xtype: 'segmentedbutton',
        allowDepress: true,
        items: [{
            text: 'Option 1',
            pressed: true
        }, {
            text: 'Option 2'
        }]
    }, {
        xtype: 'spacer'
    }, {
        text: 'Action',
        ui: 'action',
        handler: 'onActionClick'
    }],

    onActionClick: function() {
        alert('helo')
    }
});