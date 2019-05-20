/**
 * Represents a single item in PivotTable field.
 *
 * (CT_Item)
 * @private
 */
Ext.define('Ext.exporter.file.ooxml.excel.FieldItem', {
    extend: 'Ext.exporter.file.ooxml.Base',

    config: {
        /**
         * @cfg {Boolean} c
         *
         * Specifies a boolean value that indicates whether the approximate number of child items
         * for this item is greater than zero.
         *
         * A value of 1 or true indicates the approximate number of child items for this item
         * is greater than zero.
         *
         * A value of 0 or false indicates the approximate number of child items for this item
         * is zero.
         */
        c: null,
        
        /**
         * @cfg {Boolean} d
         *
         * Specifies a boolean value that indicates whether this item has been expanded
         * in the PivotTable view.
         *
         * A value of 1 or true indicates this item has been expanded.
         *
         * A value of 0 or false indicates this item is collapsed.
         */
        d: null,
        
        /**
         * @cfg {Boolean} e
         *
         * Specifies a boolean value that indicates whether attribute hierarchies nested next
         * to each other on a PivotTable row or column will offer drilling "across" each other
         * or not.
         *
         * [Example: if the application offers drill across for attribute hierarchies and not
         * for user hierarchies, this attribute would only be written when two attribute hierarchies
         * are placed next to each other on an axis. end example]
         *
         * A value of 1 or true indicates there is a drill across attribute hierarchies positioned
         * next to each other on a pivot axis.
         *
         * A value of 0 or false indicates there is not drill across attribute hierarchies.
         */
        e: null,
        
        /**
         * @cfg {Boolean} f
         *
         * Specifies a boolean value that indicates whether this item is a calculated member.
         *
         * A value of 1 or true indicates this item is a calculated member.
         *
         * A value of 0 or false indicates this item is not calculated.
         */
        f: null,
        
        /**
         * @cfg {Boolean} h
         *
         * Specifies a boolean value that indicates whether the item is hidden.
         *
         * A value of 1 or true indicates item is hidden.
         */
        h: null,
        
        /**
         * @cfg {Boolean} m
         *
         * Specifies a boolean value that indicate whether the item has a missing value.
         *
         * A value of 1 or true indicates the item value is missing. The application should still
         * retain the item settings in case the item reappears during a later refresh.
         */
        m: null,
        
        /**
         * @cfg {String} n
         *
         * Specifies the user caption of the item.
         */
        n: null,
        
        /**
         * @cfg {Boolean} s
         *
         * Specifies a boolean value that indicates whether the item has a character value.
         *
         * A value of 1 or true indicates the item has a string/character value.
         *
         * A value of 0 or false indicates item the item has a value of a different type.
         */
        s: null,
        
        /**
         * @cfg {Boolean} sd
         *
         * Specifies a boolean value that indicates whether the details are hidden for this item.
         *
         * A value of 1 or true indicates item details are hidden.
         *
         * A value of 0 or false indicates item details are shown.
         */
        sd: null,
        
        /**
         * @cfg {String} t
         *
         * Specifies the type of this item. A value of `default` indicates the subtotal or total
         * item.
         *
         * Possible values:
         *
         *  - `avg` (Average): Indicates the pivot item represents an "average" aggregate function.
         *  - `blank` (Blank Pivot Item): Indicates the pivot item represents a blank line.
         *  - `count` (Count): Indicates the pivot item represents custom the "count" aggregate."
         *  - `countA` (CountA): Indicates the pivot item represents the "count numbers" aggregate
         *  function.
         *  - `data` (Data): Indicate the pivot item represents data.
         *  - `default` (Default): Indicates the pivot item represents the default type for this
         *  PivotTable. The default pivot item type is the "total" aggregate function.
         *  - `grand` (Grand Total Item): Indicates the pivot items represents the grand total line.
         *  - `max` (Max): Indicates the pivot item represents the "maximum" aggregate function.
         *  - `min` (Min): Indicates the pivot item represents the "minimum" aggregate function.
         *  - `product` (Product): Indicates the pivot item represents the "product" function.
         *  - `stdDev` (stdDev): Indicates the pivot item represents the "standard deviation"
         *  aggregate function.
         *  - `stdDevP` (StdDevP): Indicates the pivot item represents the "standard deviation
         *  population" aggregate function.
         *  - `sum` (Sum): Indicates the pivot item represents the "sum" aggregate value.
         *  - `var` (Var): Indicates the pivot item represents the "variance" aggregate value.
         *  - `varP` (VarP): Indicates the pivot item represents the "variance population" aggregate
         *  value.
         */
        t: null,
        
        /**
         * @cfg {Number} [x]
         *
         * Specifies the item index in pivotFields collection in the PivotCache.
         */
        x: null
    },

    /**
     * @cfg generateTplAttributes
     * @inheritdoc Ext.exporter.file.ooxml.Base#property!generateTplAttributes
     * @localdoc
     *
     * **Note** Do not rename the config names that are part of the `attributes` since they are
     * mapped to the xml attributes needed by the template.
     */
    generateTplAttributes: true,

    tpl: [
        '<item {attributes}/>'
    ]
});
