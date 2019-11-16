---
title: SOAP vs REST
author: Zheng Yuan
date: 11/16/2019
tags: ['backend', 'service', 'api']
---

Service API difference: SOAP vs REST
============

What is SOAP
-------

By Wiki, **SOAP**(abbreviation for **Simple Object Access Protocol**) is a messaging protocol specification for exchanging structured information in the implementation of web services in computer networks.

Its purpose is to provide extensibility, neutrality and independence. It uses XML information set for its message format, and relies on application layer protocols, most often *Hypertext Transfer Protocol*(HTTP), although some legacy systems communicate over *Simple Mail Transfer Protocol(SMTP)*, for message negotiation and trasmission.

SOAP allows developers to invoke processes running on disparate operating systems (such as Windos, macOS, and Linux) to authenticate, authorize, and communicate using *Extensible Markup Language*(XML).

Since Web protocols like HTTP are installed and running on all operating systems, SOAP allows clients to invoke web services and receive responses independent of language and platforms.

Here is an example message(encapsulated in HTTP):
~~~xml
POST /InStock HTTP/1.1
Host: www.example.org
Content-Type: application/soap+xml; charset=utf-8
Content-Length: 299
SOAPAction: "http://www.w3.org/2003/05/soap-envelope"

<?xml version="1.0"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:m="http://www.example.org">
  <soap:Header>
  </soap:Header>
  <soap:Body>
    <m:GetStockPrice>
      <m:StockName>GOOG</m:StockName>
    </m:GetStockPrice>
  </soap:Body>
</soap:Envelope>
~~~

What about REST
--------

**REST**(abbreviation for **Representational state transfer**) is a software architectural style that defines a set of constraints to be used for creating Web services. Web services that conform to the REST architectural style, called RESTful Web services, provide interoperability between computer systems on the internet. RESTful Web services allow the requesting systems to access and manipulate textual representations of Web resources by using a uniform and predefined set of stateless operations. 

The term *representational state transfer* was introduced and defined in 2000 by Roy Fielding in his doctoral dissertation. This term is intended to evoke an image of how a well designed Web application behaves: it is a network of Web resources(a virtual state-machine) where the user progresses though the application by selecting resources identifiers such as *http://www.example.com/articles/21* and resource operations such as GET or POST, resulting in the next resource's representation (the next application state) being transferred to the end user for their use.

And here are six guiding constraints define a RESTful system. these constraints restrict the ways that the server can process and respond to client requests so that, by operating within these constraints, the system gains desirable non-funcional properties, such as performance, scalability, simplicity, modifiability, visibility portability, and reliability. If a system violates any of the required constraints, it cannot be considered RESTful.

The formal REST constraints are as follows:

### 1. Client-server architecture ###
    The principle behind the client-server constraints is the separation of concerns. Separating the user interface concerns from the data storage concerns improves the portability of the user interfaces across multiple platforms. It also improves the scalability by simplifying the server components. Perhaps most significant to the Web, however, is that the separation allows the components to evolve independently, thus supporting the internet-scale requirement of multiple organizational domains.

### 2. Statelessness ###
    The client-server communication is constrained by no client context being stored on the server between requests. Each request from any client contains all the information necessary to service the request, and the session state is held in the client. The session state can be transferred by the server to another service such as database to maintain a persistent state for a period and allow authentication. The client begins sending requests when it is ready to make the transition to a new state. While one or more requests are outstanding, the client is considered to be in transition. The representation of each application state contains links that can be used the next time the client chooses to initiate a new state-transition. 

### 3. Cacheability ###
    As on the World Wide Web, clients and intermediaries can cache responses. Responses must therefore, implicity or explicity, define themselves as cachable or not to prevent clients from getting stale or in appropriate data in response to further requests. Well-managed caching partially or completely eliminates some client-server interactions, further improving scalability and performance.

### 4. Layered system ###
    A client cannot ordinarily tell whether it is connected direcly to the end server, or to an intermediary along the way. This means that the client doesn't know if it's talking with an intermediate or the actual server. So if a proxy or load balancer is placed between the client and server, it wouldn't affect their communications and there wouldn't be necessities to update the client or server code. intermediary servers can improves system scalability by enabling load balancing and by providing shared caches. Also security can be added as a layer on the top of the web services, and then clearly separate business logic from security logic. By adding security as a separate layer enforces security policies. Finally, it also means that a server can call multiple other servers to generate a response to the client.

### 5. Code on demond ###
    Servers can temporarily extend or customize the functionality of a client by transferring executable code: for example, client-side scriptes such as JavaScript.

### 6.Uniform interface ###
    The uniform interface constraint is fundamental to the design of any RESTful system. It simplifies and decouples the architecture, which enables each part to evolve independently. 

Summary
---------

**Difference** | SOAP | REST
---------------|------|-------
**Style** | protocol | Architectural style
**Function** | Function-driven: transfer structured information via protocol | Data-driven: access a resource for data(a URI)
**Data format** | only uses XML | Permits many data formats: pain text, HTML, XML, and JSON
**Security** | Supports WS-Security and SSL (SOAP supports WS-Security, which is great at the transport level and a bit more comprehensive than SSL, and more ideal for integration with enterprise-level security tools.) | Supports SSL and HTTPS
**Bandwidth** | Requires more resources and bandwidth | Requires fetwer resources and is lightweight
**Data cache** | Can not be cached | Can be cached
**Payload handling** | Has a strict communication contract and needs knowledge of everything before any interactions(tightly coupled with server) | Needs no knowledge of the API(loosely coupled and easy to be scaled)