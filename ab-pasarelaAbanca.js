'use strict'

/**
 * @module Abanca
 */

/** SHA1 library */
const sha1 = require('sha1')

/** Abanca class */
module.exports = class {
    /**
     * abAbanca constructor.
     * @param {string} cyphKey - Key given by Abanca
     * @param {string} MerchantID - Given by Abanca
     * @param {string} AcquirerBIN - Given by Abanca
     * @param {string} TerminalID - Given by Abanca
     * @param {string} Cifrado - Constant: 'SHA1'
     * @param {number} TipoMoneda - Euro value: 978
     * @param {number} Exponente - Constant: 2
     * @param {string} Pago_soportado - Constatant: 'SSL'
     * @param {number} Idioma - Spanish value: 1
     * @param {string} tpvUrl - Url of Abanca's tpv server
     */
    constructor(cyphKey, MerchantID, AcquirerBIN, TerminalID, Cifrado, TipoMoneda, Exponente, Pago_soportado, Idioma, tpvUrl) {
        this.cyphKey = cyphKey
        this.MerchantID = MerchantID
        this.AcquirerBIN = AcquirerBIN
        this.TerminalID = TerminalID
        this.Cifrado = Cifrado
        this.TipoMoneda = TipoMoneda
        this.Exponente = Exponente
        this.Pago_soportado = Pago_soportado
        this.Idioma = Idioma
        this.tpvUrl = tpvUrl
    }


    /**
     * Creates a signed form ready for be submited to Abanca's server
     * @param {String} Num_operacion - Id of the operation. Unique for each operation (_id).
     * @param {String} Importe - Pay ammount. Must be an integer and the two las positions should be the decimals.
     * @param {String} urlOk - Url to redirect if operation finish succesfully.
     * @param {String} urlNok - Url to redirect if operation finish errored.
     * @return {String} Form signed ready to submit.
     */
    getFormSigned(Num_operacion, Importe, urlOk, urlNok) {
        var sign = sha1(this.cyphKey + this.MerchantID + this.AcquirerBIN +
            this.TerminalID + Num_operacion + Importe + this.TipoMoneda +
            this.Exponente + this.Cifrado + urlOk + urlNok);
        return `<form id="abanca_form" ACTION=" ${this.tpvUrl} " METHOD="POST" ENCTYPE="application/x-www-form-urlencoded">
            <input name="MerchantID" type="hidden" value=" ${this.MerchantID} ">
            <input name="AcquirerBIN" type="hidden" value=" ${this.AcquirerBIN} ">
            <input name="TerminalID" type="hidden" value=" ${this.TerminalID} ">
            <input name="URL_OK" type="hidden" value=" ${urlOk} ">
            <input name="URL_NOK" type="hidden" value=" ${urlMok} ">
            <input name="Firma" type="hidden" value=" ${sign} ">
            <input name="Cifrado" type="hidden" value=" ${this.Cifrado} ">
            <input name="Num_operacion" type="hidden" value=" ${Num_operacion} ">
            <input name="Importe" type="hidden" value=" ${Importe} ">
            <input name="TipoMoneda" type="hidden" value=" ${this.TipoMoneda} ">
            <input name="Exponente" type="hidden" value=" ${this.Exponente} ">
            <input name="Pago_soportado" type="hidden" value=" ${this.Pago_soportado} ">
            <input name="Idioma" type="hidden" value=" ${this.Idioma} ">
            </form>`
    }

    /**
     * Return true if the signature is correct
     * @param {String} sign - Signature of the Abanca's server response.
     * @param {String} Num_operacion - Id of the operation. Unique for each operation (_id).
     * @param {String} Importe - Pay ammount. Must be an integer and the two las positions should be the decimals.
     * @param {String} Referencia - Reference returned on the Abanca's response.
     * @return {Boolean} Is correctly signed or not.
     */
    isValid(sign, Num_operacion, Importe, Referencia) {
        return (sign === sha1(this.cyphKey + this.MerchantID + this.AcquirerBIN +
            this.TerminalID + Num_operacion + Importe + this.TipoMoneda +
            this.Exponente + Referencia))
    }

    /**
     * Return ok response to Abanca's server
     * @param {String} message - Optional message to include on response.
     * @return {String} Response.
     */
    getResponseOk(message = 'Respuesta correcta a la comunicación ONLINE.') {
        return `<HTML>
            <HEAD>
            <TITLE> ${message} </TITLE>
            </HEAD>
            <BODY>
            $*$OKY$*$
            </BODY>
            </HTML>`
    }

    /**
     * Return not ok response to Abanca's server
     * @param {String} message - Optional message to include on response.
     * @return {String} Response.
     */
    getResponseNok(message = 'Error en la comunicación con el TPV virtual.') {
        return `<HTML>
            <HEAD>
            <TITLE> ${message} </TITLE>
            </HEAD>
            <BODY>
            $*$ERROR$*$
            </BODY>
            </HTML>`
    }
}
