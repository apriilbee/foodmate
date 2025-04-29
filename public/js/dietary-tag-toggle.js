const allergyTrigger = document.getElementById('allergy-dropdown-trigger');
const allergyDropdown = document.getElementById('allergy-dropdown');

if (allergyTrigger && allergyDropdown) {
    allergyTrigger.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering outside click
        allergyDropdown.style.display = allergyDropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Prevent clicks inside dropdown from closing it
    allergyDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Clicking outside closes it
    document.addEventListener('click', () => {
        allergyDropdown.style.display = 'none';
    });
}
