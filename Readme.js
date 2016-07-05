/**
 * Crea una instancia de abAbanca con los datos estáticos
 */
const abanca = new abAbanca(cyphKey, MerchantID, AcquirerBIN, TerminalID, Cifrado, TipoMoneda, Exponente, Pago_soportado, Idioma, tpvUrl);

/**
 * Devuelve un formulario firmado y listo para enviar a la pasarela de pago
 */
let form = abanca.getFormSigned(urlOk, urlNok, Num_operacion, Importe)

/**
 * Valida la firma de los datos enviados desde la pasarela de pago
 */
let valid = abanca.isValid(sign, Num_operacion, Importe, Referencia)

/**
 * Devuelve la respuesta de confirmación de pago para enviar a la pasarela 
 */
let responseMessageOk = abanca.getResponseOk(message)

/**
 * Devuelve la respuesta de cancelación de pago a la pasarela
 */
let responseMessageNok = abanca.getResponseNok(message)