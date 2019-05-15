/**
 * The `lockedgrid` component manages one or more child `grid`s that independently scroll
 * in the horizontal axis but are vertically synchronized. The end-user can, using column
 * menus or drag-drop, control which of these {@link #cfg!regions regions} contain which
 * columns.
 *
 * ## Locked Regions
 *
 * The `lockedgrid` always has a `center` {@link Ext.grid.LockedGridRegion region} and by
 * default a `left` and `right` region. These regions are derivatives of `Ext.panel.Panel`
 * (to allow them to be resized and collapsed) and contain normal `grid` with a subset of
 * the overall set of `columns`. All keys in the `regions` config object are valid values
 * for a {@link Ext.grid.column.Column column}'s `locked` config. The values of each of
 * the properties of the `regions` config are configurations for the locked region itself.
 *
 * The layout of the locked regions is a simple `hbox` with the `center` assigned `flex:1`
 * and the non-center regions assigned a width based on the columns contained in that
 * region. The order of items in the container is determined by the `weight` assigned to
 * each region. Regions to the left of center have negative `weight` values, while regions
 * to the right of center have positive `weight` values. This distinction is important
 * primarily to determine the side of the region on which to display the resizer as well
 * as setting the direction of collapse for the region.
 *
 * ## Config and Event Delegation
 *
 * The `lockedgrid` mimics the config properties and events fired by a normal `grid`. It
 * does this in some cases by delegating configs to each child grid. The `regions` config
 * should be used to listen to events or configure a child grid independently when this
 * isn't desired.
 */
Ext.define('Ext.grid.LockedGrid', {
    extend: 'Ext.Container',
    xtype: 'lockedgrid',

    requires: [
        'Ext.layout.Box',
        'Ext.layout.Fit',
        'Ext.grid.Grid'
    ],

    config: {

        /**
        * @cfg {Object} columnMenu
        * This is a config object which is used by columns in this grid to create their
        * header menus.
        *
        * The following column menu contains the following items.
        *
        * - Default column menu items {@link Ext.grid.Grid grid}
        * - "Region" menu item to provide locking sub-menu options
        *
        * This can be configured as `null` to prevent columns from showing a column menu.
        */
        columnMenu: {
            items: {
                region: {
                    text: 'Region',
                    menu: {}
                }
            }
        },

        /**
         * @cfg {Ext.grid.column.Column[]} columns (required)
         * An array of column definition objects which define all columns that appear in this grid.
         * Each column definition provides the header text for the column, and a definition of where
         * the data for that column comes from.
         * Column definition can also define the locked property
         *
         * This can also be a configuration object for a {Ext.grid.header.Container HeaderContainer}
         * which may override certain default configurations if necessary. For example, the special
         * layout may be overridden to use a simpler layout, or one can set default values shared
         * by all columns:
         *
         *      columns: {
         *          items: [
         *              {
         *                  text: "Column A"
         *                  dataIndex: "field_A",
         *                  locked: true,
         *                  width: 200
         *              },{
         *                  text: "Column B",
         *                  dataIndex: "field_B",
         *                  width: 150
         *              },
         *              ...
         *          ]
         *      }
         *
         */
        columns: null,

        /**
         * @cfg {String} defaultLockedRegion
         * This config determines which region corresponds to `locked: true` on a column.
         */
        defaultLockedRegion: 'left',

        /**
         * @cfg {Object} gridDefaults
         * This config is applied to the child `grid` in all regions.
         */
        gridDefaults: null,

        /**
         * @cfg {Boolean} hideHeaders
         * @inheritdoc Ext.grid.Grid#cfg!hideHeaders
         */
        hideHeaders: false,

        /**
         * @cfg {Object} itemConfig
         * @inheritdoc Ext.grid.Grid#cfg!itemConfig
         */
        itemConfig: {},

        /**
         * @cfg {Object} leftGridDefaults
         * This config is applied to the child `grid` in all left-side regions (those of
         * negative `weight`)
         */
        leftRegionDefaults: {
            locked: true
        },

        /**
         * @cfg {Object} regions
         * This config determines the set of possible locked regions. Each key name in this
         * object denotes a named region (for example, "left", "right" and "center"). While
         * the set of names is not fixed, meaning a `lockedgrid` can have more than these
         * three regions, there must always be a "center" region. The center regions cannot
         * be hidden or collapsed or emptied of all columns.
         *
         * The values of each property in this object are configuration objects for the
         * {@link Ext.grid.LockedGridRegion region}. The ordering of grids is determined
         * by the `weight` config. Negative values are "left" regions, while positive values
         * are "right" regions. The `menuLabel` is used in the column menu to allow the user
         * to place columns into the region.
         *
         * To add an additional left region:
         *
         *      xtype: 'lockedgrid',
         *      regions: {
         *          left2: {
         *              menuLabel: 'Locked (leftmost)',
         *              weight: -20   // to the left of the standard "left" region
         *          }
         *      }
         */
        regions: {
            left: {
                menuLabel: 'Locked (Left)',
                weight: -10
            },
            center: {
                flex: 1,
                menuLabel: 'Unlocked',
                weight: 0
            },
            right: {
                menuLabel: 'Locked (Right)',
                weight: 10
            }
        },

        /**
         * @cfg {Object} rightGridDefaults
         * This config is applied to the child `grid` in all right-side regions (those of
         * positive `weight`)
         */
        rightRegionDefaults: {
            locked: true
        },

        /**
         * @cfg {Ext.data.Store/Object/String} store
         * @inheritdoc Ext.grid.Grid#cfg!store
         */
        store: null,

        /**
         * @cfg {Boolean} variableHeights
         * @inheritdoc Ext.grid.Grid#cfg!variableHeights
         */
        variableHeights: false
    },

    classCls: Ext.baseCSSPrefix + 'lockedgrid',
    weighted: true,

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    onRender: function() {
        var me = this;

        me.callParent();

        if (!me.getHideHeaders()) {
            me.setupHeaderSync();
        }

        me.reconfigure();
    },

    doDestroy: function() {
        Ext.undefer(this.partnerTimer);
        this.callParent();
    },

    addColumn: function(columns) {
        var me = this,
            map = me.processColumns(columns),
            isArray = Array.isArray(columns),
            ret = isArray ? [] : null,
            grids = me.gridItems,
            len = grids.length,
            v, i, grid, toAdd;

        // Instead of just iterating over the map, loop
        // over the grids in order so that we add items
        // in order
        for (i = 0; i < len; ++i) {
            grid = grids[i];
            toAdd = map[grid.regionKey];

            if (toAdd) {
                v = grid.addColumn(toAdd);

                if (isArray) {
                    Ext.Array.push(ret, v);
                }
                else {
                    // processColumns always returns an array
                    ret = v[0];
                }
            }
        }

        if (me.getVariableHeights()) {
            me.doRefresh();
        }

        return ret;
    },

    getRegion: function(key) {
        return this.regionMap[key] || null;
    },

    insertColumnBefore: function(column, before) {
        var ret;

        if (before === null) {
            ret = this.gridMap.center.addColumn(column);
        }
        else {
            ret = before.getParent().insertBefore(column, before);
        }

        if (this.getVariableHeights()) {
            this.doRefresh();
        }

        return ret;
    },

    removeColumn: function(column) {
        var ret = column.getGrid().removeColumn(column);

        if (this.getVariableHeights()) {
            this.doRefresh();
        }

        return ret;
    },

    updateColumns: function(columns) {
        var me = this,
            grids = me.gridItems,
            map, len, i, grid;

        if (me.isConfiguring) {
            return;
        }

        map = me.processColumns(columns);

        ++me.bulkColumnChange;

        for (i = 0, len = grids.length; i < len; ++i) {
            grid = grids[i];
            grid.setColumns(map[grid.regionKey] || []);
        }

        me.doRefresh();

        --me.bulkColumnChange;
    },

    updateHideHeaders: function(hideHeaders) {
        var me = this;

        me.headerSync = Ext.destroy(me.headerSync);

        me.relayConfig('hideHeaders', hideHeaders);

        if (!hideHeaders && !me.isConfiguring) {
            me.setupHeaderSync();
        }
    },

    updateItemConfig: function(itemConfig) {
        this.relayConfig('itemConfig', itemConfig);
    },

    updateMaxHeight: function(maxHeight) {
        this.relayConfig('maxHeight', maxHeight);
    },

    updateRegions: function(regions) {
        var me = this,
            regionMap = me.regionMap,
            gridDefaults = me.getGridDefaults(),
            variableHeights = me.getVariableHeights(),
            key, region, colMap, grid, gridMap,
            prev, scroller, len, i,
            defaultPartner, regionItems, gridItems;

        if (regionMap) {
            for (key in regionMap) {
                me.remove(regionMap[key]);
            }
        }

        me.regionMap = regionMap = {};
        me.gridMap = gridMap = {};

        colMap = me.processColumns(me.getColumns());

        for (key in regions) {
            region = regions[key];

            if (region) {
                region = me.createRegion(key, regions[key], colMap[key], gridDefaults);

                me.add(region);

                grid = region.getGrid();
                grid.isDefaultPartner = key === me.unlockedKey;

                if (variableHeights) {
                    grid.partnerManager = me;

                    if (grid.isDefaultPartner) {
                        me.defaultPartner = defaultPartner = grid;
                    }
                }

                region.on({
                    scope: me,
                    collapse: 'onRegionCollapse',
                    expand: 'onRegionExpand',
                    hide: 'onRegionHide',
                    show: 'onRegionShow'
                });

                me.setupGrid(grid);

                regionMap[key] = region;
                gridMap[key] = grid;

                scroller = grid.getScrollable();

                if (scroller) {
                    if (prev) {
                        prev.addPartner(scroller, 'y');
                    }

                    prev = scroller;
                }
            }
        }

        // We don't add to this in the loop above because we want
        // the items in weighted order, so wait til everything is
        // added and in order
        me.regionItems = regionItems = me.query('>[isLockedGridRegion]');
        me.gridItems = gridItems = [];

        for (i = 0, len = regionItems.length; i < len; ++i) {
            grid = regionItems[i].getGrid();
            gridItems.push(grid);

            if (defaultPartner && grid !== defaultPartner) {
                grid.renderInfo = defaultPartner.renderInfo;
            }
        }
    },

    applyStore: function(store) {
        return store ? Ext.data.StoreManager.lookup(store) : null;
    },

    updateStore: function(store) {
        this.relayConfig('store', store);
    },

    updateVariableHeights: function(variableHeights) {
        this.relayConfig('variableHeights', variableHeights);
    },

    privates: {
        bulkColumnChange: 0,
        partnerOffset: 200,
        itemConfiguring: false,
        lastPartnerRequest: 0,
        unlockedKey: 'center',

        claimActivePartner: function(partner) {
            var me = this,
                now = Date.now(),
                active = me.activePartner;

            me.partnerTimer = Ext.undefer(me.partnerTimer);

            if (!active || (now - me.lastPartnerRequest > me.partnerOffset)) {
                me.activePartner = partner;
                me.lastPartnerRequest = now;

                me.setActivePartner(partner);
            }
        },

        configureHeaderHeights: function() {
            var headerSync = this.headerSync;

            if (headerSync) {
                headerSync.sync();
            }
        },

        configureItems: function() {
            var me = this,
                gridItems = me.gridItems,
                regionItems = me.regionItems,
                i, found, grid, hide, region;

            me.itemConfiguring = true;

            for (i = gridItems.length - 1; i >= 0; --i) {
                grid = gridItems[i];
                region = regionItems[i];
                me.setRegionVisibility(region);
                hide = true;

                if (!found) {
                    // Don't hide the scrollbars on hidden items, the current
                    // logic assumes that anything after the current item has
                    // scrollers visible.
                    hide = false;
                    found = !region.hasHiddenContent();
                }

                grid.setHideScrollbar(hide);
            }

            me.itemConfiguring = false;
        },

        configurePartners: function() {
            var me = this,
                gridItems = this.gridItems,
                len = gridItems.length,
                visibleGrids, i, grid;

            visibleGrids = gridItems.filter(function(item) {
                return me.isRegionVisible(item.region);
            });

            me.visibleGrids = visibleGrids;

            for (i = 0; i < len; ++i) {
                grid = gridItems[i];
                grid.allPartners = visibleGrids;
                grid.partners = visibleGrids.filter(function(item) {
                    return item !== grid;
                });
            }
        },

        createRegion: function(key, cfg, columns, gridDefaults) {
            var me = this,
                weight = cfg.weight,
                defaults;

            if (weight !== 0) {
                defaults = weight < 0 ? me.getLeftRegionDefaults() : me.getRightRegionDefaults();
            }

            return Ext.create(Ext.Object.merge({
                xtype: 'lockedgridregion',
                regionKey: key,
                lockedGrid: me,
                grid: Ext.apply({
                    regionKey: key,
                    columnMenu: me.getColumnMenu(),
                    columns: columns,
                    hideHeaders: me.getHideHeaders(),
                    itemConfig: me.getItemConfig(),
                    store: me.getStore(),
                    variableHeights: me.getVariableHeights()
                }, gridDefaults)
            }, defaults, cfg));
        },

        doHorizontalScrollCheck: function() {
            var grids = this.gridItems,
                len = grids.length,
                grid,
                scroller,
                i;

            for (i = 0; i < len; ++i) {
                grid = grids[i];
                scroller = grid.getScrollable();

                if (this.isRegionVisible(grid.region) && scroller) {
                    scroller.setX(grid.getHorizontalOverflow() ? 'scroll' : true);
                }
            }
        },

        doRefresh: function() {
            this.reconfigure();
            this.refreshGrids();
            this.doHorizontalScrollCheck();
        },

        doReleaseActivePartner: function() {
            var me = this;

            if (!me.destroyed) {
                me.lastPartnerRequest = 0;
                me.activePartner = null;

                me.setActivePartner(me.defaultPartner);
            }
        },

        handleChangeRegion: function(region, column) {
            var me = this,
                grid = region.getGrid(),
                gridItems = me.gridItems,
                newIdx = gridItems.indexOf(grid),
                oldIdx = gridItems.indexOf(column.getGrid());

            // The idea here is to retain the closest position possible.
            // If moving backwards, add it to the end. If moving forwards,
            // add it to the front.
            ++me.bulkColumnChange;

            if (newIdx < oldIdx) {
                grid.addColumn(column);
            }
            else {
                grid.insertColumn(0, column);
            }

            // Refreshing grid on column add or insert.
            grid.syncRowsToHeight(true);

            --me.bulkColumnChange;

            me.doHorizontalScrollCheck();
        },

        handleRegionVisibilityChange: function(region, hiding) {
            var me = this;

            if (!me.itemConfiguring) {
                me.configurePartners();
                me.refreshGrids();
                me.setGridScrollers(region, hiding);
                me.configureHeaderHeights();
            }
        },

        isActivePartner: function(grid) {
            var active = this.activePartner;

            return active ? grid === active : grid.isDefaultPartner;
        },

        isHeaderVisible: function(header) {
            return this.isRegionVisible(header.getGrid().region);
        },

        isRegionVisible: function(region) {
            return !region.hasHiddenContent();
        },

        isLastVisibleRegion: function(region) {
            var regions = this.regionItems,
                index = regions.indexOf(region),
                other, i;

            for (i = regions.length - 1; i > index; --i) {
                other = regions[i];

                if (!other.hasHiddenContent()) {
                    return false;
                }
            }

            return true;
        },

        onBeforeShowColumnMenu: function(grid, column, menu) {
            var regions = this.regionItems,
                len = regions.length,
                current = grid.region,
                disabled = false,
                items, region, i;

            menu = menu.getComponent('region');

            if (menu) {
                menu = menu.getMenu();
                menu.removeAll();

                items = [];

                disabled = !!(grid.isDefaultPartner && grid.getVisibleColumns().length === 1);

                for (i = 0; i < len; ++i) {
                    region = regions[i];
                    items.push({
                        text: region.getMenuLabel(),
                        disabled: disabled || region === current,
                        handler: this.handleChangeRegion.bind(this, region, column)
                    });
                }

                menu.add(items);
            }
        },

        onColumnAdd: function(grid) {
            if (!this.setRegionVisibility(grid.region)) {
                this.refreshGrids();
            }

            this.configureHeaderHeights();
        },

        onColumnHide: function(grid) {
            if (!this.setRegionVisibility(grid.region)) {
                this.refreshGrids();
            }

            this.configureHeaderHeights();
        },

        onColumnRemove: function(grid) {
            if (!this.setRegionVisibility(grid.region)) {
                this.refreshGrids();
            }

            this.configureHeaderHeights();
        },

        onColumnShow: function(grid) {
            if (!this.setRegionVisibility(grid.region)) {
                this.refreshGrids();
            }

            this.configureHeaderHeights();
        },

        onGridHorizontalOverflowChange: function() {
            if (!this.bulkColumnChange) {
                this.doHorizontalScrollCheck();
            }
        },

        onRegionCollapse: function(region) {
            this.handleRegionVisibilityChange(region, true);
        },

        onRegionExpand: function(region) {
            this.handleRegionVisibilityChange(region, false);
        },

        onRegionHide: function(region) {
            this.handleRegionVisibilityChange(region, true);
        },

        onRegionShow: function(region) {
            this.handleRegionVisibilityChange(region, false);
        },

        getRegionKey: function (lockedValue) {
            var defaultLocked = this.getDefaultLockedRegion(),
                key;

            if (lockedValue) {
                key = lockedValue === true ? defaultLocked : lockedValue;
            }
            else {
                key = this.unlockedKey;
            }

            return key;
        },

        processColumns: function(columns) {
            var me = this, 
                map = {},
                len, i, col, key, arr;

            if (columns) {
                if (!Array.isArray(columns)) {
                    columns = [columns];
                }

                for (i = 0, len = columns.length; i < len; ++i) {
                    col = columns[i];
                    key = me.getRegionKey(col.locked);
                    arr = map[key];

                    if (!arr) {
                        map[key] = arr = [];
                    }

                    arr.push(col);
                }
            }

            return map;
        },

        reconfigure: function() {
            this.configureItems();
            this.configurePartners();
            this.configureHeaderHeights();
        },

        refreshGrids: function() {
            var visibleGrids = this.visibleGrids,
                len = visibleGrids.length,
                i;

            for (i = 0; i < len; ++i) {
                visibleGrids[i].syncRowsToHeight(true);
            }
        },

        relayConfig: function(name, value) {
            var grids = this.gridItems,
                i, len, setter;

            if (grids && !this.isConfiguring) {
                setter = Ext.Config.get(name).names.set;

                for (i = 0, len = grids.length; i < len; ++i) {
                    grids[i][setter](value);
                }
            }
        },

        releaseActivePartner: function(partner) {
            var me = this;

            if (me.activePartner === partner) {
                Ext.undefer(me.partnerTimer);
                me.partnerTimer = Ext.defer(me.doReleaseActivePartner, me.partnerOffset, me);
            }
        },

        setActivePartner: function(partner) {
            var visibleGrids = this.visibleGrids;

            Ext.Array.remove(visibleGrids, partner);

            visibleGrids.unshift(partner);
        },

        setGridScrollers: function(region, isHiding) {
            var gridItems = this.gridItems,
                len = gridItems.length,
                index, i, grid;

            if (this.isLastVisibleRegion(region)) {
                grid = region.getGrid();
                // If this is the last visible grid and we're hiding it, the
                // previous grid needs to show the scroller. Otherwise, this
                // grid does
                index = gridItems.indexOf(grid) - (isHiding ? 1 : 0);

                for (i = 0; i < len; ++i) {
                    gridItems[i].setHideScrollbar(i < index);
                }
            }
        },

        setRegionVisibility: function(region) {
            var grid = region.getGrid(),
                hidden = !!region.getHidden();

            region.setHidden(grid.getVisibleColumns().length === 0);

            return hidden !== region.getHidden();
        },

        setupGrid: function(grid) {
            grid.on({
                scope: this,
                beforeshowcolumnmenu: 'onBeforeShowColumnMenu',
                columnadd: 'onColumnAdd',
                columnhide: 'onColumnHide',
                columnremove: 'onColumnRemove',
                columnshow: 'onColumnShow',
                horizontaloverflowchange: 'onGridHorizontalOverflowChange'
            });
        },

        setupHeaderSync: function() {
            var me = this,
                grids = me.gridItems,
                len = grids.length,
                headers = [],
                i;

            for (i = 0; i < len; ++i) {
                headers.push(grids[i].getHeaderContainer());
            }

            me.headerSync = new Ext.util.HeightSynchronizer(headers, me.isHeaderVisible.bind(me));
        }
    }
});
