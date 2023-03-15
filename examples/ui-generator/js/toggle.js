function toggle_signal() {
  const toggleList = document.querySelectorAll(".toggleSwitch");
  toggleList.forEach(($toggle) => {
    $toggle.onclick = () => {
      $toggle.classList.toggle('active');
    }
  });
}