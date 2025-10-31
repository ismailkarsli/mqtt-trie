type Handler = (topic: string, msg: ArrayBufferLike) => void;

interface TrieNode {
  children: Record<string, TrieNode>;
  handlers?: Handler[];
}

export class MqttTrie {
  root: TrieNode = { children: {} };

  add(pattern: string, handler: Handler) {
    let node = this.root;
    for (const part of pattern.split("/")) {
      node.children[part] = node.children[part] || { children: {} };
      node = node.children[part];
    }
    node.handlers = node.handlers || [];
    node.handlers.push(handler);
  }

  match(topic: string) {
    const result: Handler[] = [];
    const levels = topic.split("/");

    const search = (node: TrieNode, i: number) => {
      if (node.handlers && i === levels.length) result.push(...node.handlers);
      if (i >= levels.length) return;
      const part = levels[i];
      if (!part) return;
      if (node.children[part]) search(node.children[part], i + 1);
      if (node.children["+"]) search(node.children["+"], i + 1);
      if (node.children["#"]?.handlers)
        result.push(...node.children["#"].handlers);
    };

    search(this.root, 0);
    return result;
  }

  remove(pattern: string, handler: Handler) {
    let node = this.root;
    for (const part of pattern.split("/")) {
      const child = node.children[part];
      if (!child) return;
      node = child;
    }
    const index = node.handlers?.indexOf(handler);
    if (index !== undefined && index >= 0) node.handlers?.splice(index, 1);
  }

  clear() {
    this.root = { children: {} };
  }
}
