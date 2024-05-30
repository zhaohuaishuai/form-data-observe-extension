chrome.devtools.panels.create('FormDataObserve', '/img/icon-48.png', 'panel.html', (panel) => {
  // code invoked on panel creation
  panel.onShown.addListener((extPanelWindow) => {
    console.log('onShown')
    
  })
  
})
