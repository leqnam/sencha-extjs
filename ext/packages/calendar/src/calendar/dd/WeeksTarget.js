/**
 * A target for events for {@link Ext.calendar.view.Weeks}.
 * 
 * @private
 */
Ext.define('Ext.calendar.dd.WeeksTarget', {
    extend: 'Ext.drag.Target',

    requires: [
        'Ext.calendar.date.Range'
    ],

    config: {
        view: null
    },

    updateView: function(view) {
        if (view) {
            this.setElement(view.element);
        }
    },

    accepts: function(info) {
        return Ext.Array.contains(info.types, 'calendar-event');
    },

    onDragMove: function(info) {
        var D = Ext.Date,
            view = info.view,
            cursor = info.cursor.current,
            span = info.span,
            cell, d, end;

        if (info.valid) {
            cell = view.getCellByPosition(cursor.x, cursor.y);
            d = end = view.getDateFromCell(cell);

            end = D.add(d, D.DAY, span - 1);
            view.selectRange(d, end);
        }
        
        this.callParent([info]);
    },

    onDragLeave: function(info) {
        this.getView().clearSelected();
        this.callParent([info]);
    },

    onDrop: function(info) {
        var D = Ext.Date,
            cursor = info.cursor.current,
            view = info.view,
            cell = view.getCellByPosition(cursor.x, cursor.y),
            event = info.event,
            difference;
            
        difference = this.calculateDifference(event, view.getDateFromCell(cell), info.startDate);

        view.handleChange('drop', event, new Ext.calendar.date.Range(
            // here we pass false on preventDstAdsjust because we want the time to remain the same
            // eg. if we move an appointment from 8:30AM November 4th to November 3rd, the time
            // time has to remain the same, adjusting DST would shift it to 9:30AM.
            D.add(event.getStartDate(), D.DAY, difference, false),
            D.add(event.getEndDate(), D.DAY, difference, false)
        ), function() {
            view.clearSelected();
        });

        this.callParent([info]);
    },

    destroy: function() {
        this.setView(null);
        this.callParent();
    },

    privates: {
        calculateDifference: function(event, d, startDate) {
            var D = Ext.Date,
                start = event.getStartDate(),
                before, difference;

            if (event.getAllDay()) {
                d = D.localToUtc(d);
                before = d < start;
            }
            else {
                before = d < startDate;
                start = startDate;
            }

            difference = D.diff(before ? d : start, before ? start : d, D.DAY);

            if (before) {
                difference = -difference;
            }

            return difference;
        }
    }
});
