function songSearch() {
    /**
     * pulls songName from #searchbar. 
     */
    var songName = $('#searchbar').val()
    

}

function setup() {
    jQuery('.searchbutton').click(function () {
        songSearch()
    });

};

jQuery(document).ready(setup);