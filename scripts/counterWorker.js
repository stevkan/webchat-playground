let i = 10;

function timedCount(count) {
  count = count - 1;

  if (count >= 0) {
    console.log(count)
    postMessage(count);
    setTimeout(`timedCount(${count})`, 1000);
  }
}

timedCount(i);