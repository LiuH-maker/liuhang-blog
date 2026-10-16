(function() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, stars, shootingStars;

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }

  function createStars(count) {
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random(),
        alphaSpeed: (Math.random() - 0.5) * 0.02,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15
      });
    }
  }

  function createShootingStar() {
    if (Math.random() < 0.003 && shootingStars.length < 2) {
      shootingStars.push({
        x: Math.random() * width,
        y: 0,
        length: Math.random() * 80 + 40,
        speed: Math.random() * 8 + 6,
        alpha: 1,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // 深空渐变背景
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#0a0e27');
    grad.addColorStop(0.5, '#1a1a3e');
    grad.addColorStop(1, '#0d1b2a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 绘制星星
    stars.forEach(s => {
      s.alpha += s.alphaSpeed;
      if (s.alpha > 1 || s.alpha < 0.2) s.alphaSpeed *= -1;
      s.x += s.vx;
      s.y += s.vy;
      if (s.x < 0) s.x = width;
      if (s.x > width) s.x = 0;
      if (s.y < 0) s.y = height;
      if (s.y > height) s.y = 0;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
      ctx.fill();

      // 星星光晕
      if (s.radius > 1.2) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${s.alpha * 0.1})`;
        ctx.fill();
      }
    });

    // 流星
    createShootingStar();
    shootingStars.forEach((ss, i) => {
      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.alpha -= 0.008;

      const tailX = ss.x - Math.cos(ss.angle) * ss.length;
      const tailY = ss.y - Math.sin(ss.angle) * ss.length;

      const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
      grad.addColorStop(0, `rgba(255, 255, 255, 0)`);
      grad.addColorStop(1, `rgba(255, 255, 255, ${ss.alpha})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(ss.x, ss.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      if (ss.alpha <= 0 || ss.x > width + 100 || ss.y > height + 100) {
        shootingStars.splice(i, 1);
      }
    });

    requestAnimationFrame(draw);
  }

  function init() {
    resize();
    shootingStars = [];
    createStars(Math.min(Math.floor((width * height) / 3000), 500));
    draw();
  }

  window.addEventListener('resize', () => {
    resize();
    createStars(Math.min(Math.floor((width * height) / 3000), 500));
  });

  init();
})();
