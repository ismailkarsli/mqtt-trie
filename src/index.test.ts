import { test } from "node:test";
import { MqttTrie } from "./index.ts";
import * as assert from "node:assert";

test("add topic and test callback", () => {
  const trie = new MqttTrie();
  let callbackCalled = false;
  trie.add("home/#", () => {
    callbackCalled = true;
  });
  const handlers = trie.match("home/kitchen");
  assert.strictEqual(handlers.length, 1);
  handlers.forEach((handler) => {
    handler("home/kitchen", Buffer.from("payload"));
  });
  assert.strictEqual(callbackCalled, true);
});

test("basic dispatch", () => {
  const trie = new MqttTrie();
  let callbackCalled = false;
  trie.add("home/#", () => {
    callbackCalled = true;
  });
  trie.dispatch("home/kitchen", Buffer.from("payload"));
  assert.strictEqual(callbackCalled, true);
});

test("single-level wildcard", () => {
  const trie = new MqttTrie();
  trie.add("home/+", () => { });
  const handlers = trie.match("home/kitchen");
  assert.strictEqual(handlers.length, 1);
});

test("single-level wildcard in tree", () => {
  const trie = new MqttTrie();
  trie.add("home/+/temperature", () => { });
  assert.strictEqual(trie.match("home/kitchen").length, 0);
  assert.strictEqual(trie.match("home/kitchen/temperature").length, 1);
});

test("multi-level wildcard", () => {
  const trie = new MqttTrie();
  trie.add("home/#", () => { });
  assert.strictEqual(trie.match("home/kitchen").length, 1);
  assert.strictEqual(trie.match("home/kitchen/temperature").length, 1);
});
