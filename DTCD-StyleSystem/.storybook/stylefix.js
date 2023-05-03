setTimeout(() => {
  document.querySelectorAll('.sbdocs-preview [scale="1"]').forEach((element) => {
    const { style } = element;
    style.WebkitTransform = 'none';
    style.MozTransform = 'none';
    style.MsTransform = 'none';
    style.transform = 'none';
  });
}, 1000);