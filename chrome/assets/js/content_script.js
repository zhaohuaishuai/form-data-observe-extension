window.addEventListener("message", function (event) {
  // console.log("接收到消息了", event)
  if (event.source != window) {
    return
  }
  if (event.data && event.data.type === 'form_data_observe_extension') {
    // console.log('form_data_observe_extension-->', event.data)
    chrome.runtime.sendMessage(event.data);
  }
}, false)
