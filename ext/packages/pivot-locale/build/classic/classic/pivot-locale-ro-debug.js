Ext.define('Ext.locale.ro.pivot.Aggregators', {
    override: 'Ext.pivot.Aggregators',

    customText:                 'Custom',
    sumText:                    'Suma',
    avgText:                    'Media',
    countText:                  'Nr. de inregistrari',
    minText:                    'Minim',
    maxText:                    'Maxim',
    groupSumPercentageText:     '% din suma grupului',
    groupCountPercentageText:   '% din nr. de inregistrari al grupului',
    varianceText:               'Var',
    variancePText:              'Varp',
    stdDevText:                 'StdDev',
    stdDevPText:                'StdDevp'
});
Ext.define('Ext.locale.ro.pivot.Grid', {
    override: 'Ext.pivot.Grid',

    textTotalTpl:       'Subtotal ({name})',
    textGrandTotalTpl:  'Total general'
});
Ext.define('Ext.locale.ro.pivot.plugin.RangeEditor', {
    override: 'Ext.pivot.plugin.RangeEditor',

    textWindowTitle:    'Modifica inregistrarile',
    textFieldValue:     'Valoare',
    textFieldEdit:      'Campul editat',
    textFieldType:      'Tip de editare',
    textButtonOk:       'Ok',
    textButtonCancel:   'Anuleaza',

    updaters: [
        ['percentage', 'Procent'],
        ['increment', 'Incrementeaza'],
        ['overwrite', 'Suprascrie'],
        ['uniform', 'Uniform']
    ]
});
Ext.define('Ext.locale.ro.pivot.plugin.configurator.Column', {
    override: 'Ext.pivot.plugin.configurator.Column',

    sortAscText:                'Sorteaza alfabetic',
    sortDescText:               'Sorteaza invers alfabetic',
    sortClearText:              'Dezactiveaza sortarea',
    clearFilterText:            'Sterge filtrul pentru "{0}"',
    labelFiltersText:           'Filtre pentru etichete',
    valueFiltersText:           'Filtre pentru valori',
    equalsText:                 'Egal cu...',
    doesNotEqualText:           'Nu este egal cu...',
    beginsWithText:             'Incepe cu...',
    doesNotBeginWithText:       'Nu incepe cu...',
    endsWithText:               'Se termina in...',
    doesNotEndWithText:         'Nu se termina in...',
    containsText:               'Contine...',
    doesNotContainText:         'Nu contine...',
    greaterThanText:            'Mai mare ca...',
    greaterThanOrEqualToText:   'Mai mare sau egal cu...',
    lessThanText:               'Mai mic ca...',
    lessThanOrEqualToText:      'Mai mic sau egal cu...',
    betweenText:                'In intervalul...',
    notBetweenText:             'In afara intervalului...',
    top10Text:                  'Top 10...',

    equalsLText:                'egal cu',
    doesNotEqualLText:          'nu este egal cu',
    beginsWithLText:            'incepe cu',
    doesNotBeginWithLText:      'nu incepe cu',
    endsWithLText:              'se termina in',
    doesNotEndWithLText:        'nu se termina in',
    containsLText:              'contine',
    doesNotContainLText:        'nu contine',
    greaterThanLText:           'este mai mare ca',
    greaterThanOrEqualToLText:  'este mai mare sau egal cu',
    lessThanLText:              'este mai mic',
    lessThanOrEqualToLText:     'este mai mic sau egal cu',
    betweenLText:               'este in intervalul',
    notBetweenLText:            'nu este in intervalul',
    top10LText:                 'Top 10...',
    topOrderTopText:            'La inceput',
    topOrderBottomText:         'La sfarsit',
    topTypeItemsText:           'Inregistrari',
    topTypePercentText:         'Procent',
    topTypeSumText:             'Suma'
});
Ext.define('Ext.locale.ro.pivot.plugin.configurator.Panel', {
    override: 'Ext.pivot.plugin.configurator.Panel',

    panelAllFieldsText:     'Trage aici campurile nefolosite',
    panelTopFieldsText:     'Trage aici campurile pt coloane',
    panelLeftFieldsText:    'Trage aici campurile pt linii',
    panelAggFieldsText:     'Trage aici campurile de calculat',
    panelAllFieldsTitle:    'Toate campurile',
    panelTopFieldsTitle:    'Coloane',
    panelLeftFieldsTitle:   'Randuri',
    panelAggFieldsTitle:    'Valori',
    addToText:              'Adauga la {0}',
    moveToText:             'Muta in {0}',
    removeFieldText:        'Sterge',
    moveUpText:             'Muta sus',
    moveDownText:           'Muta jos',
    moveBeginText:          'Muta la inceput',
    moveEndText:            'Muta la sfarsit',
    formatText:             'Arata ca',
    fieldSettingsText:      'Configurare'
});
Ext.define('Ext.locale.ro.pivot.plugin.configurator.window.FieldSettings', {
    override: 'Ext.pivot.plugin.configurator.window.FieldSettings',

    title:              'Configuratie camp',
    formatText:         'Afiseaza ca',
    summarizeByText:    'Formula de calcul',
    customNameText:     'Redenumeste',
    sourceNameText:     'Sursa',
    alignText:          'Aliniere',
    alignLeftText:      'Stanga',
    alignCenterText:    'Centru',
    alignRightText:     'Dreapta'
});
Ext.define('Ext.locale.ro.pivot.plugin.configurator.window.FilterLabel', {
    override: 'Ext.pivot.plugin.configurator.window.FilterLabel',

    titleText:          'Filtreaza etichetele ({0})',
    fieldText:          'Arata inregistrarile pt care eticheta',
    caseSensitiveText:  'Cautare exacta'
});
Ext.define('Ext.locale.ro.pivot.plugin.configurator.window.FilterTop', {
    override: 'Ext.pivot.plugin.configurator.window.FilterTop',

    titleText:      'Filtru Top 10 ({0})',
    fieldText:      'Arata',
    sortResultsText:'Sorteaza rezultatele'
});
Ext.define('Ext.locale.ro.pivot.plugin.configurator.window.FilterValue', {
    override: 'Ext.pivot.plugin.configurator.window.FilterValue',

    titleText:      'Filtreaza valorile ({0})',
    fieldText:      'Arata inregistrarile pt care'
});
