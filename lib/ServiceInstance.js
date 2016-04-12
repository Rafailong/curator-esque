'use strict'

/**
 * ServiceInstance.
 *
 * @module curator-esque
 */

/**
 * Statics
 */
var DEFAULT_URI_SPEC =
{
  parts: [
    {
      value: 'scheme',
      variable: true
    },
    {
      value: '://',
      variable: false
    },
    {
      value: 'address',
      variable: true
    },
    {
      value: ':',
      variable: false
    },
    {
      value: 'port',
      variable: true
    }
  ]
}

function ServiceInstance (uriSpec, address, port, name, payload) {
  this.uriSpec = uriSpec || DEFAULT_URI_SPEC
  this.address = address
  this.port = port
  this.name = name
  this.payload = payload
  this.registrationResponse
  this.serviceId
}

ServiceInstance.prototype.getData = function () {
  if (this.data) {
    return this.data
  }

  var data = {
    id: this.serviceId,
    name: this.name,
    address: this.address,
    port: this.port,
    sslPort: null,
    payload: this.payload,
    registrationTimeUTC: this.registrationTimeUTC || Date.now(),
    serviceType: 'DYNAMIC',
    uriSpec: this.uriSpec,
    registrationResponse: this.registrationResponse
  }

  return data
}

ServiceInstance.prototype.setServiceId = function (id) {
  this.serviceId = id
}

ServiceInstance.prototype.setRegistrationResponse = function (res) {
  this.registrationResponse = res
}

module.exports = ServiceInstance
