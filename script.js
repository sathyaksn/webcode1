
let apiURL = "https://api.openbrewerydb.org/breweries?per_page=3" 

  
       var array = [];
       var len =  0;
        var tableSize = 12; 
        var startRow = 1;
        var endRow = 0;
        var currPage = 1;
        var maxPage = 0; 
        var list = [];
        var resList = []; 
        var array_list = [];


var cncel_btn = document.querySelector('.modal-button');
cncel_btn.addEventListener('click',()=>{
    var modal = document.querySelector('.modal');
    modal.style.display = 'none';
});


async function fetchBreweryList(api){ 
    var getApiResp = await fetch(api);
    var getPromise = await getApiResp.json();
    return getPromise;
} 

// CREATING CARDS 
function createCard(i){ 
   
    var cardWrap = document.createElement('div');
    cardWrap.classList.add('card') 
    cardWrap.style.width = "18rem"

    var hd1 = document.createElement('h5');
    hd1.classList.add('card-title') 
    hd1.innerText = i.name; 

    var hd2 = document.createElement('h6');
    hd2.innerText = "Type : "+ i.brewery_type;  

    var cardAddr = document.createElement('div');
    cardAddr.classList.add('card-addr') 

    var addrP = document.createElement('p'); 
    addrP.classList.add('card-text') 
    addrP.innerHTML = `${i.street}, ${i.city}, ${i.state}, <br> ${i.country}, ${i.postal_code} `; 

    var addrlink = document.createElement('a'); 
    
    if(i.website_url != null) {
        addrlink.setAttribute('href',i.website_url);
        addrlink.setAttribute('target', '_blank'); 
        addrlink.innerText = "Visit : "+ i.website_url;

    }
    
    else {
        addrlink.setAttribute('href',"#");
        addrlink.innerText = "website unavailable";
        addrlink.style.color = "grey";
        addrlink.style.textDecoration = "none"
    }
    
    cardAddr.append(addrP)
    cardAddr.append(addrlink) 
     cardWrap.append(hd1)
    cardWrap.append(hd2)
    cardWrap.append(cardAddr) 
   
    
    var parent = document.querySelector('#card-parent')
    parent.append(cardWrap)
}


async function breweryAPI(){
    try{
        var parent = document.querySelector('#card-parent') 
            parent.innerHTML = "";  
            var search = document.querySelector('#search-term')
            search.value = ""; 
            var res = document.querySelector('#result-term')
            res.value = ""; 
        list = await fetchBreweryList(apiURL); 
        
         array_list = list
        var result = document.querySelector('.result') 
            result.innerHTML = `<h4> ${list.length} breweries found </h4>`

         
         paginationButtons();
    }
    catch(err){
        console.log(err);
        var modal = document.querySelector('.modal')
        var modalmsg = document.querySelector('#modal-msg')
        modalmsg.innerHTML = "Error fetching brewery list <br>" + err;
        modal.style.display = 'block';
    }
}  


    async function findbreweryAPI(apiBy,fil_value,search_term) {
            
        try {  
            var fil_list = await fetchBreweryList(apiBy);   
            var parent = document.querySelector('#card-parent') 
            parent.innerHTML = ""; 
            var res = document.querySelector('#result-term')
            res.value = ""; 
            var result = document.querySelector('.result') 
            result.innerHTML = `<h4> ${fil_list.length} results found </h4>`
            array_list = fil_list; 
            paginationButtons();
            
        }
        catch(err){
            console.log(err);
            var modal = document.querySelector('.modal')
            var modalmsg = document.querySelector('#modal-msg')
            modalmsg.innerHTML = `Error fetching brewery list for this ${fil_value} and ${search_term} <br> ${err}`;
            modal.style.display = 'block';
        }

    }

    
    var form = document.querySelector('.header form')
        form.addEventListener('submit',(e)=>{
            e.preventDefault();

            var filterby = document.querySelector('#filterby')
            var fil_value = filterby.value;
            
            
            var search = document.querySelector('#search-term')
            var search_term = search.value; 
            search_term = search_term.toLowerCase();
            
            var apiBy;
            if( fil_value == "name")  {
                 apiBy = `https://api.openbrewerydb.org/breweries?by_name=${search_term}&per_page=100`
            } 
            else if( fil_value == "type")  { 
                 apiBy = `https://api.openbrewerydb.org/breweries?by_type=${search_term}&per_page=100`
            } 
            else if( fil_value == "city")  { 
                search_term = search_term.split(" ").join("_")
                 apiBy = `https://api.openbrewerydb.org/breweries?by_city=${search_term}&per_page=100`
            } 
            else if( fil_value == "state")  { 
                search_term = search_term.split(" ").join("_")
                 apiBy = `https://api.openbrewerydb.org/breweries?by_state=${search_term}&per_page=100`
            } 

         findbreweryAPI(apiBy,fil_value,search_term);            
    })

    
    function paginationButtons(){ 
        array = array_list; 
        len =  array.length;
        startRow = 1;
        endRow = tableSize;
        maxPage = Math.ceil(len/tableSize);
      
        createButtons();  
    }

    
    function createButtons() {
        var page_btn = document.querySelector("#page-btn");
        page_btn.innerHTML = "";

        for(i=1; i<=maxPage; i++){
          
            var btn = document.createElement('button') 
            btn.setAttribute('id', `btn-${i}`)
            btn.setAttribute('onclick', "pageEvent(this)")
            btn.innerText = i; 
            page_btn.append(btn);            
        } 
        currentPage();
        
    }
    
   
    function currentPage(){ 
        var tableSize = 12
        startRow = ((Number(currPage))-1) * Number(tableSize) + 1; 
        endRow = (startRow + Number(tableSize)) - 1; 
       
        if(endRow > len)
           endRow = len; 
        
         displayCard();
        var page_show = document.querySelector("#showing"); 
        if( len != 0)
        page_show.innerHTML = `${startRow} to ${endRow} of ${len} results`
        else
        page_show.innerHTML = ` ${len} results`;
        var selectPage = "#btn-"+currPage
       
        var selectedPage = document.querySelector(selectPage) 
        
        if(selectedPage != null)
        selectedPage.classList.add("active");
        
    }
    
    
    function pageEvent(e){
        currPage = Number(e.innerText);
        tableSize = 12; 
        
        var prevSel = document.querySelector("#page-btn button[class='active']")
       
       if(prevSel != null)
        prevSel.classList.remove("active");
        currentPage();
    } 


  
    function displayCard(){ 
        try{
        
        var parent = document.querySelector('#card-parent') 
        parent.innerHTML = ""; 
        var start = startRow - 1;
        var end = endRow;
        for(let j=start; j<end; j++){
          
            createCard(array_list[j]); 
        }
        }
        catch(err){
            console.log("error writing card");
        }
        
    } 
 
    var resform = document.querySelector('#filter-form');
    resform.addEventListener('submit',(e)=>{
        e.preventDefault(); 
        populateResult();

    }) 
   
   
    function populateResult(){
        var parent = document.querySelector('#card-parent') 
        parent.innerHTML = ""; 
        var filterby = document.querySelector('#resultFilter')
            var fil_value = filterby.value;
            
            var search = document.querySelector('#result-term')
            var search_term = search.value; 
            search_term = search_term.split(" ").join(" ")
            search_term = search_term.toLowerCase(); 
            try{
               resList = [];
                for( k of array_list){ 
                    if(k[fil_value] != null) {
                        let data = k[fil_value].toLowerCase(); 
                      
                        if( data.includes(search_term)){
                            resList.push(k);
                        } 
                    }
                    else{

                    }
                }   
                try {  
                  var result = document.querySelector('.result') 
                  result.innerHTML = `<h4> ${resList.length} results found </h4>`
                  array_list = resList ; 
                 
                  paginationButtons(); 
                  
              }
              catch(err){
                  console.log(err);
                  var modal = document.querySelector('.modal')
                  var modalmsg = document.querySelector('#modal-msg')
                  modalmsg.innerHTML = `Error filtering result for this ${fil_value} and ${search_term} <br> ${err}`;
                  modal.style.display = 'block';
              }   

            }
            catch(err){
                console.log(err);
                var modal = document.querySelector('.modal')
                var modalmsg = document.querySelector('#modal-msg')
                modalmsg.innerHTML = `Error filtering result ${fil_value} and ${search_term} <br> ${err}`;
                modal.style.display = 'block';
            }
        

           
    }

   