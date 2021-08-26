const Vue = {
  createElement,
  render,
  useState,
};

type VueElement = {
  type: string;
  props: { nodeValue?: string; children: VueElement[] };
};

type FC = (props?: FiberNode["props"]) => VueElement;

type FiberNode = {
  type?: string | FC;
  props: {
    [key: string]: unknown;
    [key: `on${string}`]: (event?: unknown) => void;
    children: VueElement[];
  };
  dom: HTMLElement | Text;
  parent?: FiberNode;
  child?: FiberNode;
  sibling?: FiberNode;
  alternate?: FiberNode;
  effectTag?: "PLACEMENT" | "UPDATE" | "DELETION";
  hooks?: { state: unknown; queue: [] }[];
} | null;

function createElement(
  type: string,
  props: Record<string, unknown>,
  ...children: VueElement[]
): VueElement {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

function createTextElement(text: string): VueElement {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createDom(fiber: FiberNode) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type as string);

  const isProperty = (key: string) => key !== "children";
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((key) => {
      dom[key] = fiber.props[key];
    });

  return dom;
}

const isEvent = (key: string) => key.startsWith("on");
const isProperty = (key: string) => key !== "children" && !isEvent(key);
const isNew =
  (prev: FiberNode["props"], next: FiberNode["props"]) => (key: string) =>
    prev[key] !== next[key];
const isGone =
  (prev: FiberNode["props"], next: FiberNode["props"]) => (key: string) =>
    !(key in next);
function updateDom(
  dom: HTMLElement | Text,
  prevProps: FiberNode["props"],
  nextProps: FiberNode["props"]
) {
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(
      (key) =>
        nextProps[key] !== prevProps[key] || isNew(prevProps, nextProps)(key)
    )
    .forEach((name: `on${string}`) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = "";
    });

  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = nextProps[name];
    });

  Object.keys(prevProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name: `on${string}`) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}

function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitWork(fiber: FiberNode) {
  if (!fiber) {
    return;
  }

  let domParentFiber = fiber.parent;
  while (!domParentFiber) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;

  if (fiber.effectTag === "PLACEMENT" && fiber.dom !== null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom !== null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION" && fiber.dom !== null) {
    commitDeletion(fiber, domParent);
  }
  if (fiber.effectTag === "UPDATE") {
    domParent.removeChild(fiber.alternate.dom);
  }
  domParent.appendChild(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function commitDeletion(fiber: FiberNode, domParent: HTMLElement | Text) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.parent, domParent);
  }
}

function render(element: VueElement, container: HTMLElement | Text) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  };
  deletions = [];
  nextUnitOfWork = wipRoot;
}

let nextUnitOfWork: FiberNode = null;
let currentRoot: FiberNode = null;
let wipRoot: FiberNode = null;
let deletions: FiberNode[] = [];

function workLoop(deadline: IdleDeadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

function performUnitOfWork(fiber: FiberNode): FiberNode {
  const isFunctionComponent = fiber.type instanceof Function;

  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

let wipFiber: FiberNode = null;
let hookIndex: number = null;

function updateFunctionComponent(fiber: FiberNode) {
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = [];
  const children = [(fiber.type as FC)(fiber.props)];
  reconcileChildren(fiber, children);
}

function useState<T = any>(initial: T) {
  const oldHook = wipFiber?.alternate?.hooks?.[hookIndex];
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  };

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach((action) => {
    hook.state = action(hook.state);
  });

  const setState = (action) => {
    hook.queue.push(action);
    wipRoot = {
      dom: currentRoot?.dom,
      props: currentRoot?.props,
      alternate: currentRoot,
    };
    nextUnitOfWork = wipRoot;
    deletions = [];
  };
  wipFiber?.hooks?.push(hook as any);
  hookIndex++;
  return [hook.state, setState] as const;
}

function updateHostComponent(fiber: FiberNode) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  reconcileChildren(fiber, fiber.props.children);
}

function reconcileChildren(wipFiber: FiberNode, elements: VueElement[]) {
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling: FiberNode = null;

  while (index < elements.length || oldFiber !== null) {
    const element = elements[index];
    let newFiber: FiberNode = null;

    const sameType = element && oldFiber && element.type === oldFiber.type;

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      };
    }

    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      };
    }

    if (!sameType && oldFiber) {
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber);
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}

window.onload = () => {
  function Counter() {
    const [state, setState] = Vue.useState(1);
    return <h1 onClick={() => setState((c) => c + 1)}>Count: {state}</h1>;
  }
  const element = <Counter />;
  const container = document.getElementById("root");
  debugger;
  Vue.render(element, container);
};

export default {}