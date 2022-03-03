//---------------------------------------------------
// This function loads the parts of your skeleton 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------
function loadSkeleton(){
    console.log($('#navbarPlaceholder').load('../html/skeleton/navBar.html'));
    console.log($('#footerNavBar').load('../html/skeleton/footerNavBar.html'));
    console.log($('#footerPlaceholder').load('../html/skeleton/footer.html'));
}
loadSkeleton();  //invoke the function