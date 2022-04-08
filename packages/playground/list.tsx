type Item = {
  id: string;
  message: string;
  good: number;
  timestamp: number;
}

// page: 1, size: 10, userId: xxx
// page: 2, size: 10

function List() {
  const list = []
  list.sort()
}

function Item(props: { timestamp: number }) {
}

// 无限滚动 list.push()
function ShareButton() {}
