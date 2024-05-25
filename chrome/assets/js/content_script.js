const throttle = (calback,duration)=> {
	let timeId = null
	return (...args)=>{
		if(timeId!=null){
			clearTimeout(timeId)
		}
		timeId = setTimeout(async ()=>{
			await calback(...args)
			timeId = null
      clearTimeout(timeId)
		},duration)
		
	}
}
const r = (event)=> {
  if (event.source != window) {
    return
  }
  if (event.data && event.data.type === 'form_data_observe_extension') {
    chrome.runtime.sendMessage(event.data);
  }
}
const receiveMessage = throttle(r,500)
window.addEventListener("message", (event)=>{
  if (event.data && event.data.type === 'form_data_observe_extension') {
    receiveMessage(event)
  }

}, false)
// 节流
