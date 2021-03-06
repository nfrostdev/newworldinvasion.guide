function handleItemCheckedStates() {
    let totalBonusDamage = 0
    let exampleBonusDamage = 232
    const opacityClass = 'opacity-25'
    const checkedClass = 'checked'
    document.querySelectorAll('.checklist__items').forEach(checklist => {
        const items = checklist.querySelectorAll('.checklist__item')
        let checkedItems = 0
        items.forEach(item => {
            item.classList.remove(opacityClass, checkedClass)
            if (item.querySelector('input').checked) {
                checkedItems++
                item.classList.add(checkedClass)
                const value = parseInt(item.querySelector('.checklist__item__damage-value').textContent.replace('%', ''))
                totalBonusDamage += value
            }
        })
        if (checkedItems > 0) {
            items.forEach(item => {
                if (!item.querySelector('input').checked) {
                    item.classList.add(opacityClass)
                }
            })
        }
    })
    document.getElementById('totalBonusDamage').innerText = totalBonusDamage.toString()

    const exampleBonusEl = document.getElementById('exampleBonusDamage')
    if (totalBonusDamage > 0) {
        exampleBonusEl.innerText = (exampleBonusDamage * ((100 + totalBonusDamage) / 100)).toFixed(0).toLocaleString()
    } else {
        exampleBonusEl.innerText = '232'
    }
}

window.addEventListener('load', function () {
    handleItemCheckedStates()
    document.querySelectorAll('.checklist__item').forEach(item => {
        item.querySelector('input').addEventListener('click', function () {
            // Only allow one item to be checked per category.
            const input = item.querySelector('input')
            if (input.checked) {
                item.parentNode.querySelectorAll('input').forEach(input => {
                    input.checked = false
                })
                input.checked = true
            }
            handleItemCheckedStates()
        })
    })
})