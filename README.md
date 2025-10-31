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
const handler = (topic: string, msg: ArrayBufferLike) => {
  console.log(`Received on ${topic}:`, msg.toString());
};

// Add pattern subscriptions
trie.add("home/kitchen/temperature", handler);
trie.add("home/+/humidity", handler);
trie.add("home/#", handler);

// Match a topic to get all applicable handlers
const handlers = trie.match("home/kitchen/temperature");

// Execute matched handlers
handlers.forEach((fn) => fn("home/kitchen/temperature", new ArrayBuffer(8)));
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

client.on("message", (topic, message) => {
  const handlers = trie.match(topic);
  handlers.forEach((fn) => fn(topic, message));
});
```

## API Reference

### Class: MqttTrie

#### Methods:

##### add(pattern: string, handler: (topic: string, message: ArrayBufferLike) => void): void

Adds a pattern subscription with a handler function.

##### match(topic: string): ((topic: string, message: ArrayBufferLike) => void)[]

Matches a topic to get all applicable handlers.

##### remove(pattern: string, handler: (topic: string, message: ArrayBufferLike) => void): void

Removes a pattern subscription with a handler function.

##### clear(): void

Clears all subscriptions.

## To be implemented

- Testing cases
