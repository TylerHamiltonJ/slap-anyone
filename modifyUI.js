function checkMutations() {
  const bottomBanner = document.getElementById(
    "r89-desktop-billboard-low-1-wrapper"
  );
  const bottomBannerMobile = document.getElementById(
    "r89-mobile-sticky-footer-1-wrapper"
  );

  function getHeight(el) {
    // Get the DOM Node if you pass in a string
    el = typeof el === "string" ? document.querySelector(el) : el;

    var styles = window.getComputedStyle(el);
    var margin =
      parseFloat(styles["marginTop"]) + parseFloat(styles["marginBottom"]);
    return Math.ceil(el.offsetHeight + margin);
  }

  const donations = document.getElementById("donation");
  const socials = document.getElementById("socials");
  const units = document.getElementById("units");

  const selectedUnit = bottomBanner || bottomBannerMobile;
  if (window.innerHeight < 500 && selectedUnit) {
    selectedUnit.style.display = "none";
  }
  if (selectedUnit) {
    const height = getHeight(selectedUnit);
    if (donations) donations.style.bottom = `${height + 5}px`;
    if (socials) socials.style.bottom = `${height + 5}px`;
    if (window.innerWidth >= 500 && units) {
      units.style.bottom = `${height + 5}px`;
    }
  } else {
    if (donations) donations.style.bottom = `0px`;
    if (socials) socials.style.bottom = `0px`;
    if (units) units.style.bottom = `0px`;
  }
}
