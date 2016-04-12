var mocha = require('mocha')
var mockery = require('mockery')
var should = require('chai').should()

var ServiceInstanceBuilder = require('..').ServiceInstanceBuilder

describe('ServiceInstanceBuilder', function () {
  beforeEach(function () {
    builder = ServiceInstanceBuilder.builder()
  })

  it('should instantiate an instance of ServiceInstanceBuilder when calling builder()', function () {
    builder.should.be.a('object')
  })

  it('should build an instance of ServiceInstance when calling build() with parameters', function () {
    builder.name('my/service/name')
    builder.address('127.0.0.1')
    builder.port('8080')
    var payload = {
      'something': 'lol'
    }
    builder.payload(payload)

    var serviceInstance = builder.build()

    serviceInstance.should.be.a('object')
    serviceInstance.name.should.equal('my/service/name')
    serviceInstance.address.should.equal('127.0.0.1')
    serviceInstance.port.should.equal('8080')
    serviceInstance.payload.should.equal(payload)
  })
})
