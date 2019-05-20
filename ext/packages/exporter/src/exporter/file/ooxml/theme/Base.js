/**
 * The theme is the root-level complex type associated with a shared-style sheet.
 * This complex type holds all of the different formatting options available to a
 * theme, and defines the overall look and feel of a document when themed objects
 * are used within the document.
 *
 * A theme consists of four main parts, although the themeElements element is the
 * piece that holds the main formatting defined within the theme. The other parts
 * provide overrides, defaults, and additions to the information contained in
 * themeElements.
 *
 * (CT_OfficeStyleSheet)
 * @private
 */
Ext.define('Ext.exporter.file.ooxml.theme.Base', {
    extend: 'Ext.exporter.file.ooxml.XmlRels',

    alias: 'ooxmltheme.base',

    mixins: [
        'Ext.mixin.Factoryable'
    ],

    folder: '/theme/',
    fileName: 'theme',

    contentType: {
        contentType: 'application/vnd.openxmlformats-officedocument.theme+xml'
    },

    relationship: {
        schema: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme'
    }
});
