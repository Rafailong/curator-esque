var mocha = require('mocha')
var mockery = require('mockery')
var should = require('chai').should()

var CuratorEsque = require('..').CuratorEsque
var ServiceInstanceBuilder = require('..').ServiceInstanceBuilder
var ServiceDiscoveryBuilder = require('..').ServiceDiscoveryBuilder

describe('ServiceDiscovery', function () {
  beforeEach(function (done) {
    client = CuratorEsque.newClient('127.0.0.1:2181')
    client.start()

    client.once('connected', function () {
      builder = ServiceDiscoveryBuilder.builder()

      serviceInstance =
        ServiceInstanceBuilder
          .builder()
          .address('localhost')
          .port(12345)
          .name('my/service/v1')
          .payload({ data: 'user defined payload' })
          .build()

      serviceDiscovery =
        builder
          .client(client)
          .thisInstance(serviceInstance)
          .basePath('services')
          .build()

      serviceDiscovery.registerService(function onRegister (err, data) {
        done()
      })
    })
  })

  it('should create a service discovery instance', function () {
    serviceDiscovery.should.be.a('object')
  })

  it('should register a service when calling registerService()', function (done) {
    serviceDiscovery.registerService(function (err, data) {
      data.id.should.be.a('string')
      data.name.should.be.a('string')
      data.address.should.be.a('string')
      data.port.should.be.a('number')
      data.payload.should.be.a('object')
      data.registrationResponse.should.not.be.null
      data.registrationResponse.should.be.a('array')
      data.registrationResponse.should.not.be.empty
      done()
    })
  })


  it('should register a service with no name so the ID of the service will be assigned as name', function (done) {
    var serviceInstanceWithoutName =
      ServiceInstanceBuilder
        .builder()
        .address('localhost')
        .port(12345)
        .build()

    var serviceDiscovery2 =
      builder
        .client(client)
        .thisInstance(serviceInstanceWithoutName)
        .basePath('services')
        .build()

    serviceDiscovery2.registerService(function onRegister (err, data) {
      data.id.should.be.a('string')
      data.name.should.be.a('string')

      // !!!!!!!!!!
      data.id.should.equal(data.name)

      data.address.should.be.a('string')
      data.port.should.be.a('number')
      data.registrationResponse.should.not.be.null
      data.registrationResponse.should.be.a('array')
      data.registrationResponse.should.not.be.empty
      done()
    })
  })


  it('should unregister a service when calling unRegisterService()', function (done) {
    serviceDiscovery.registerService(function (err, data) {
      serviceDiscovery.unRegisterService(data.id, function (err, res) {
        should.not.exist(err)
        should.exist(res)
        done()
      })
    })
  })

  it('should create a ServiceProviderBuilder when calling serviceProviderBuilder()', function (done) {
    var serviceProviderBuilder = serviceDiscovery.serviceProviderBuilder()

    serviceProviderBuilder.should.be.a('object')
    done()
  })

  it('should create a ServiceProvider with a pre-populated ServiceDiscovery property when calling the result of serviceProviderBuilder()', function (done) {
    var serviceProvider = serviceDiscovery.serviceProviderBuilder().build()

    serviceProvider.serviceDiscovery.should.be.a('object')
    done()
  })

  it('should create a ServiceProvider with a pre-populated ServiceDiscovery property that is capable of having an overriden providerStrategy when calling the result of serviceProviderBuilder()', function (done) {
    var serviceProviderBuilder = serviceDiscovery.serviceProviderBuilder()

    serviceProviderBuilder.providerStrategy('RoundRobin')

    serviceProvider = serviceProviderBuilder.build()
    serviceProvider.serviceDiscovery.should.be.a('object')
    done()
  })

  it('should find service instances when calling queryForInstances() with a valid serviceId', function (done) {
    serviceDiscovery.registerService(function (err, data) {
      data.address.should.be.a('string')
      data.port.should.be.a('number')
      serviceDiscovery.queryForInstances('my/service/v1', function (err, instances) {
        should.not.exist(err)
        should.exist(instances)
        instances.should.be.instanceof(Array).and.not.have.lengthOf(0)
        done()
      })
    })
  })

  it('should find service instances when calling queryForInstances() with an invalid serviceId', function (done) {
    serviceDiscovery.registerService(function (err, data) {
      data.address.should.be.a('string')
      data.port.should.be.a('number')
      serviceDiscovery.queryForInstances('my/service/v3', function (err, instances) {
        should.exist(err)
        should.not.exist(instances)
        done()
      })
    })
  })
})
