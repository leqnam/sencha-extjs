Ext.define('Ext.locale.de.pivot.Aggregators', {
    override: 'Ext.pivot.Aggregators',

    customText:                 'Custom',
    sumText:                    'Summe',
    avgText:                    'Durchschnitt',
    countText:                  'Anzahl',
    minText:                    'Min',
    maxText:                    'Max',
    groupSumPercentageText:     'Prozent Blocksumme',
    groupCountPercentageText:   'Prozent Gesamtanzahl',
    varianceText:               'Var',
    variancePText:              'Varp',
    stdDevText:                 'StdDev',
    stdDevPText:                'StdDevp'
});
/**
 * German translation by Daniel Grana
 *
 */

Ext.define('Ext.locale.de.pivot.Grid', {
    override: 'Ext.pivot.Grid',

    textTotalTpl:       'Summe ({name})',
    textGrandTotalTpl:  'Gesamtsumme'
});
Ext.define('Ext.locale.de.pivot.plugin.RangeEditor', {
    override: 'Ext.pivot.plugin.RangeEditor',

    textWindowTitle:    'Bereichseditor',
    textFieldValue:     'Wert',
    textFieldEdit:      'Feld',
    textFieldType:      'Typ',
    textButtonOk:       'Ok',
    textButtonCancel:   'Abbrechen',

    updaters: [
        ['percentage', 'Prozent'],
        ['increment', 'Zunahme'],
        ['overwrite', 'Überschreiben'],
        ['uniform', 'Einheitlich']
    ]
});
Ext.define('Ext.locale.de.pivot.plugin.configurator.Column', {
    override: 'Ext.pivot.plugin.configurator.Column',

    sortAscText:                'Sortierung A - Z',
    sortDescText:               'Sortierung Z - A',
    sortClearText:              'Sortierung ausschalten',
    clearFilterText:            'Filter löschen "{0}"',
    labelFiltersText:           'Filter Label',
    valueFiltersText:           'Filter Werte',
    equalsText:                 'Gleich...',
    doesNotEqualText:           'Ist ungleich...',
    beginsWithText:             'Beginnt mit...',
    doesNotBeginWithText:       'Beginnt nicht mit...',
    endsWithText:               'Endet mit...',
    doesNotEndWithText:         'Endet nicht mit...',
    containsText:               'Enthält...',
    doesNotContainText:         'Enthält nicht...',
    greaterThanText:            'Grösser als...',
    greaterThanOrEqualToText:   'Grösser als oder gleich...',
    lessThanText:               'Kleiner als...',
    lessThanOrEqualToText:      'Kleiner als oder gleich...',
    betweenText:                'Zwischen...',
    notBetweenText:             'Nicht zwischen...',
    top10Text:                  'Top 10...',

    equalsLText:                'gleich',
    doesNotEqualLText:          'ungleich',
    beginsWithLText:            'beginnt mit',
    doesNotBeginWithLText:      'beginnt nicht mit',
    endsWithLText:              'endet mit',
    doesNotEndWithLText:        'ende nicht mit',
    containsLText:              'enthält',
    doesNotContainLText:        'enthält nicht',
    greaterThanLText:           'ist grösser als',
    greaterThanOrEqualToLText:  'ist grösser oder gleich als',
    lessThanLText:              'ist kleiner als',
    lessThanOrEqualToLText:     'ist kleiner oder gleich als',
    betweenLText:               'ist zwischen',
    notBetweenLText:            'ist nicht zwischen',
    top10LText:                 'Top 10...',
    topOrderTopText:            'Top',
    topOrderBottomText:         'Unten',
    topTypeItemsText:           'Einträge',
    topTypePercentText:         'Prozent',
    topTypeSumText:             'Summe'
});
Ext.define('Ext.locale.de.pivot.plugin.configurator.Panel', {
    override: 'Ext.pivot.plugin.configurator.Panel',

    panelAllFieldsText:     'Unbenutzte Felder hier platzieren',
    panelTopFieldsText:     'Felder für Spalten hier platzieren',
    panelLeftFieldsText:    'Felder für Zeilen hier platzieren',
    panelAggFieldsText:     'Felder für Summen hier platzieren',
    panelAllFieldsTitle:    'All fields',
    panelTopFieldsTitle:    'Column labels',
    panelLeftFieldsTitle:   'Row labels',
    panelAggFieldsTitle:    'Values',
    addToText:              'Add to {0}',
    moveToText:             'Move to {0}',
    removeFieldText:        'Remove field',
    moveUpText:             'Move up',
    moveDownText:           'Move down',
    moveBeginText:          'Move to beginning',
    moveEndText:            'Move to end',
    formatText:             'Format as',
    fieldSettingsText:      'Field settings'
});
Ext.define('Ext.locale.de.pivot.plugin.configurator.window.FieldSettings', {
    override: 'Ext.pivot.plugin.configurator.window.FieldSettings',

    title:              'Field settings',
    formatText:         'Format as',
    summarizeByText:    'Summarize by',
    customNameText:     'Custom name',
    sourceNameText:     'Source name',
    alignText:          'Align',
    alignLeftText:      'Left',
    alignCenterText:    'Center',
    alignRightText:     'Right'
});
Ext.define('Ext.locale.de.pivot.plugin.configurator.window.FilterLabel', {
    override: 'Ext.pivot.plugin.configurator.window.FilterLabel',

    titleText:          'Filter Label ({0})',
    fieldText:          'Zeige Einträge mit Label',
    caseSensitiveText:  'Gross-/Kleinschreibung beachten'
});
Ext.define('Ext.locale.de.pivot.plugin.configurator.window.FilterTop', {
    override: 'Ext.pivot.plugin.configurator.window.FilterTop',

    titleText:      'Top 10 Filter ({0})',
    fieldText:      'Anzeigen',
    sortResultsText:'Sortiere Ergebnisse'
});
Ext.define('Ext.locale.de.pivot.plugin.configurator.window.FilterValue', {
    override: 'Ext.pivot.plugin.configurator.window.FilterValue',

    titleText:      'Filter Werte ({0})',
    fieldText:      'Zeige Einträge mit'
});
