Ext.define('ExtApp.view.assignement.assignement1Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.assignement-assignement1',

    onActionClick: function() {
        Ext.Msg.confirm('Confirm', 'Hello world', 'onConfirm', this);
    },
    onConfirm: function(choice) {
        if (choice === 'yes') {
            alert("Yes is clicked")
        }
    }
});