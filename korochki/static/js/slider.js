const slider = document.getElementById('slider');
if (slider) {
    const slides = slider.querySelectorAll('.slides img');
    const dotsBox = document.getElementById('dots');
    let index = 0;
    let timer;

    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'dot';
        dot.addEventListener('click', () => { show(i); restart(); });
        dotsBox.appendChild(dot);
    });
    const dots = dotsBox.querySelectorAll('.dot');

    function show(i) {
        index = (i + slides.length) % slides.length;
        slider.querySelector('.slides').style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((d, n) => d.classList.toggle('active', n === index));
    }

    function restart() {
        clearInterval(timer);
        timer = setInterval(() => show(index + 1), 3000);
    }

    document.getElementById('prev').addEventListener('click', () => { show(index - 1); restart(); });
    document.getElementById('next').addEventListener('click', () => { show(index + 1); restart(); });

    show(0);
    restart();
}
