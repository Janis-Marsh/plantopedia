/**
 * THIS FILE BUILDS THE APP ANS EXPORTS IT. IT DOES NO CALL listen()
 * starting the server is server.js's job
 * 
 * Split of responsabilities is not for pointless cermony
 * 1. TESTS. Super est needs the app object --- it starts is own throw away server on a random port per run. if the app.js called listen() means the app is bound to whatveer port is set and cannot be properly tested
 * 2. DEPLOYMENT. Severtest platforms and somme container runtimes/terminals import your app and manage listening themselves. An app that inists on call listen() cannot be deployed that way
 * 
 * -----------------------------------------------------------------
 * 
 * MIDDLEWARE ORDER MATTERS: POSITIONING IS MEANING
 * 
 * requestLogger -> express.json() -> routes -> notFound -> ErrorHandler
 * WHY?:
 * --> Logger first so it sees every request including ones that 404
 * --> express.json() before routes or req.body is undefined
 * --> notFound after routes or it swallows everything
 * --> errorHandler last ALWAYS
 */

const express = require('express')

const routes = require('./routes')