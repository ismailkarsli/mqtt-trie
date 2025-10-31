# MqttTrie

A lightweight, zero-dependency trie implementation for efficient MQTT topic matching and wildcard subscription management.

Perfect for clients that use MQTT-like topic structures (/, +, #) to match messages.

## Features

- Lightweight – no external dependencies
- Fast trie-based matching
- Supports MQTT-style wildcards:
  - `+` for single-level wildcards
  - `#` for multi-level wildcards
- Simple and predictable API

## Installation

```bash
npm install mqtt-trie
```

## Usage

```ts
import { MqttTrie } from "mqtt-trie";

const trie = new MqttTrie();

// Define a handler
const handler = (topic: string, msg: Buffer) => {
  console.log(`Received on ${topic}:`, msg.toString());
};

// Add pattern subscriptions
trie.add("home/kitchen/temperature", handler);
trie.add("home/+/humidity", handler);
trie.add("home/#", handler);

// Match a topic to get all applicable handlers
const handlers = trie.match("home/kitchen/temperature");

// Execute matched handlers
handlers.forEach((fn) =>
  fn("home/kitchen/temperature", Buffer.from([1, 2, 3])),
);
```

### Usage with MQTT.js

```ts
import mqtt from "mqtt";
import { MqttTrie } from "mqtt-trie";

const client = mqtt.connect("mqtt://test.mosquitto.org");
const trie = new MqttTrie();

trie.add("home/#", (topic, message) => {
  console.log(`Received on ${topic}:`, message.toString());
});

client.on("connect", () => {
  client.subscribe("home/kitchen/temperature");
});

client.on("message", trie.dispatch.bind(trie));
```

## API Reference

##### type Handler = (topic: string, message: Buffer) => void;

### Class: MqttTrie

##### add(pattern: string, handler: Handler): void

Add a new pattern subscription.

##### match(topic: string): Handler[]

Get all applicable handlers for a given topic.

##### dispatch(topic: string, message: Buffer): void

Dispatch a message to all applicable handlers. Shortcut for `match(topic).forEach(handler => handler(topic, message))`.

##### remove(pattern: string, handler: Handler): void

Remove a pattern subscription.

##### clear(): void

Clear all pattern subscriptions.
