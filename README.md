# curator-esque
A Curator-esque ZooKeeper framework for Node.js based on [ph0bos/zoologist](https://github.com/ph0bos/zoologist/blob/master/lib/ServiceInstance.js)

## Installation

    npm install curator-esque --save

## Examples

### Service Registration

```javascript
'use strict';

var CuratorEsque               = require('zoologist').CuratorEsque;
var ServiceInstanceBuilder  = require('curator-esque').ServiceInstanceBuilder;
var ServiceDiscoveryBuilder = require('curator-esque').ServiceDiscoveryBuilder;

// Client
var zoologistClient = CuratorEsque.newClient('127.0.0.1:2181');

// Start the client (connect to ZooKeeper)
zoologistClient.start();

// Service Instance
var serviceInstance = ServiceInstanceBuilder
                        .builder()
                        .address('127.0.0.1')
                        .port(process.env.PORT)
                        .name('my/service/name/v1')
                        .payload({ message: 'custom user defined information' })
                        .build();

// Service Discovery
var serviceDiscovery = ServiceDiscoveryBuilder
                         .builder()
                         .client(zoologistClient)
                         .thisInstance(serviceInstance)
                         .basePath('services')
                         .build();

// Register a Service
serviceDiscovery.registerService(function onRegister(err, data) {
  console.log({
    id: data.id,
    name: data.name,
    address: data.address,
    port: data.port
  });
});

```

### Service Discovery

```javascript
'use strict';

var CuratorEsque               = require('curator-esque').CuratorEsque;
var ServiceInstanceBuilder  = require('curator-esque').ServiceInstanceBuilder;
var ServiceDiscoveryBuilder = require('curator-esque').ServiceDiscoveryBuilder;

// Client
var zoologistClient = CuratorEsque.newClient('127.0.0.1:2181');

// Start the client (connect to ZooKeeper)
zoologistClient.start();

// Service Instance
var serviceInstance = ServiceInstanceBuilder
                        .builder()
                        .address('127.0.0.1')
                        .port(process.env.PORT)
                        .name('my/service/name/v1')
                        .build();

// Service Discovery
var serviceDiscovery = ServiceDiscoveryBuilder
                         .builder()
                         .client(zoologistClient)
                         .thisInstance(serviceInstance)
                         .basePath('services')
                         .build();

// Service Provider (providerStrategy: 'RoundRobin' or 'Random')
var serviceProvider = serviceDiscovery.serviceProviderBuilder()
                        .serviceName('my/service/name/v1')
                        .providerStrategy('RoundRobin')
                        .build();

// Discover available Services and provide an instance
serviceProvider.getInstance(function onInstanceReturn(err, data) {
  console.log({
    id: data.id,
    name: data.name,
    address: data.address,
    port: data.port,
    serviceUrl: serviceUrl
  });
});

```
