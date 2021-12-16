// Header navigation toggling.
document.querySelector('.header__toggle').addEventListener('click', function () {
    document.querySelector('.header__nav').classList.toggle('shown')
})

window.addEventListener('scroll', function () {
        document.querySelector('.header__nav').classList.remove('shown')
    }
)