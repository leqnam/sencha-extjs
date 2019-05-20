Ext.define('Ext.locale.da.pivot.Aggregators', {
    override: 'Ext.pivot.Aggregators',

    customText:                 'Custom',
    sumText:                    'Sum',
    avgText:                    'Gns',
    countText:                  'Antal',
    minText:                    'Min',
    maxText:                    'Max',
    groupSumPercentageText:     'Gruppe sum procent',
    groupCountPercentageText:   'Gruppe antal procent',
    varianceText:               'Var',
    variancePText:              'Varp',
    stdDevText:                 'StdDev',
    stdDevPText:                'StdDevp'
});
/**
 * Danish translation by Steen Ole Andersen
 *
 */

Ext.define('Ext.locale.da.pivot.Grid', {
    override: 'Ext.pivot.Grid',

    textTotalTpl:       'Total ({name})',
    textGrandTotalTpl:  'Grand total'
});
Ext.define('Ext.locale.da.pivot.plugin.RangeEditor', {
    override: 'Ext.pivot.plugin.RangeEditor',

    textWindowTitle:    'Range editor',
    textFieldValue:     'Værdi',
    textFieldEdit:      'Felt',
    textFieldType:      'Type',
    textButtonOk:       'Ok',
    textButtonCancel:   'Fortryd',

    updaters: [
        ['percentage', 'Procent'],
        ['increment', 'Forøg'],
        ['overwrite', 'Overskriv'],
        ['uniform', 'Ensartet']
    ]

});
Ext.define('Ext.locale.da.pivot.plugin.configurator.Column', {
    override: 'Ext.pivot.plugin.configurator.Column',

    sortAscText:                'Sorter A to Z',
    sortDescText:               'Sorter Z to A',
    sortClearText:              'Fravælg sortering',
    clearFilterText:            'Slet filter fra "{0}"',
    labelFiltersText:           'Label filtre',
    valueFiltersText:           'Værdi filtre',
    equalsText:                 'Lig med...',
    doesNotEqualText:           'Ej lig med...',
    beginsWithText:             'Begynder med...',
    doesNotBeginWithText:       'Begynder ikke med...',
    endsWithText:               'Slutter med...',
    doesNotEndWithText:         'Slutter ikke med...',
    containsText:               'Indeholder...',
    doesNotContainText:         'Indeholder ikke...',
    greaterThanText:            'Større end...',
    greaterThanOrEqualToText:   'Større end eller lig med...',
    lessThanText:               'Mindre end...',
    lessThanOrEqualToText:      'Mindre end eller lig med...',
    betweenText:                'Mellem...',
    notBetweenText:             'Ikke mellem...',
    top10Text:                  'Top 10...',

    equalsLText:                'lig med',
    doesNotEqualLText:          'ej lig med',
    beginsWithLText:            'begynder med',
    doesNotBeginWithLText:      'begynder ikke med',
    endsWithLText:              'slutter med',
    doesNotEndWithLText:        'slutter ikke med',
    containsLText:              'indeholder',
    doesNotContainLText:        'indeholder ikke',
    greaterThanLText:           'er større end',
    greaterThanOrEqualToLText:  'er større end eller lig med',
    lessThanLText:              'er mindre end',
    lessThanOrEqualToLText:     'er mindre end eller lig med',
    betweenLText:               'er mellem',
    notBetweenLText:            'ikke er mellem',
    top10LText:                 'Top 10...',
    topOrderTopText:            'Øverst',
    topOrderBottomText:         'Nederst',
    topTypeItemsText:           'Elementer',
    topTypePercentText:         'Procent',
    topTypeSumText:             'Sum'

});
Ext.define('Ext.locale.da.pivot.plugin.configurator.Panel', {
    override: 'Ext.pivot.plugin.configurator.Panel',

    panelAllFieldsText:     'Drop ubrugte felter her',
    panelTopFieldsText:     'Drop kolonne felter her',
    panelLeftFieldsText:    'Drop række felter her',
    panelAggFieldsText:     'Drop agg felter her',
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
Ext.define('Ext.locale.da.pivot.plugin.configurator.window.FieldSettings', {
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
Ext.define('Ext.locale.da.pivot.plugin.configurator.window.FilterLabel', {
    override: 'Ext.pivot.plugin.configurator.window.FilterLabel',

    titleText:          'Label filter ({0})',
    fieldText:          'Vis elementer for hvilke',
    caseSensitiveText:  'Case sensitive'
});
Ext.define('Ext.locale.da.pivot.plugin.configurator.window.FilterTop', {
    override: 'Ext.pivot.plugin.configurator.window.FilterTop',

    titleText:      'Top 10 filter ({0})',
    fieldText:      'Vis',
    sortResultsText:'Sorter resultat'
});
Ext.define('Ext.locale.da.pivot.plugin.configurator.window.FilterValue', {
    override: 'Ext.pivot.plugin.configurator.window.FilterValue',

    titleText:      'Value filter ({0})',
    fieldText:      'Vis elementer for hvilke'
});
