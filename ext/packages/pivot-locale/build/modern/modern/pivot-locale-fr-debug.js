Ext.define('Ext.locale.fr.pivot.Aggregators', {
    override: 'Ext.pivot.Aggregators',

    customText:                 'Custom',
    sumText:                    'Somme',
    avgText:                    'Moyenne',
    countText:                  'Nombre',
    minText:                    'Min',
    maxText:                    'Max',
    groupSumPercentageText:     'Pourcentage somme cumulée',
    groupCountPercentageText:   'Pourcentage nombre cumulé',
    varianceText:               'Var',
    variancePText:              'Varp',
    stdDevText:                 'StdDev',
    stdDevPText:                'StdDevp'
});
/**
 * French translation by Daniel Grana
 *
 */

Ext.define('Ext.locale.fr.pivot.Grid', {
    override: 'Ext.pivot.Grid',

    textTotalTpl:       'Total ({name})',
    textGrandTotalTpl:  'Total général'
});
Ext.define('Ext.locale.fr.pivot.plugin.DrillDown', {
    override: 'Ext.pivot.plugin.DrillDown',

    titleText: 'Explorer en détail',
    doneText: 'Terminé'
});
Ext.define('Ext.locale.fr.pivot.plugin.configurator.Form', {
    override: 'Ext.pivot.plugin.configurator.Form',

    okText:                     'Ok',
    cancelText:                 'Annuler',
    formatText:                 'Formater en tant que',
    summarizeByText:            'Résumer par',
    customNameText:             "Nom personalisé",
    sourceNameText:             'Le nom de la source pour ce champ est "{form.dataIndex}"',
    sortText:                   'Trier',
    filterText:                 'Filtrer',
    sortResultsText:            'Trier les résultats',
    alignText:                  'Aligner',
    alignLeftText:              'A gauche',
    alignCenterText:            'Au centre',
    alignRightText:             'A droite',

    caseSensitiveText:          'Sensible aux majuscules et minuscules',
    valueText:                  'Valeur',
    fromText:                   'De',
    toText:                     'À',
    labelFilterText:            "Afficher les articles pour lesquels l'étiquette",
    valueFilterText:            'Afficher les articles pour lesquels',
    top10FilterText:            'Montrer',

    sortAscText:                'Trier A to Z',
    sortDescText:               'Trier Z to A',
    sortClearText:              'Désactiver triage',
    clearFilterText:            'Désactiver le filtrage',
    labelFiltersText:           'Filtres label',
    valueFiltersText:           'Filtres valeurs',
    top10FiltersText:           'Top 10 des filtres',

    equalsLText:                'Égal à',
    doesNotEqualLText:          'Pas égal à',
    beginsWithLText:            'Commence avec',
    doesNotBeginWithLText:      'Ne commence pas avec',
    endsWithLText:              'Termine avec',
    doesNotEndWithLText:        'Ne termine pas avec',
    containsLText:              'Contient',
    doesNotContainLText:        'Ne contient pas',
    greaterThanLText:           'Est supérieur à',
    greaterThanOrEqualToLText:  'Est supérieur ou égal à',
    lessThanLText:              'Est inférieur à',
    lessThanOrEqualToLText:     'Est inférieur ou égal à',
    betweenLText:               'Est entre',
    notBetweenLText:            'N\'est pas entre',
    top10LText:                 'Top 10...',
    topOrderTopText:            'Top',
    topOrderBottomText:         'Dessous',
    topTypeItemsText:           'Entrées',
    topTypePercentText:         'Pourcentage',
    topTypeSumText:             'Somme',
 
    requiredFieldText: 'Ce champ est obligatoire',
    operatorText: 'Opérateur',
    dimensionText: 'Dimension',
    orderText: 'Commande',
    typeText: 'Type'
});
Ext.define('Ext.locale.fr.pivot.plugin.configurator.Panel', {
    override: 'Ext.pivot.plugin.configurator.Panel',

    panelTitle: 'Configuration',
    cancelText: 'Annuler',
    okText: 'Terminé',

    panelAllFieldsText: 'Déposer les champs inutilisés ici',
    panelAllFieldsTitle: 'Tous les champs',
    panelTopFieldsText: 'Déposer les champs de colonne ici',
    panelTopFieldsTitle: 'Titres de colonne',
    panelLeftFieldsText: 'Déposer les champs de lignes ici',
    panelLeftFieldsTitle: 'Titres de ligne',
    panelAggFieldsText: 'Laissez les champs Agg ici',
    panelAggFieldsTitle: 'Valeurs'
});

Ext.define('Ext.locale.fr.pivot.plugin.configurator.Settings', {
    override: 'Ext.pivot.plugin.configurator.Settings',

    titleText: 'Paramètres',
    okText: 'Ok',
    cancelText: 'Annuler',
    layoutText: 'Disposition',
    outlineLayoutText: 'Contour',
    compactLayoutText: 'Compact',
    tabularLayoutText: 'Tabulaire',
    firstPositionText: 'Premier',
    hidePositionText: 'Cacher',
    lastPositionText: 'Dernier',
    rowSubTotalPositionText: 'Position de sous-total de la ligne',
    columnSubTotalPositionText: 'Position de sous-total de la colonne',
    rowTotalPositionText: 'Position totale de la ligne',
    columnTotalPositionText: 'Position totale de la colonne',
    showZeroAsBlankText: 'Afficher zéro comme blanc',
    yesText: 'Oui',
    noText: 'Non'
});
Ext.define('Ext.locale.fr.pivot.plugin.rangeeditor.Panel', {
    override: 'Ext.pivot.plugin.rangeeditor.Panel',

    titleText:      'Editeur de plage',
    valueText:      'Valeur',
    fieldText:      'Le champ Source est "{form.dataIndex}"',
    typeText:       'Type',
    okText:         'Ok',
    cancelText:     'Annuler'
});
