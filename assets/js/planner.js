const TOTAL_GROUPS = 10
const CHARACTERS_PER_GROUP = 5
const PLANNER = document.querySelector('.planner')
const PAGE_HEADER = document.querySelector('h1')
const ROLES = ["Melee DPS", "Ranged DPS", "Tank", "Healer"].sort()
const WEAPON_TYPES = ["Sword & Shield", 'Bow', 'Great Axe', 'War Hammer', 'Musket', 'Spear', 'Hatchet', 'Rapier', 'Life Staff', 'Fire Staff', 'Ice Gauntlet', 'Void Gauntlet'].sort()
const TANK_WEAPONS = ['Sword & Shield']
const MELEE_WEAPONS = ['Great Axe', 'War Hammer', 'Spear', 'Hatchet', 'Rapier'].sort()
const RANGED_WEAPONS = ['Bow', 'Musket', 'Fire Staff', 'Ice Gauntlet', 'Void Gauntlet'].sort()
const HEALER_WEAPONS = ['Life Staff']
const PLANNER_ID = new URLSearchParams(window.location.search).get('id')

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

class Planner {
    groups = []

    constructor(name) {
        this.id = uuidv4()
        this.name = name
    }
}

class Group {
    characters = []

    constructor(description) {
        this.description = description
    }
}

class Character {
    constructor(primaryWeapon, secondaryWeapon) {
        this.id = uuidv4()
        this.name = 'Example Character'
        this.primaryWeapon = WEAPON_TYPES.find(w => w === primaryWeapon)
        this.secondaryWeapon = WEAPON_TYPES.find(w => w === secondaryWeapon)
        getCharacterRole(this.primaryWeapon, this.secondaryWeapon)
    }
}

function getCharacterRole(primaryWeapon, secondaryWeapon) {
    if (TANK_WEAPONS.includes(primaryWeapon) || TANK_WEAPONS.includes(secondaryWeapon)) {
        return 'Tank'
    } else if (HEALER_WEAPONS.includes(primaryWeapon) || HEALER_WEAPONS.includes(secondaryWeapon)) {
        return 'Healer'
    } else if (RANGED_WEAPONS.includes(primaryWeapon) || RANGED_WEAPONS.includes(secondaryWeapon)) {
        return 'Ranged DPS'
    } else {
        return 'Melee DPS'
    }
}

function trimString(string) {
    return string.replace(/^\s+|\s+$/g, '')
}

function setDocumentTitle(planner) {
    document.title = planner.name + ' | Planner | New World Invasion Guide'
}

function getWeaponImage(weapon) {
    switch (weapon) {
        case 'Sword & Shield':
            return 'https://cdn.nwdb.info/db/images/live/v2/icons/abilities/swordability4.png'
        case 'Bow':
            return 'https://cdn.nwdb.info/db/images/live/v2/icons/abilities/bowability4_mod1.png'
        case 'Great Axe':
            return 'https://cdn.nwdb.info/db/images/live/v2/icons/abilities/greataxe_ability4_judgementsreach.png'
        case 'War Hammer':
            return 'https://cdn.nwdb.info/db/images/live/v2/icons/abilities/warhammerability3.png'
        case 'Musket':
            return 'https://cdn.nwdb.info/db/images/live/v2/icons/abilities/bowpassive2.png'
        case 'Spear':
            return 'https://cdn.nwdb.info/db/images/live/v2/icons/abilities/spear_skewer.png'
        case 'Hatchet':
            return 'https://cdn.nwdb.info/db/images/live/v2/icons/abilities/hatchetability1_mod3.png'
        case 'Rapier':
            return 'https://cdn.nwdb.info/db/images/live/v2/icons/abilities/rapier_ability4_riposte.png'
        case 'Life Staff':
            return 'https://cdn.nwdb.info/db/images/live/v2/icons/abilities/lifestaffpassive5.png'
        case 'Fire Staff':
            return 'https://cdn.nwdb.info/db/images/live/v2/icons/abilities/firestaffability1.png'
        case 'Ice Gauntlet':
            return 'https://cdn.nwdb.info/db/images/live/v2/icons/abilities/icemagic_ability5.png'
        case 'Void Gauntlet':
            return 'https://cdn.nwdb.info/db/images/live/v2/icons/abilities/voidmagicability4.png'
        default:
            return 'https://cdn.nwdb.info/db/images/live/v2/icons/abilities/swordability3_mod2.png'
    }
}

function renderPlanner(planner) {
    PAGE_HEADER.innerText = planner.name
    planner.groups.forEach((group, groupIndex) => {
        const groupContainer = document.createElement('div')
        groupContainer.classList.add('planner__group')
        // Append the group container.
        PLANNER.appendChild(groupContainer)

        const groupHeader = document.createElement('h2')
        groupHeader.innerText = 'Group ' + (groupIndex + 1).toString()
        groupHeader.classList.add('planner__group__header')
        // Append the group header.
        groupContainer.appendChild(groupHeader)

        const groupDescription = document.createElement('h3')
        groupDescription.innerText = group.description
        groupDescription.classList.add('planner__group__description')
        groupDescription.contentEditable = 'true'
        // Append the group description.
        groupContainer.appendChild(groupDescription)

        const groupCharacterContainer = document.createElement('div')
        groupCharacterContainer.classList.add('planner__group__characters')
        // Append the character container.
        groupContainer.appendChild(groupCharacterContainer)

        group.characters.forEach((character, characterIndex) => {
            const characterContainer = document.createElement('div')
            characterContainer.classList.add('planner__group__character')
            characterContainer.draggable = true

            const characterDragIcon = document.createElement('img')
            // This needs to be defined by Hugo in the planner.html template.
            characterDragIcon.src = window.BARS_IMAGE_URL
            characterDragIcon.classList.add('planner__group__character__drag')
            characterContainer.appendChild(characterDragIcon)

            characterContainer.addEventListener('dragstart', e => {
                const payload = {
                    groupIndex: groupIndex,
                    characterIndex: characterIndex,
                    character: character
                }
                e.dataTransfer.setData('payload', JSON.stringify(payload))
            })

            // I have to disable dragover apparently because JS is crap.
            characterContainer.addEventListener('dragover', e => {
                if (e.preventDefault) {
                    e.preventDefault()
                }
                return false
            })

            characterContainer.addEventListener('drop', e => {
                const payload = JSON.parse(e.dataTransfer.getData('payload'))
                swapCharacters(
                    payload.groupIndex,
                    payload.characterIndex,
                    payload.character,
                    groupIndex,
                    characterIndex,
                    character
                )
            })

            const characterRole = document.createElement('img')
            characterRole.classList.add('planner__group__character__role')

            switch (character.role) {
                case 'Tank':
                    characterContainer.classList.add('planner__group__character--tank')
                    characterRole.src = 'https://cdn.nwdb.info/db/images/live/v2/icons/abilities/swordability6.png'
                    characterRole.classList.add('planner__group__character__role--tank')
                    break
                case 'Melee DPS':
                    characterContainer.classList.add('planner__group__character--melee')
                    characterRole.src = 'https://cdn.nwdb.info/db/images/live/v2/icons/abilities/hatchetability4.png'
                    characterRole.classList.add('planner__group__character__role--melee')
                    break
                case 'Healer':
                    characterContainer.classList.add('planner__group__character--healer')
                    characterRole.src = 'https://cdn.nwdb.info/db/images/live/v2/icons/abilities/lifestaffability3.png'
                    characterRole.classList.add('planner__group__character__role--healer')
                    break
                default:
                    characterContainer.classList.add('planner__group__character--ranged')
                    characterRole.src = 'https://cdn.nwdb.info/db/images/live/v2/icons/abilities/bowability2.png'
                    characterRole.alt = 'Ranged DPS'
                    characterRole.classList.add('planner__group__character__role--ranged')
            }
            characterRole.alt = character.role
            characterRole.title = character.role

            const characterNameRole = document.createElement('div')
            characterNameRole.classList.add('planner__group__character__name-role')

            const characterName = document.createElement('div')
            characterName.innerText = character.name.toString()
            characterName.classList.add('planner__group__character__name')

            const characterWeapons = document.createElement('div')
            characterWeapons.classList.add('planner__group__character__weapons')

            const characterPrimaryWeaponContainer = document.createElement('div')
            characterPrimaryWeaponContainer.classList.add('planner__group__character__weapon__container')
            const characterPrimaryWeapon = document.createElement('select')
            characterPrimaryWeapon.innerText = character.primaryWeapon.toString()
            characterPrimaryWeapon.classList.add('planner__group__character__weapon')
            const characterPrimaryWeaponIcon = document.createElement('img')
            characterPrimaryWeaponIcon.src = getWeaponImage(character.primaryWeapon)
            characterPrimaryWeaponIcon.classList.add('planner__group__character__weapon__icon')
            characterPrimaryWeaponContainer.appendChild(characterPrimaryWeapon)
            characterPrimaryWeaponContainer.appendChild(characterPrimaryWeaponIcon)

            const characterSecondaryWeaponContainer = document.createElement('div')
            characterSecondaryWeaponContainer.classList.add('planner__group__character__weapon__container')
            const characterSecondaryWeapon = document.createElement('select')
            characterSecondaryWeapon.innerText = character.secondaryWeapon.toString()
            characterSecondaryWeapon.classList.add('planner__group__character__weapon')
            const characterSecondaryWeaponIcon = document.createElement('img')
            characterSecondaryWeaponIcon.src = getWeaponImage(character.secondaryWeapon)
            characterSecondaryWeaponIcon.classList.add('planner__group__character__weapon__icon')
            characterSecondaryWeaponContainer.appendChild(characterSecondaryWeapon)
            characterSecondaryWeaponContainer.appendChild(characterSecondaryWeaponIcon)

            WEAPON_TYPES.forEach(wt => {
                const primaryEl = document.createElement('option')
                primaryEl.value = wt
                primaryEl.innerText = wt
                characterPrimaryWeapon.appendChild(primaryEl)

                if (wt === character.primaryWeapon) {
                    primaryEl.selected = true
                }

                const secondaryEl = document.createElement('option')
                secondaryEl.value = wt
                secondaryEl.innerText = wt
                characterSecondaryWeapon.appendChild(secondaryEl)

                if (wt === character.secondaryWeapon) {
                    secondaryEl.selected = true
                }
            })

            // Append character information to the character container.
            characterContainer.appendChild(characterNameRole)
            characterNameRole.appendChild(characterRole)
            characterNameRole.appendChild(characterName)
            characterContainer.appendChild(characterWeapons)
            characterWeapons.appendChild(characterPrimaryWeaponContainer)
            characterWeapons.appendChild(characterSecondaryWeaponContainer)

            // Append this character to the character container.
            groupCharacterContainer.appendChild(characterContainer)
        })
    })
}

function getLocalPlanners() {
    return JSON.parse(localStorage.getItem('planners'))
}

function getPlannerFromId(id) {
    const planners = getLocalPlanners()
    if (planners.length) {
        return planners.find(p => p.id === id)
    }
    return undefined
}

function getCurrentPagePlanner() {
    return getPlannerFromId(PLANNER_ID)
}

function savePlanner(planner) {
    const planners = getLocalPlanners()
    let localPlanner = planners.find(p => p.id === planner.id)
    planners[planners.indexOf(localPlanner)] = planner
    localStorage.setItem('planners', JSON.stringify(planners))
    window.location.reload()
}

function updatePlannerName(planner) {
    let text = PAGE_HEADER.innerText
    if (text) {
        text = trimString(text)
        planner.name = text
        savePlanner(planner)
    } else {
        PAGE_HEADER.innerText = planner.name
    }
    setDocumentTitle(planner)
}

function swapCharacters(groupIndex, characterIndex, character, swapGroupIndex, swapCharacterIndex, swapCharacter) {
    const planner = getCurrentPagePlanner()
    planner.groups[groupIndex].characters[characterIndex] = swapCharacter
    planner.groups[swapGroupIndex].characters[swapCharacterIndex] = character
    savePlanner(planner)
}

function updateGroupDescription(index, text) {
    const planner = getCurrentPagePlanner()
    text = trimString(text)
    planner.groups[index].description = text
    savePlanner(planner)
}

function updateCharacterWeapon(groupIndex, characterIndex, slot, weapon) {
    const planner = getCurrentPagePlanner()
    const character = planner.groups[groupIndex].characters[characterIndex]
    character[slot] = weapon
    character.role = getCharacterRole(character.primaryWeapon, character.secondaryWeapon)
    planner.groups[groupIndex].characters[characterIndex] = character
    savePlanner(planner)
}

function updateCharacterName(groupIndex, characterIndex, name) {
    const planner = getCurrentPagePlanner()
    const character = planner.groups[groupIndex].characters[characterIndex]
    character.name = name
    planner.groups[groupIndex].characters[characterIndex] = character
    savePlanner(planner)
}

function init() {
    const planners = getLocalPlanners()
    if (!planners || !planners.length) {
        const planners = []
        // Initialize a new planner of one isn't found yet.
        const newPlanner = new Planner('My Example Invasion Planner')
        for (let i = 0; i < TOTAL_GROUPS; i++) {
            const group = new Group('Group ' + (i + 1).toString() + ' Description')
            for (let c = 0; c < CHARACTERS_PER_GROUP; c++) {
                group.characters.push(new Character('Spear', 'Bow'))
            }
            newPlanner.groups.push(group)
        }
        planners.push(newPlanner)
        localStorage.setItem('planners', JSON.stringify(planners))
        // Redirect to the new planner.
        window.location.assign('/planner/?id=' + newPlanner.id)
    }

    // If the user has a planner already set up, go to it.
    // TODO: Make this more modular, allow the user to have multiple planners.
    if (!PLANNER_ID) {
        window.location.assign('/planner/?id=' + planners[0].id)
    }

    // Get the planner from the ID.
    const planner = getCurrentPagePlanner()
    renderPlanner(planner)

    // Allow the user to edit the planner name.
    PAGE_HEADER.contentEditable = 'true'
    PAGE_HEADER.spellcheck = false
    PAGE_HEADER.addEventListener('keydown', e => {
        if (e.code === 'Enter') {
            PAGE_HEADER.blur()
        }
    })
    PAGE_HEADER.addEventListener('blur', () => {
        updatePlannerName(planner)
    })

    // Allow the user to edit group descriptions and character information.
    document.querySelectorAll('.planner__group').forEach((group, groupIndex) => {
        group.querySelectorAll('.planner__group__description').forEach(groupDescription => {
            groupDescription.addEventListener('keydown', e => {
                if (e.code === 'Enter') {
                    groupDescription.blur()
                }
            })
            groupDescription.addEventListener('blur', e => {
                updateGroupDescription(groupIndex, e.target.innerText)
            })
        })

        // Update weapons and role accordingly.
        group.querySelectorAll('.planner__group__character').forEach((character, characterIndex) => {
            const characterName = character.querySelector('.planner__group__character__name')
            characterName.contentEditable = 'true'
            characterName.addEventListener('keydown', e => {
                if (e.code === 'Enter') {
                    characterName.blur()
                }
            })
            characterName.addEventListener('blur', e => {
                updateCharacterName(groupIndex, characterIndex, e.target.innerText)
            })
            const characterWeapons = character.querySelectorAll('.planner__group__character__weapon')
            characterWeapons[0].addEventListener('input', event => {
                updateCharacterWeapon(groupIndex, characterIndex, 'primaryWeapon', event.target.value)
            })
            characterWeapons[1].addEventListener('input', event => {
                updateCharacterWeapon(groupIndex, characterIndex, 'secondaryWeapon', event.target.value)
            })
        })
    })
}

init()