const allergyTrigger = document.getElementById('allergy-dropdown-trigger');
const allergyDropdown = document.getElementById('allergy-dropdown');

if (allergyTrigger && allergyDropdown) {
    allergyTrigger.addEventListener('click', (e) => {
        e.stopPropagation(); 
        allergyDropdown.style.display = allergyDropdown.style.display === 'block' ? 'none' : 'block';
    });

    allergyDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    document.addEventListener('click', () => {
        allergyDropdown.style.display = 'none';
    });
}
