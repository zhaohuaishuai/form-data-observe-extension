chrome.devtools.panels.create('Sample Panel', 'icon.png', 'panel.html', (panel) => {
  // code invoked on panel creation
  panel.onShown.addListener((extPanelWindow) => {
    console.log('onShown')
  })
})
