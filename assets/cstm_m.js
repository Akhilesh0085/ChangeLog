document.addEventListener('change', function (e) {
  if (!e.target.classList.contains('variant-change-dropdown')) return;

  const select = e.target;
  const newVariantId = select.value;
  const line = select.dataset.line;

  if (!newVariantId || !line) return;

  const cartItem = select.closest('li');
  cartItem?.classList.add('loading');

  fetch('/cart/change.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      line: Number(line),
      quantity: 0
    })
  })
  .then(() => {
    return fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: newVariantId,
        quantity: 1
      })
    });
  })
  .then(() => {
    return fetch('/?section_id=mini-cart');
  })
  .then(res => res.text())
  .then(html => {
    const doc = new DOMParser().parseFromString(html, 'text/html');

    const newMiniCart = doc.querySelector('mini-cart');
    const currentMiniCart = document.querySelector('mini-cart');

    if (newMiniCart && currentMiniCart) {
      currentMiniCart.innerHTML = newMiniCart.innerHTML;
    }
  })
  .catch(err => console.error('Variant swap error:', err));
});


function updateVisitors() {
  var min = 5;
  var max = 25;
 
  var randomVisitors =
    Math.floor(Math.random() * (max - min + 1)) + min;
 
  document.getElementById("visitor-count").innerText =
    randomVisitors;
}
 
updateVisitors();
setInterval(updateVisitors, 15000);

document.querySelector('#live-visitors .close')
  .addEventListener('click', function(){
    document.getElementById('live-visitors').style.display = 'none';
  });

  document.addEventListener('click', function (e) {
  const btn = e.target.closest('.js-size-guide-btn');
  if (!btn) return;

  const content = btn.dataset.sizeGuide;
  const container = document.querySelector('#MiniCartSizeGuideContent');

  if (container && content) {
    container.innerHTML = content;
  }
});
