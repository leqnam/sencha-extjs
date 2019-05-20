Ext.define('Ext.locale.it.pivot.Aggregators', {
    override: 'Ext.pivot.Aggregators',

    customText:                 'Custom',
    sumText:                    'Somma',
    avgText:                    'Media',
    countText:                  'Conteggio',
    minText:                    'Minimo',
    maxText:                    'Massimo',
    groupSumPercentageText:     'Gruppo somma percentuale',
    groupCountPercentageText:   'Gruppo conteggio percentuale',
    varianceText:               'Var',
    variancePText:              'Varp',
    stdDevText:                 'StdDev',
    stdDevPText:                'StdDevp'
});
/**
 * Italian translation by Federico Anzini
 *
 */

Ext.define('Ext.locale.it.pivot.Grid', {
    override: 'Ext.pivot.Grid',

    textTotalTpl:       'Totale ({name})',
    textGrandTotalTpl:  'Totale globale'
});
Ext.define('Ext.locale.it.pivot.plugin.DrillDown', {
    override: 'Ext.pivot.plugin.DrillDown',

    titleText: 'Mostra dettagli',
    doneText: 'Fatto'
});
Ext.define('Ext.locale.it.pivot.plugin.configurator.Form', {
    override: 'Ext.pivot.plugin.configurator.Form',

    okText:                     'Ok',
    cancelText:                 'Annulla',
    formatText:                 'Formato come',
    summarizeByText:            'Riassumi di',
    customNameText:             'Nome personalizzato',
    sourceNameText:             'Il nome sorgente per questo campo è "{form.dataIndex}"',
    sortText:                   'Ordina',
    filterText:                 'Filtro',
    sortResultsText:            'Ordinare risultati',
    alignText:                  'Allinea',
    alignLeftText:              'Sinistra',
    alignCenterText:            'Centro',
    alignRightText:             'Destra',

    caseSensitiveText:          'differenziare le maiuscole dalle minuscole',
    valueText:                  'Valore',
    fromText:                   'Dal',
    toText:                     'A',
    labelFilterText:            "Mostra elementi per i quali l'etichetta",
    valueFilterText:            'Mostra elementi per i quali',
    top10FilterText:            'Mostra',

    sortAscText:                'Ordinamento A to Z',
    sortDescText:               'Ordinamento Z to A',
    sortClearText:              "Disabilitare l'ordinamento",
    clearFilterText:            'Disabilitare i filtri',
    labelFiltersText:           'Etichettare i filtri',
    valueFiltersText:           'Filtri di valore',
    top10FiltersText:           'I 10 migliori filtri',

    equalsLText:                'Uguale a',
    doesNotEqualLText:          'Non uguale a',
    beginsWithLText:            'Inizia con',
    doesNotBeginWithLText:      'Non inizia con',
    endsWithLText:              'Termina con',
    doesNotEndWithLText:        'Non termina con',
    containsLText:              'Contiene',
    doesNotContainLText:        'Non contiene',
    greaterThanLText:           'É più grande di',
    greaterThanOrEqualToLText:  'É più grande o uguale a',
    lessThanLText:              'É più piccolo di',
    lessThanOrEqualToLText:     'É più piccolo o uguale a',
    betweenLText:               'É compreso tra',
    notBetweenLText:            'Non è compreso tra',
    top10LText:                 'Top 10...',
    topOrderTopText:            'Sopra',
    topOrderBottomText:         'Sotto',
    topTypeItemsText:           'Elementi',
    topTypePercentText:         'Percentuale',
    topTypeSumText:             'Somma',
 
    requiredFieldText: 'Questo campo è obbligatorio',
    operatorText: 'Operatore',
    dimensionText: 'Dimensione',
    orderText: 'Ordine',
    typeText: 'Genere'
});
Ext.define('Ext.locale.it.pivot.plugin.configurator.Panel', {
    override: 'Ext.pivot.plugin.configurator.Panel',

    panelTitle:             'Configurazione',
    cancelText:             'Annulla',
    okText:                 'Fatto',

    panelAllFieldsText:     'Inserisci i campi inutilizzati qui',
    panelTopFieldsText:     'Inserisci i campi colonna qui',
    panelLeftFieldsText:    'Inserisci i campi riga qui',
    panelAggFieldsText:     'Inserisci i campi aggregati qui',
    panelAllFieldsTitle:    'Tutti i campi',
    panelTopFieldsTitle:    'Etichette di colonne',
    panelLeftFieldsTitle:   'Etichette di riga',
    panelAggFieldsTitle:    'Valori'
});

Ext.define('Ext.locale.it.pivot.plugin.configurator.Settings', {
    override: 'Ext.pivot.plugin.configurator.Settings',

    titleText: 'impostazioni',
    okText: 'Ok',
    cancelText: 'Annulla',
    layoutText: 'Layout',
    outlineLayoutText: 'Contorno',
    compactLayoutText: 'Compatto',
    tabularLayoutText: 'Tabellare',
    firstPositionText: 'Primo',
    hidePositionText: 'Nascondi',
    lastPositionText: 'Ultimo',
    rowSubTotalPositionText: 'Posizione subtotale di riga',
    columnSubTotalPositionText: 'Posizione subtotale della colonna',
    rowTotalPositionText: 'Riga posizione totale',
    columnTotalPositionText: 'Posizione totale della colonna',
    showZeroAsBlankText: 'Mostra zero come vuoto',
    yesText: 'Sì',
    noText: 'No'
});
Ext.define('Ext.locale.it.pivot.plugin.rangeeditor.Panel', {
    override: 'Ext.pivot.plugin.rangeeditor.Panel',

    titleText:      'Modifica intervallo',
    valueText:      'Valore',
    fieldText:      'Il campo sorgente è "{form.dataIndex}"',
    typeText:       'Tipo',
    okText:         'Ok',
    cancelText:     'Annulla'
});
