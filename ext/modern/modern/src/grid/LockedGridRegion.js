/**
 * This class is used by the {@link Ext.grid.LockedGrid lockedgrid} component to wrap each child
 * grid. Being a `panel`, this class allows regions to be `resizable` and `collapsible`. In collapsed
 * state, the region will also display a `title`.
 *
 * The `weight` config is used to configure the {@link Ext.panel.Resizer resizable} and
 * {@link Ext.panel.Collapser collapsible} panel properties.
 */
Ext.define('Ext.grid.LockedGridRegion', {
    extend: 'Ext.Panel',

    requires: [
        'Ext.layout.Fit',
        'Ext.grid.Grid'
    ],

    xtype: 'lockedgridregion',

    classCls: Ext.baseCSSPrefix + 'lockedgridregion',

    isLockedGridRegion: true,

    autoSize: null,

    lockedGrid: null,

    config: {
        /**
         * @cfg {Ext.grid.Grid} grid
         * This config governs the child grid in this region.
         */
        grid: {
            xtype: 'grid',
            manageHorizontalOverflow: false,
            hideScrollbar: true,
            reserveScrollbar: true,
            scrollable: {
                x: true,
                y: true
            }
        },

        /**
         * @cfg {Boolean/String} locked
         * Determines whether the region is locked or not.
         * Configure as `true` to lock the grid to default locked region {@link Ext.grid.LockedGrid LockedGrid}
         * String values contains one of the defined locking regions - "left", "right" or "center"
         */
        locked: false,

        /**
         * @cfg {String} menuLabel
         * The `menuLabel` is used to give custom menu labels to the defined regions
         */
        menuLabel: '',

        /**
         * @cfg {String} regionKey
         * This config provides the set of possible locked regions. Each value denotes a named region
         * (for example, "left", "right" and "center").
         * While the set of names is not fixed, meaning a `lockedgrid` can have more than these
         * three regions, there must always be a "center" region. The center regions cannot
         * be hidden or collapsed or emptied of all columns.
         */
        regionKey: ''
    },

    border: true,
    layout: 'fit',

    applyGrid: function(grid) {
        if (grid) {
            grid = this.add(grid);
            grid.region = this;
        }

        return grid;
    },

    updateWeight: function(weight, oldWeight) {
        var me = this,
            map = me.sideClsMap;

        me.callParent([weight, oldWeight]);

        if (oldWeight) {
            me.removeCls(map[Ext.Number.sign(oldWeight)]);
        }

        if (weight) {
            me.addCls(map[Ext.Number.sign(weight)]);
        }
    },

    privates: {
        sideClsMap: {
            '-1': Ext.baseCSSPrefix + 'lock-start',
            1: Ext.baseCSSPrefix + 'lock-end'
        }
    }
});
