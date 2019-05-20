/**
 * For an overview of calendar panels see {@link Ext.calendar.panel.Base}
 *
 * A panel for display a Week. Composes a {@link Ext.calendar.view.Week Week View} with a
 * {@link Ext.calendar.header.Base docked header}.
 *
 * The Week panel displays the week containing the current date (or the date
 * set on the {@link #cfg-value} config).  The number of days configured on the
 * {@link #cfg-visibleDays} config (defaults to 7) are displayed starting with the value
 * set on the {@link #cfg-firstDayOfWeek}.
 *
 * By default the first day is Sunday.  If you want to create a "work week" type view
 * where the weekend days are omitted you can modify the `visibleDays` and
 * `firstDayOfWeek` to show only Monday - Friday.
 *
 *     Ext.create({
 *         xtype: 'calendar-weekview',
 *         renderTo: Ext.getBody(),
 *         height: 400,
 *         width: 400,
 *         firstDayOfWeek: 1,  // starts the view on Monday
 *         visibleDays: 5,     // and displays it and the 4 days after
 *         store: {
 *             autoLoad: true,
 *             proxy: {
 *                 type: 'ajax',
 *                 url: 'calendars.php'
 *             },
 *             eventStoreDefaults: {
 *                 proxy: {
 *                     type: 'ajax',
 *                     url: 'events.php'
 *                 }
 *             }
 *         }
 *     });
 *
 * ### Date Range Navigation
 *
 * The {@link #cfg-movePrevious} and {@link #cfg-moveNext} methods modify the displayed
 * date range by moving the range forward or backward one week.
 *
 * i.e.  `panel.moveNext();` called on a 7-day view 1 week.  **Note** that a panel
 * configured with 5 `visibleDays` would not advance 5 days, but rather will show the
 * next full week with only 5 visible days.
 *
 * ### Alternative Classes
 *
 * To display fewer days consider using {@link Ext.calendar.panel.Day} or
 * {@link Ext.calendar.panel.Days}.
 */
Ext.define('Ext.calendar.panel.Week', {
    extend: 'Ext.calendar.panel.Days',
    xtype: 'calendar-week',

    requires: [
        'Ext.calendar.view.Week'
    ],

    config: {
        view: {
            xtype: 'calendar-weekview'
        }
    },

    configExtractor: {
        /**
         * @cfg view
         * @inheritdoc
         */
        view: {
            /**
             * @cfg firstDayOfWeek
             * @inheritdoc Ext.calendar.view.Week#cfg-firstDayOfWeek
             */
            firstDayOfWeek: true

            /**
             * @cfg value
             * @inheritdoc Ext.calendar.view.Week#cfg-value
             */

            /**
             * @cfg visibleDays
             * @inheritdoc Ext.calendar.view.Week#cfg-visibleDays
             */
        }
    }
});
